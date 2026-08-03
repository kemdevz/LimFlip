// scripts/findDuplicates.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import process from "node:process";

async function main() {
  // 1) Load your JSON
  const raw = await fs.readFile(path.resolve('./MM2ItemsData.json'), 'utf8');
  const jsonData: Record<string, { Properties: any }> = JSON.parse(raw);

  // 2) Normalize helper (same as in your other script)
  const normalize = (str: any) =>
    (str || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\(\)'"]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9 ]/g, '');

  // 3) Build groups by "display|rarity"
  type Group = { uid: string; display: string; rarity: string };
  const groups = new Map<string, Group[]>();

  for (const [uid, { Properties }] of Object.entries(jsonData)) {
    const display = normalize(Properties.DisplayName);
    const rarity  = normalize(Properties.Rarity);
    const key     = `${display}|${rarity}`;

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ uid, display, rarity });
  }

  // 4) Filter only duplicates
  const duplicates = Array.from(groups.entries())
    .filter(([, items]) => items.length > 1)
    .map(([key, items]) => ({
      display: items[0].display,
      rarity:  items[0].rarity,
      uids:    items.map(i => i.uid),
    }));

  if (duplicates.length === 0) {
    console.log('✅ No duplicate DisplayName+Rarity pairs found.');
    return;
  }

  // 5) Report to console
  console.log(`⚠️ Found ${duplicates.length} duplicate groups:\n`);
  for (const dup of duplicates) {
    console.log(
      `• "${dup.display}" (rarity="${dup.rarity}") → UIDs: ${dup.uids.join(', ')}`
    );
  }

  // 6) Write out to file
  const outPath = path.resolve('./duplicates.json');
  await fs.writeFile(outPath, JSON.stringify(duplicates, null, 2), 'utf8');
  console.log(`\n📝 Wrote duplicate groups to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
