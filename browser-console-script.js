// PASTE THIS IN YOUR BROWSER CONSOLE ON https://supremevaluelist.com (NOT supremevalues.com)
// This script will scrape all item values from the current page and navigate to others

(async function scrapeItemValues() {
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

  const allItems = [];

  console.log('🚀 Starting item value scrape...');
  console.log('⚠️  Make sure you are on https://supremevaluelist.com');

  // Start from the first category
  let currentCategoryIndex = 0;

  function scrapeCurrentPage() {
    const itemCells = document.querySelectorAll('.itemcell, .itemcell-exp');
    const currentCategory = categories[currentCategoryIndex];
    
    console.log(`Scraping ${currentCategory}: found ${itemCells.length} items`);
    
    for (const cell of itemCells) {
      const itemName = cell.querySelector('.itemhead')?.textContent?.trim();
      const itemValueText = cell.querySelector('.itemvalue')?.textContent?.trim();
      const itemValue = itemValueText ? parseInt(itemValueText.replace(/,/g, ''), 10) || 0 : 0;
      
      if (itemName) {
        allItems.push({
          itemName: itemName,
          itemValue: itemValue,
          category: currentCategory
        });
      }
    }

    currentCategoryIndex++;

    if (currentCategoryIndex < categories.length) {
      // Navigate to next category
      setTimeout(() => {
        window.location.href = `https://supremevaluelist.com/mm2/${categories[currentCategoryIndex]}.html`;
      }, 2000);
    } else {
      // All done, download JSON
      downloadJSON();
    }
  }

  function downloadJSON() {
    console.log(`✅ Scrape complete! Found ${allItems.length} total items`);

    const jsonContent = JSON.stringify(allItems, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'itemValues.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('📥 Downloaded itemValues.json');
  }

  // Check if we need to start from the beginning
  const currentPath = window.location.pathname;
  const currentCategory = categories.find(cat => currentPath.includes(cat));

  if (currentCategory) {
    currentCategoryIndex = categories.indexOf(currentCategory);
    console.log(`Starting from current category: ${currentCategory}`);
    scrapeCurrentPage();
  } else {
    console.log('Navigating to first category...');
    window.location.href = 'https://supremevaluelist.com/mm2/uniques.html';
  }

  // Store data in localStorage to persist across page loads
  localStorage.setItem('scrapedItems', JSON.stringify(allItems));
  localStorage.setItem('currentCategoryIndex', currentCategoryIndex.toString());

  // On page load, check if we're continuing a scrape
  window.addEventListener('load', () => {
    const savedItems = localStorage.getItem('scrapedItems');
    const savedIndex = localStorage.getItem('currentCategoryIndex');
    
    if (savedItems && savedIndex) {
      const parsedItems = JSON.parse(savedItems);
      const parsedIndex = parseInt(savedIndex);
      
      // Restore the items array
      allItems.length = 0;
      allItems.push(...parsedItems);
      currentCategoryIndex = parsedIndex;
      
      console.log(`Resuming scrape... Found ${allItems.length} items so far`);
      
      setTimeout(() => {
        scrapeCurrentPage();
      }, 1000);
    }
  });
})();
