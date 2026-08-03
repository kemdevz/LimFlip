const puppeteer = require('puppeteer');
const fs = require('fs');

const categories = [
  'uniques',
  'ancients', 
  'evos',
  'vintages',
  'chromas',
  'godlies',
  'legendaries',
  'rares',
  'uncommons',
  'commons',
  'pets',
  'misc'
];

async function scrapeItemValues() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true to run in background
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const allItems = [];

  console.log('🚀 Starting item value scrape with Puppeteer...');
  console.log('⏰ Giving you 10 seconds to complete any verification...');

  // Navigate to the site and wait for user to complete verification
  await page.goto('https://supremevaluelist.com/mm2/uniques.html', { waitUntil: 'networkidle2' });
  
  // Wait 10 seconds for user to complete verification
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log('✅ Starting scrape now...');

  for (const category of categories) {
    console.log(`Processing category: ${category}`);
    
    try {
      const url = `https://supremevaluelist.com/mm2/${category}.html`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait for items to load
      await page.waitForSelector('.itemcell, .itemcell-exp', { timeout: 10000 });

      // Scrape items
      const items = await page.evaluate(() => {
        const itemCells = document.querySelectorAll('.itemcell, .itemcell-exp');
        const items = [];

        for (const cell of itemCells) {
          const itemName = cell.querySelector('.itemhead')?.textContent?.trim();
          const itemValueText = cell.querySelector('.itemvalue')?.textContent?.trim();
          const itemValue = itemValueText ? parseInt(itemValueText.replace(/,/g, ''), 10) || 0 : 0;

          if (itemName) {
            // Generate mm2.rocks image URL
            const itemNameSlug = itemName.toLowerCase().replace(/\s+/g, '-');
            const imageUrl = `https://mm2.rocks/images/mm2-wiki/${itemNameSlug}.png`;

            items.push({
              itemName: itemName,
              itemValue: itemValue,
              imageUrl: imageUrl
            });
          }
        }

        return items;
      });

      // Add category to each item
      items.forEach(item => {
        item.category = category;
        allItems.push(item);
      });

      console.log(`  Found ${items.length} items in ${category}`);

    } catch (error) {
      console.error(`  Error scraping ${category}:`, error.message);
    }

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();

  console.log(`✅ Scrape complete! Found ${allItems.length} total items`);

  // Save to JSON file
  const outputPath = '/Users/radovan/Desktop/Business/projects/bloxbashh/typescript/DEV.itemValues.json';
  fs.writeFileSync(outputPath, JSON.stringify(allItems, null, 2));
  console.log(`📥 Saved to ${outputPath}`);
}

scrapeItemValues().catch(console.error);
