const noblox = require('noblox.js');

/**
 * Convert a Roblox asset ID to a CDN image URL
 * Format: https://tr.rbxcdn.com/{hash}/{width}/{height}/Model/Png/noFilter
 * 
 * @param {string} assetId - The Roblox asset ID (can be with or without rbxassetid:// prefix)
 * @param {number} width - Image width (default: 420)
 * @param {number} height - Image height (default: 420)
 * @returns {Promise<string>} The CDN URL for the asset
 */
async function getAssetCdnUrl(assetId, width = 420, height = 420) {
  try {
    // Remove rbxassetid:// prefix if present
    const cleanAssetId = assetId.replace('rbxassetid://', '');
    
    // Use noblox to get the asset thumbnail
    const thumbnail = await noblox.getAssetThumbnail(cleanAssetId, width, 'png', false);
    
    // The thumbnail URL from noblox is already in the correct CDN format
    return thumbnail;
  } catch (error) {
    console.error('Error getting asset CDN URL:', error);
    
    // Fallback to a simpler format if noblox fails
    // This uses the Roblox thumbnail API directly
    return `https://www.roblox.com/asset-thumbnail/image?assetId=${assetId.replace('rbxassetid://', '')}&width=${width}&height=${height}&format=png`;
  }
}

/**
 * Extract asset ID from various formats
 * @param {string} assetString - Asset ID in any format (rbxassetid://123, 123, etc.)
 * @returns {string} Clean numeric asset ID
 */
function extractAssetId(assetString) {
  if (!assetString) return '';
  return assetString.toString().replace('rbxassetid://', '').replace(/[^0-9]/g, '');
}

/**
 * Convert asset ID to rbxassetid:// format
 * @param {string} assetId - Asset ID (with or without prefix)
 * @returns {string} Asset ID with rbxassetid:// prefix
 */
function toRbxAssetId(assetId) {
  const cleanId = extractAssetId(assetId);
  return cleanId ? `rbxassetid://${cleanId}` : '';
}

module.exports = {
  getAssetCdnUrl,
  extractAssetId,
  toRbxAssetId
};
