import { cdata, stringify, type xml_document } from "@libs/xml";
import { Product, products } from "./products.ts";

const FEEDS_FOLDER = "public/feeds/";

/**
 * A response from the msi api
 */
type ApiResponse = {
  result: {
    downloads: {
      "AMI BIOS": {
        download_id: number;
        download_url: string;
        download_description: string;
        download_size: number;
        download_version: string;
        download_release: string;
      }[];
    };
  };
};

/**
 * Creates a new xml file with the RSS feed for the given product.
 * @param product The product with the required information to generate the feed
 */
async function generateFeedForProduct(product: Product) {
  // Fetch JSON with data
  const api_url =
    `https://www.msi.com/api/v1/product/support/panel?product=${product.link_id}&type=bios`;
  const response = await fetch(api_url, { "method": "GET" });

  // Parse to JSON
  const responseJson: ApiResponse = await response.json();

  // Get list of releases
  const biosReleases = responseJson.result.downloads["AMI BIOS"];

  if (biosReleases.length == 0) {
    throw Error("No releases were found");
  }

  function generateReleaseFooter(
    productPage: string,
    releasePage: string,
  ): string {
    return `
      <br/><hr/>
      <a href="${productPage}">Go to downloads page</a> | 
      <a href="${releasePage}">Get this version</a>
      <br/><br/>
    `;
  }

  // Generate xml text
  const xml = stringify(
    {
      "@version": "1.0",
      "@encoding": "UTF-8",
      rss: {
        "@version": "2.0",
        "@xmlns:atom": "http://www.w3.org/2005/Atom",
        channel: {
          title: product.name,
          description: "Feed generated automatically",
          link: product.bios_page,
          item: biosReleases.map((release) => ({
            guid: release.download_url,
            title:
              `${release.download_version} - (${release.download_release})`,
            description: cdata(
              // Insert HTML <br/> tag for every newline character so that line breaks are
              // preserved in RSS readers.
              // NOTE: We are also keeping the original newlines for readability in the XML.
              release.download_description.replaceAll("\n", "<br/>\n") +
                generateReleaseFooter(product.bios_page, release.download_url),
            ),
            pubDate: new Date(release.download_release).toUTCString(),
            link: `${product.bios_page}:~:text=${
              encodeURI(release.download_version)
            }`,
          })),
        },
      },
    } satisfies Partial<xml_document>,
  );

  // Put the xml file inside a folder with the name of the motherboard in case we want
  // to add other feed types in the future.
  const productFolder = product.link_id
    .replace(/[^a-zA-Z0-9-_ ]/g, "_")
    .toLowerCase();

  const productPath = FEEDS_FOLDER + productFolder;

  // Ensure the directory exists
  await Deno.mkdir(productPath, { recursive: true });

  // Save xml to file
  await Deno.writeTextFile(`${productPath}/bios.xml`, xml);
}

/**
 * Get all selected products and generate a feed file for each one
 */
async function generateAllFeeds() {
  // Remove any previously generated feeds
  try {
    await Deno.remove(FEEDS_FOLDER, { recursive: true });
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }

  const results = await Promise.allSettled(
    products.map((product) => generateFeedForProduct(product)),
  );

  const failedWorks = results
    .filter((result) => result.status === "rejected")
    .map((result) => ({
      product: products[results.indexOf(result)].name,
      error: (result as PromiseRejectedResult).reason,
    }));

  // If we had a failed feed generation, exit with error
  if (failedWorks.length > 0) {
    console.error(failedWorks);
    Deno.exit(1);
  }
}

// Start
generateAllFeeds();
