require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');
const cheerio = require('cheerio');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloxbashh';

// Supreme Value List
const SUPREME_VALUE_LIST_BASE_URL = 'https://supremevaluelist.com/mm2/{}.html';
const CDN_URL = 'https://supremevaluelist.com';
const ITEM_CATEGORIES = [
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
  'misc',
];

// Cookie storage for session persistence
let cookies = '';

// Function to fetch HTML content with bypass attempts
async function fetchHtmlContent(url) {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ];

  const headers = {
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'Referer': 'https://supremevaluelist.com/',
    'Origin': 'https://supremevaluelist.com'
  };

  if (cookies) {
    headers['Cookie'] = cookies;
  }

  try {
    const response = await fetch(url, { headers });
    
    // Store cookies from response
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      cookies = setCookieHeader.split(';')[0];
    }

    if (!response.ok) {
      console.error(`❌ Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    
    const text = await response.text();
    
    // Check if we hit Incapsula
    if (text.includes('Incapsula') || text.includes('_Incapsula_Resource')) {
      console.log(`  ⚠️  Incapsula protection detected, trying alternative approach...`);
      
      // Try with a simple GET request first to establish session
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simpleResponse = await fetch('https://supremevaluelist.com/', {
        headers: {
          'User-Agent': headers['User-Agent'],
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });
      
      if (simpleResponse.ok) {
        const simpleText = await simpleResponse.text();
        console.log(`  Main page length: ${simpleText.length}`);
      }
      
      return null;
    }
    
    console.log(`  HTML length: ${text.length}`);
    if (text.length < 1000) {
      console.log(`  First 500 chars: ${text.substring(0, 500)}`);
    }
    
    return text;
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error);
    return null;
  }
}

// Function to normalize item name for matching
function normalizeItemName(name) {
  return name
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+/g, '');
}

// Function to process each category
async function processCategory(category) {
  const url = SUPREME_VALUE_LIST_BASE_URL.replace('{}', category);
  console.log(`Processing category: ${category} - ${url}`);
  
  const htmlContent = await fetchHtmlContent(url);
  if (!htmlContent) {
    console.log(`  ❌ Failed to fetch HTML content`);
    return { updatedCount: 0, notFoundCount: 0 };
  }

  const $ = cheerio.load(htmlContent);
  
  // Debug: Log the HTML structure to understand the layout
  console.log(`  HTML length: ${htmlContent.length}`);
  
  // Try different selectors to find items
  const itemColumns = $('.itemcolumn');
  const itemCells = $('.itemcell');
  const itemCellsExp = $('.itemcell-exp');
  
  console.log(`  Found ${itemColumns.length} .itemcolumn`);
  console.log(`  Found ${itemCells.length} .itemcell`);
  console.log(`  Found ${itemCellsExp.length} .itemcell-exp`);
  
  // Try alternative selectors
  const allDivs = $('div').length;
  const itemsWithHead = $('.itemhead').length;
  const itemsWithValue = $('.itemvalue').length;
  
  console.log(`  Total divs: ${allDivs}`);
  console.log(`  Items with .itemhead: ${itemsWithHead}`);
  console.log(`  Items with .itemvalue: ${itemsWithValue}`);

  let updatedCount = 0;
  let notFoundCount = 0;

  // If .itemcolumn doesn't work, try to find items directly
  if (itemColumns.length === 0 && itemsWithHead > 0) {
    console.log(`  Using alternative selector for items`);
    const heads = $('.itemhead');
    
    for (let i = 0; i < heads.length; i++) {
      const $head = $(heads[i]);
      const itemName = $head.text().trim();
      if (!itemName) continue;

      // Find the parent cell to get value
      const $parent = $head.closest('.itemcell, .itemcell-exp, div');
      const itemValueText = $parent.find('.itemvalue').text().trim();
      const itemValue = itemValueText
        ? parseInt(itemValueText.replace(/,/g, ''), 10) || 0
        : 0;

      // Normalize item name for matching
      const normalizedName = normalizeItemName(itemName);

      console.log(`  Checking item: ${itemName} (value: ${itemValue})`);

      // Find and update item in database
      const dbItem = await Item.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${normalizedName}$`, 'i') } },
          { name: itemName }
        ]
      });

      if (dbItem) {
        dbItem.value = itemValue;
        await dbItem.save();
        console.log(`  ✅ Updated ${dbItem.name}: ${itemValue}`);
        updatedCount++;
      } else {
        console.log(`  ⚠️  Not found in database: ${itemName} (normalized: ${normalizedName})`);
        notFoundCount++;
      }
    }
  } else {
    // Original logic with .itemcolumn
    for (const itemColumn of itemColumns.toArray()) {
      const $column = $(itemColumn);
      const itemcellString = category === 'pets' ? '.itemcell-exp' : '.itemcell';
      const itemCells = $column.find(itemcellString);
      console.log(`  Found ${itemCells.length} item cells in column`);

      for (const itemCell of itemCells.toArray()) {
        const $cell = $(itemCell);
        
        let itemName = $cell.find('.itemhead').text().trim();
        if (!itemName) continue;

        const itemValueText = $cell.find('.itemvalue').text().trim();
        const itemValue = itemValueText
          ? parseInt(itemValueText.replace(/,/g, ''), 10) || 0
          : 0;

        // Normalize item name for matching
        const normalizedName = normalizeItemName(itemName);

        console.log(`  Checking item: ${itemName} (value: ${itemValue})`);

        // Find and update item in database
        const dbItem = await Item.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${normalizedName}$`, 'i') } },
            { name: itemName }
          ]
        });

        if (dbItem) {
          dbItem.value = itemValue;
          await dbItem.save();
          console.log(`  ✅ Updated ${dbItem.name}: ${itemValue}`);
          updatedCount++;
        } else {
          console.log(`  ⚠️  Not found in database: ${itemName} (normalized: ${normalizedName})`);
          notFoundCount++;
        }
      }
    }
  }

  return { updatedCount, notFoundCount };
}

// Main function to process all categories
async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');

    let totalUpdated = 0;
    let totalNotFound = 0;

    for (const category of ITEM_CATEGORIES) {
      const { updatedCount, notFoundCount } = await processCategory(category);
      totalUpdated += updatedCount;
      totalNotFound += notFoundCount;
      
      // Wait a bit between categories to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n=== Update Summary ===');
    console.log(`✅ Updated: ${totalUpdated}`);
    console.log(`⚠️  Not found: ${totalNotFound}`);
    console.log(`📊 Total processed: ${totalUpdated + totalNotFound}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

main();
