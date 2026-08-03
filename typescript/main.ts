import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { MongoClient } from "mongodb";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";

// MongoDB Config
const MONGO_URI =
  "mongodb+srv://realkanoob:9heUgEg6HnBTmwb9@cluster0.peehy.mongodb.net/";
const DB_NAME = "DEV";
const COLLECTION_NAME = "itemValues";

// Bunny.net Config (For storing final images)
const BUNNY_PULL_ZONE_URL = "https://mm2-item-images.b-cdn.net/";

// Supreme Value List
const SUPREME_VALUE_LIST_BASE_URL = "https://supremevaluelist.com/mm2/{}.html";
const CDN_URL = "https://supremevaluelist.com";
const ITEM_CATEGORIES = [
  "uniques",
  "ancients",
  "evos",
  "vintages",
  "chromas",
  "godlies",
  "legendaries",
  "rares",
  "uncommons",
  "commons",
  "pets",
  "misc",
];

// Ensure "images" folder exists
const IMAGE_FOLDER = "./images";
if (!existsSync(IMAGE_FOLDER)) {
  mkdirSync(IMAGE_FOLDER);
}

// Connect to MongoDB
const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db(DB_NAME);
const itemsCollection = db.collection(COLLECTION_NAME);

// ✅ Function to create a unique identifier for each item
function generateUniqueId(
  itemYear: string | null,
  itemName: string,
  itemType: string,
  game: string,
  itemCategory: string | null,
): string {
  return `${
    itemName.replace(/\s+/g, "_")
  }_${itemYear}_${itemType}_${game}_${itemCategory}`
    .toLowerCase();
}

// Function to fetch HTML content
async function fetchHtmlContent(url: string): Promise<string | null> {
  let retries = 0;
  while (retries < 10) {
    try {
      const response = await fetch(url);
      if (response.status === 429) {
        console.warn(`⚠️ Too many requests, retrying in 1 second...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        retries++;
        continue;
      }
      if (!response.ok) {
        console.error(`❌ Failed to fetch ${url}: ${response.status}`);
        return null;
      }
      return await response.text();
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error);
      return null;
    }
  }
  return null;
}

async function downloadImage(imageUrl: string, filename: string) {
  let retries = 0;
  while (retries < 10) {
    try {
      if (existsSync(`${IMAGE_FOLDER}/${filename}`)) {
        console.log(`✅ Skipping ${filename}, already exists`);
        return;
      }
      const response = await fetch(imageUrl);
      if (!response.ok) {
        if (response.status === 429) {
          console.log(
            `❌ Rate limit exceeded, waiting 1 second before retry ${
              retries + 1
            }`,
          );
          await new Promise((r) => setTimeout(r, 1000));
          retries++;
          continue;
        }
        console.error(`❌ Failed to fetch image: ${imageUrl}`);
        return;
      }

      const imgBuffer = await response.arrayBuffer();
      writeFileSync(`${IMAGE_FOLDER}/${filename}`, Buffer.from(imgBuffer));
      console.log(`✅ Saved ${filename}`);
      return;
    } catch (error) {
      console.error(`❌ Error downloading image ${filename}:`, error);
      retries++;
    }
  }
  console.error(`❌ Maximum retries reached, giving up on ${filename}`);
}

// Function to save or update item in MongoDB
async function saveItemToMongo(
  itemYear: string | null,
  itemName: string,
  itemValue: number,
  itemCategory: string,
  absoluteImageUrl: string,
) {
  const {
    itemName: formattedItemName,
    itemType,
  } = getItemDetails(itemName);
  const game = "MM2"; // Static game field
  const UID = generateUniqueId(
    itemYear,
    formattedItemName,
    itemCategory,
    game,
    itemType,
  ); // ✅ Generate permanent ID
  await downloadImage(
    absoluteImageUrl,
    UID +
      ".png",
  );
  // Check if the item already exists
  const existingItem = await itemsCollection.findOne({ UID });

  if (existingItem) {
    const update: any = { itemValue };

    if (!existingItem.itemImage) {
      update.itemImage = `${BUNNY_PULL_ZONE_URL}${UID}.png`;
    }

    await itemsCollection.updateOne({ UID }, { $set: update });
    console.log(
      `✅ Updated item: ${formattedItemName} with value: ${itemValue}`,
    );
  } else {
    await itemsCollection.insertOne({
      UID, // ✅ Unique ID stored in MongoDB
      itemName,
      itemValue,
      itemYear,
      itemPrefix: formattedItemName,
      itemType,
      itemCategory,
      itemImage: `${BUNNY_PULL_ZONE_URL}${
        formattedItemName.replace(/\s+/g, "_")
      }.png`,
      game,
    });

    console.log(`✅ Inserted new item: ${itemName}`);
  }
}

// Function to process each category
async function processCategory(category: string) {
  const url = SUPREME_VALUE_LIST_BASE_URL.replace("{}", category);
  const htmlContent = await fetchHtmlContent(url);
  if (!htmlContent) return;

  const document = new DOMParser().parseFromString(htmlContent, "text/html");
  if (!document) return;

  // ✅ Find all .itemcolumn elements directly
  const itemColumns = document.querySelectorAll("div.itemcolumn");

  for (const itemColumn of itemColumns) {
    let itemcellString = category === "pets" ? ".itemcell-exp" : ".itemcell";
    const itemCells = itemColumn.querySelectorAll(itemcellString);

    for (const itemCell of itemCells) {
      let itemName = itemCell.querySelector(".itemhead")?.textContent?.trim();
      if (!itemName) continue;

      const itemValueText = itemCell.querySelector(".itemvalue")?.textContent
        ?.trim();
      const itemValue = itemValueText
        ? parseInt(itemValueText.replace(/,/g, ""), 10) || 0
        : 0;
      const itemOriginText = itemCell
        .querySelector(".itemorigin")
        ?.textContent ?? "";

      // only match 1900–2099 when NOT followed by "Coins" or "Cash"
      const itemYear: string | null = itemOriginText
        .match(/\b(19|20)\d{2}\b(?!\s*(?:Coins|Cash)\b)/)?.[0] ??
        null;

      const imageElement = itemCell.querySelector("img.itemimage");
      const relativeImageUrl = imageElement?.getAttribute("src")?.trim();
      if (!relativeImageUrl) continue;

      const absoluteImageUrl = `${CDN_URL}${
        relativeImageUrl.replace("..", "")
      }`;

      await saveItemToMongo(
        itemYear,
        itemName,
        itemValue,
        category,
        absoluteImageUrl,
      );
    }
  }
}

function getItemDetails(
  name: string,
): { itemName: string; itemType: string | null } {
  const match = name.match(/^(.+?)\s*\(([^)]+)\)$/);

  return {
    itemName: name.replace(/\s*\([^)]*\)/g, "").replace(/'s/g, "").replace(
      /\s+/g,
      "",
    ), // Remove spaces and parentheses content
    itemType: match ? match[2] : null, // Extract type if available, else null
  };
}

// Main function to process all categories
async function main() {
  for (const category of ITEM_CATEGORIES) {
    await processCategory(category);
  }
  console.log("✅ Finished downloading images & saving data.");
}

if (Deno.args.includes("--dev")) {
  console.log("🚀 Running in development mode...");
  main().catch((error) => console.error("❌ Error in execution:", error));
} else {
  console.log("⏰ Running in scheduled mode...");
  Deno.cron("update-mm2-item-values", "0 * * * *", async () => {
    console.log("⏰ Running the script...");
    try {
      await main();
      console.log("✅ Script execution finished.");
    } catch (error) {
      console.error("❌ Error in scheduled execution:", error);
    }
  });
}

console.log("🚀 Scheduler is running. The script will execute every hour.");
