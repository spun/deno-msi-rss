/**
 * Necessary information to generate a feed for the motherboard.
 */
export type Product = {
  /**
   * The motherboard name. This will be used as part of the title for the feed.
   * @example "MAG B650 TOMAHAWK WIFI"
   */
  name: string;
  /**
   * The identifier used by the msi page to link to this product.
   * @example "MAG-B650-TOMAHAWK-WIFI"
   */
  link_id: string;
  /**
   * The page where users can go to download new releases. This will be the main link for the feed.
   */
  bios_page: string;
  /**
   * A link to the product image.
   */
  image_url: string;
};

// Info from https://www.msi.com/api/v1/product/getProductList?product_line=mb
export const products: Product[] = [
  {
    name: "MAG B650 TOMAHAWK WIFI",
    link_id: "MAG-B650-TOMAHAWK-WIFI",
    bios_page:
      "https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/support#bios",
    image_url:
      "https://asset.msi.com/resize/image/global/product/product_166478620721bbeb5fac5e7800fc1614cf6e023720.png62405b38c58fe0f07fcef2367d8a9ba1/400.png",
  },
];
