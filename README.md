[![Build and deploy](https://github.com/spun/deno-msi-rss/actions/workflows/deploy.yml/badge.svg)](https://github.com/spun/deno-msi-rss/actions/workflows/deploy.yml)

A personal project that generates unofficial RSS feeds to track the latest BIOS
releases for MSI motherboards.

## How does it work?

Every few days, a GitHub workflow runs a program that queries the MSI API,
fetches all BIOS releases for the selected motherboard, and generates an XML
file containing the RSS feed.

That XML file is then uploaded to a static content host (Firebase Hosting),
where it can be used by any RSS reader.

## Why?

🤷‍♂️

I still like RSS feeds, and I thought it would be neat to receive BIOS update
notifications this way.

## What about the [official RSS feeds](https://www.msi.com/rss/)

Their feeds are in reverse order, which confuses RSS readers, and everything is
mixed into one feed (BIOS, drivers, utilities, etc.). I only want updates about
new BIOS releases.

## How to use it for other MSI motherboards

You can fork this and generate your own feeds. If you want to use Firebase
Hosting, just make sure to follow the
[Firebase Hosting GitHub Action README](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/README.md)
and modify the `deploy.yml` workflow to change the `projectId`.

Or just create an [issue](https://github.com/spun/deno-msi-rss/issues) with your
request. I don’t mind adding more models.
