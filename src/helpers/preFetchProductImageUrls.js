// initialization.js
import { allProductMap } from '@/assets/products/allProductMap';
import placeholderImageGeneral from '@/assets/products/product-images/placeholder/placeholder.png';
import candiedFruitsPlaceholder from "@/assets/products/product-images/candied-fruits-placeholder/candied-fruits.png";

// Precompute and cache image maps at module level
const mainImageModules = import.meta.glob('@/assets/products/product-images/projects/**/*.png', { eager: true, as: 'url' });
const shadowsOverlaysModules = import.meta.glob('@/assets/products/product-images/shadows-overlay/**/*.png', { eager: true, as: 'url' });

// Build cache structures
const [compressedMainImageMap, uncompressedMainImageMap] = (() => {
  const compressed = {};
  const uncompressed = {};
  
  for (const path in mainImageModules) {
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const isCompressed = filename.includes('-compressed.png');
    const baseFilename = filename.replace(/-compressed\.png$/, '').replace(/\.png$/, '');
    
    const [prefix, ...codeParts] = baseFilename.split('-');
    const code = codeParts.join('-');
    
    if (isCompressed) {
      compressed[code] = { prefix, url: mainImageModules[path] };
    } else {
      uncompressed[code] = { prefix, url: mainImageModules[path] };
    }
  }
  
  return [compressed, uncompressed];
})();

const [shadowsMap, overlaysMap] = (() => {
  const shadows = {};
  const overlays = {};
  
  for (const path in shadowsOverlaysModules) {
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const key = filename.replace(/-compressed\.png$/, '');
    // console.log("--path-shadow-overlay--", path)
    
    if (path.includes('/shadows/')) {
      shadows[key] = shadowsOverlaysModules[path];
    } else if (path.includes('/overlays/')) {
      overlays[key] = shadowsOverlaysModules[path];
    }
  }
  
  return [shadows, overlays];
})();

// Function to get image URLs for a single product code
function getImageUrlsForCode(code, useCompressed = true) {
  const mainImageMap = useCompressed ? compressedMainImageMap : uncompressedMainImageMap;
  
  // Special case for candied fruits
  const placeholder = code === 'GTL280' 
    ? candiedFruitsPlaceholder 
    : placeholderImageGeneral;

  const imageInfo = mainImageMap[code];
  if (!imageInfo) {
    return {
      mainImage: placeholder,
      shadow: shadowsMap['250'],
      overlay: overlaysMap['250'],
      preload: true
    };
  } else {
    return {
      mainImage: imageInfo.url,
      shadow: shadowsMap[imageInfo.prefix] || null,
      overlay: overlaysMap[imageInfo.prefix] || null,
      preload: true
    };
  }
}

// Main initialization function that modifies allProductMap in place
export function initializeProductImages(useCompressed = true) {
  console.log(`Initializing product images for ${allProductMap.size} products...`);
  
  // Iterate through the existing map and enhance each entry
  for (const [code, productData] of allProductMap) {
    const imageUrls = getImageUrlsForCode(code, useCompressed);
    
    // Modify the existing product data object in place
    productData.mainImage = imageUrls.mainImage;
    productData.shadow = imageUrls.shadow;
    productData.overlay = imageUrls.overlay;
    productData.preload = imageUrls.preload;
    
    // Update the map with the enhanced data
    allProductMap.set(code, productData);
  }
  
  console.log(`✅ Product images initialized successfully!`);
  return allProductMap;
}