// scripts/syncBestMatch.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { MongoClient, ObjectId } from 'mongodb';
import process from 'node:process';

const changeImageToRoblox = false;

function normalize(str: string) {
  return (str || '').toString().trim().toLowerCase()
    .replace(/[\(\)'\"]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '');
}

function singularize(word: string) {
  word = normalize(word);
  if (word.endsWith('ives')) return word.replace(/ives$/, 'ife');
  if (word.endsWith('ves'))  return word.replace(/ves$/, 'f');
  if (word.endsWith('ies'))  return word.replace(/ies$/, 'y');
  if (word.endsWith('s'))    return word.slice(0, -1);
  return word;
}

async function fetchWithRetry(url: string, retries = 3, delay = 5000): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching (attempt ${attempt}): ${url}`);
      const response = await fetch(url);
      const json = await response.json();
      if (json?.data?.length > 0) {
        console.log(`✔ Success for chunk (${json.data.length} images)`);
        return json;
      }
      throw new Error('Empty data or rate limited');
    } catch (err) {
      console.warn(`⚠️ Attempt ${attempt} failed for ${url}`);
      if (attempt < retries) {
        console.log(`⏳ Waiting ${delay / 1000}s before retry...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error(`❌ All ${retries} attempts failed for: ${url}`);
        throw err;
      }
    }
  }
}

async function main() {
  const raw = await fs.readFile(path.resolve('./MM2ItemsData.json'), 'utf8');
  const jsonData: Record<string, any> = JSON.parse(raw);

  const uri = 'mongodb+srv://realkanoob:9heUgEg6HnBTmwb9@cluster0.peehy.mongodb.net';
  if (!uri) throw new Error('MONGODB_URI env var not set');
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db('DEV').collection('itemValues');

  const docs = await col.find(
    {},
    { projection: { _id: 1, itemName: 1, itemType: 1, itemCategory: 1, itemYear: 1 } }
  ).toArray();

  let matched = 0;
  const unmatched: string[] = [];

  const imageIdToUid: Record<string, string> = {};
  const imageIdsToFetch: string[] = [];

  const updates: { _id: any; update: Record<string, any> }[] = [];

  for (const [uid, { Properties, ImageId }] of Object.entries(jsonData)) {
    // 1) Normalize JSON properties
    const display     = normalize(Properties.DisplayName);
    const jsonType    = normalize(Properties.ItemType || '');
    const jsonRarity  = normalize(Properties.Rarity   || '');
    const jsonYear    = Properties.Year != null ? String(Properties.Year) : null;
    const jsonImageId = ImageId;

    // 2) Compute JSON category
    const base = singularize(jsonRarity);
    const jsonCat = base.endsWith('y') ? base.slice(0, -1) + 'ies' : base + 's';

    // 3) Year match helper
    const yearMatches = (d: typeof docs[number]) =>
      (d.itemYear != null && jsonYear != null)
        ? String(d.itemYear) === jsonYear
        : true;

    let match: typeof docs[number] | null = null;



    // —— FALLBACK: exact match
    if (!match) {
      const exactNameCands = docs.filter(d =>
        yearMatches(d) &&
        (d.itemType == null || normalize(d.itemType) === jsonType) &&
        normalize(d.itemCategory) === jsonCat &&
        normalize(d.itemName) === display
      );
      if (exactNameCands.length === 1) {
        match = exactNameCands[0];
      }
    }

    // —— FALLBACK: category + name startsWith
    if (!match) {
      const cands = docs.filter(d =>
        yearMatches(d) &&
        (d.itemType == null || normalize(d.itemType) === jsonType) &&
        normalize(d.itemCategory) === jsonCat &&
        normalize(d.itemName).startsWith(display)
      );
      if (cands.length === 1) {
        match = cands[0];
      }
    }

    // —— FALLBACK: type + name startsWith
    if (!match) {
      const cands = docs.filter(d =>
        yearMatches(d) &&
        (d.itemType == null || normalize(d.itemType) === jsonType) &&
        normalize(d.itemName).startsWith(display)
      );
      if (cands.length === 1) {
        match = cands[0];
      }
    }

    // —— FALLBACK: name startsWith only
    if (!match) {
      const cands = docs.filter(d =>
        yearMatches(d) &&
        normalize(d.itemName).startsWith(display)
      );
      if (cands.length === 1) {
        match = cands[0];
      }
    }

    if (match) {
      const update: Record<string, any> = { inGameUID: uid };
      if (changeImageToRoblox && jsonImageId) {
        imageIdToUid[jsonImageId] = uid;
        imageIdsToFetch.push(jsonImageId);
      }
      updates.push({ _id: match._id, update });
      matched++;
    } else {
      unmatched.push(uid);
    }
  }

  // (The rest of your image-fetching & update logic remains unchanged)
  if (changeImageToRoblox && imageIdsToFetch.length > 0) {
    const uniqueIds = [...new Set(imageIdsToFetch)];
    const chunkSize = 100;
    for (let i = 0; i < uniqueIds.length; i += chunkSize) {
      const chunk = uniqueIds.slice(i, i + chunkSize);
      const url = `https://thumbnails.roblox.com/v1/assets?assetIds=${chunk.join(',')}&returnPolicy=0&size=420x420&format=Png&isCircular=false`;
      try {
        const json = await fetchWithRetry(url);
        for (const entry of json.data || []) {
          const uid = imageIdToUid[entry.targetId];
          const update = updates.find(u => u.update.inGameUID === uid);
          if (update && entry.imageUrl) {
            update.update.itemImage = entry.imageUrl;
            await col.updateOne(
              { _id: new ObjectId(update._id) },
              { $set: update.update }
            );
            console.log(`✔ Set image for UID ${uid}: ${entry.imageUrl}`);
          } else {
            console.warn(`⚠ No image found for UID ${uid}`);
          }
        }
      } catch (e) {
        console.warn('❌ Failed to batch-fetch Roblox images after retries:', e);
      }
    }
  }

  const outPath = path.resolve('./unmatched.json');
  await fs.writeFile(outPath, JSON.stringify(unmatched, null, 2), 'utf8');
  console.log(`⚠️ Wrote ${unmatched.length} unmatched UIDs to ${outPath}`);

  const total = Object.keys(jsonData).length;
  const successPct = (matched / total) * 100;
  const failPct = 100 - successPct;
  console.log(`✅ Matched:   ${matched}/${total} (${successPct.toFixed(2)}%)`);
  console.log(`❌ Unmatched: ${total - matched}/${total} (${failPct.toFixed(2)}%)`);

  await client.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
