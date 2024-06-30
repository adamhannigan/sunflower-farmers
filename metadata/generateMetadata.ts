import * as fs from "fs";
import sharp from "sharp";

// import image from "public/assets/food/bumpkin_salad.png";
import { InventoryItemName } from "features/game/types/game";
// import { KNOWN_IDS } from "features/game/types";
import { ITEM_DETAILS } from "features/game/types/images";

// import { KNOWN_IDS } from "../src/features/game/types";

// import { getKeys } from "features/game/types/craftables";
// import { OPEN_SEA_COLLECTIBLES, OPEN_SEA_WEARABLES } from "./metadata";
// import { ITEM_IDS } from "features/game/types/bumpkin";
// import { InventoryItemName } from "features/game/types/game";
// import { ITEM_DETAILS } from "features/game/types/images";

// function generateCollectibles() {
//   const items = getKeys(KNOWN_IDS);

//   // Generate/update metadata files
//   items.forEach((name) => {
//     const metadata = OPEN_SEA_COLLECTIBLES[name];

//     metadata.description = `# Description\n\n${metadata.description}\n\n### Contributor\n\nSunflower Land is a community game built by a hundreds of developers and artists across the globe.\nCome join us on [Github](https://github.com/sunflower-land/sunflower-land)`;

//     const oldPath = "../public/erc1155/images/";
//     const imageFileName = metadata.image.slice(oldPath.length);

//     metadata.image = `https://sunflower-land.com/play/erc1155/images/${imageFileName}`;

//     metadata.name = name;

//     // convert KNOWN_IDS[name] to hex zero padded with 64 zeros
//     const zeroPadded = KNOWN_IDS[name].toString(16).padStart(64, "0");

//     const jsonPath = path.join(
//       __dirname,
//       `../public/erc1155/${KNOWN_IDS[name]}.json`
//     );
//     const hexJsonPath = path.join(
//       __dirname,
//       `../public/erc1155/${zeroPadded}.json`
//     );

//     fs.writeFile(jsonPath, JSON.stringify(metadata), () => undefined);
//     fs.writeFile(hexJsonPath, JSON.stringify(metadata), () => undefined);
//   });

//   // Clean-up old metadata files
//   const metadataFolderPath = path.join(__dirname, "../public/erc1155/");

//   const fileItemIds = fs
//     .readdirSync(metadataFolderPath)
//     .filter((f) => f.includes(".json"))
//     .map((f) => f.split(".")[0]);

//   // As of November 2023, Opensea appears to be uses hex zero padded with 64 zeros to identify token IDs
//   // e.g. https://URL/0000...0001.json as per https://eips.ethereum.org/EIPS/eip-1155#metadata
//   // Previously was using decimals https://URL/1.json
//   // We need to support both for now
//   const idLookup = new Set<string>(
//     Object.values(KNOWN_IDS)
//       .map(String)
//       .concat(
//         Object.values(KNOWN_IDS).map((id) =>
//           Number(id).toString(16).padStart(64, "0")
//         )
//       )
//   );

//   fileItemIds.forEach((id) => {
//     if (!idLookup.has(id)) {
//       fs.rmSync(path.join(__dirname, `../public/erc1155/${id}.json`));
//     }
//   });
// }

// function generateWearables() {
//   const items = getKeys(ITEM_IDS);

//   // Generate/update metadata files
//   items.forEach((name) => {
//     const metadata = OPEN_SEA_WEARABLES[name];

//     metadata.description = `# Description\n\n${metadata.description}\n\n### Contributor\n\nSunflower Land is a community game built by a hundreds of developers and artists across the globe.\nCome join us on [Github](https://github.com/sunflower-land/sunflower-land)`;

//     const oldPath = "../public/wearables/images/";
//     const imageFileName = metadata.image.slice(oldPath.length);

//     metadata.image = `https://sunflower-land.com/play/wearables/images/${imageFileName}`;

//     metadata.name = name;

//     // convert KNOWN_IDS[name] to hex zero padded with 64 zeros
//     const zeroPadded = ITEM_IDS[name].toString(16).padStart(64, "0");

//     const jsonPath = path.join(
//       __dirname,
//       `../public/wearables/${ITEM_IDS[name]}.json`
//     );
//     const hexJsonPath = path.join(
//       __dirname,
//       `../public/wearables/${zeroPadded}.json`
//     );

//     fs.writeFile(jsonPath, JSON.stringify(metadata), () => undefined);
//     fs.writeFile(hexJsonPath, JSON.stringify(metadata), () => undefined);
//   });

//   // Clean-up old metadata files
//   const metadataFolderPath = path.join(__dirname, "../public/wearables/");

//   const fileItemIds = fs
//     .readdirSync(metadataFolderPath)
//     .filter((f) => f.includes(".json"))
//     .map((f) => f.split(".")[0]);

//   // As of November 2023, Opensea appears to be uses hex zero padded with 64 zeros to identify token IDs
//   // e.g. https://URL/0000...0001.json as per https://eips.ethereum.org/EIPS/eip-1155#metadata
//   // Previously was using decimals https://URL/1.json
//   // We need to support both for now
//   const idLookup = new Set<string>(
//     Object.values(KNOWN_IDS)
//       .map(String)
//       .concat(
//         Object.values(KNOWN_IDS).map((id) =>
//           Number(id).toString(16).padStart(64, "0")
//         )
//       )
//   );

//   fileItemIds.forEach((id) => {
//     if (!idLookup.has(id)) {
//       fs.rmSync(path.join(__dirname, `../public/wearables/${id}.json`));
//     }
//   });
// }

// generateWearables();
// generateCollectibles();

// async function generateImage({ name }: { name: InventoryItemName }) {
//   const ID = KNOWN_IDS[name];

//   if (fs.existsSync(`public/erc1155/images/${ID}.png`)) {
//     return;
//   }

//   const background = await sharp("public/erc1155/images/3x3_bg.png").toBuffer();
//   const itemImage = await sharp(ITEM_DETAILS[name].image).toBuffer();

//   // Composite item image onto background
//   const mergedImage = await sharp(background)
//     .composite([{ input: itemImage }])
//     .toBuffer();

//   fs.writeFileSync(`generated.png`, mergedImage);
// }

// generateImage({ name: "Abandoned Bear" });

const s: InventoryItemName = "Abandoned Bear";
console.log("EHLLO WORLD", s, ITEM_DETAILS[s]);
