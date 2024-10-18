# ClickCrate
A social e-commerce platform that lets you sell physical goods at the click of a button directly in any game, social media post, or digital experience. Unlock headless, multichannel, embedded sales at scale with the click of a button using your existing tech stack.

[ClickCrate Chrome Extension](https://github.com/r3x-tech/clickcrate-chrome-extension) - [ClickCrate Storefronts](https://github.com/r3x-tech/clickcrate-storefronts) - [ClickCrate API](https://github.com/r3x-tech/clickcrate-api-test) - [ClickCrate Blinks & Actions](https://github.com/r3x-tech/creator-blink-api) - [Docs](https://docs.clickcrate.xyz/) - [Website](https://www.clickcrate.xyz/) - [Pitch Deck](https://www.canva.com/design/DAGSe9jrasA/ygRTI9BWmVDMayE8K4i0kQ/view?utm_content=DAGSe9jrasA&utm_campaign=designshare&utm_medium=link&utm_source=editor)

## Getting Started 

/creator-program  - Core ClickCrate program that allows distributed sales of goods.

/creator-dashboard - No code dashboard for creating + managing your ClickCrate products, points of sale, and orders.

To get started with the dashboard see: [https://github.com/r3x-tech/clickcrate/blob/main/clickcrate-dashboard/README.md](https://github.com/r3x-tech/clickcrate/blob/main/clickcrate-dashboard/README.md) OR [https://dashboard.clickcrate.xyz/](https://dashboard.clickcrate.xyz/)

To get started with the on-chain program see: [https://github.com/r3x-tech/clickcrate/blob/main/clickcrate-program/README.md](https://github.com/r3x-tech/clickcrate/blob/main/clickcrate-program/README.md)

To join our beta & become a verified seller signup here: [https://forms.gle/4bfY9yQpxXngyFEb9](https://forms.gle/4bfY9yQpxXngyFEb9)

## Architecture
![Architecture Diagram](https://github.com/user-attachments/assets/20236e63-99d0-4a27-a8e2-9f62e3b06d0d)

## The Tech

ClickCrate currently supports Metaplex Core NFTs together with associated plugins (ie. attribute, oracle, etc.) to represent products, listings, and points of sale. Once products, listings, and points of sale are registered with the ClickCrate program they can be managed using direct cross program invocations (CPIs), calls to the API, or the ClickCrate dashboard for no-code use cases such Dialect Blinks rendering UI on social platforms. As customers place orders via posted ClickCrate blinks on any platform, order information is routed to the order management system defined upon creation with fulfillment, delivery, and returns being reflected in the on-chain product registry. 

> **NOTE:**  
All physical products are are tokenized with a digital NFT receipt serving as your proof of purchase and source of truth. So while sales are direct they are aggregated by product listing and no matter where you post your blink your orders will all come into your order management system of choice. 

> **⚠️ NOTICE:**  
> Although we are working on PRs to add support to the Dialect chrome extension, currently, if you would like to use blinks on social platforms outside of X, you will need to install the [ClickCrate Chrome Extension](https://github.com/r3x-tech/clickcrate-chrome-extension).



