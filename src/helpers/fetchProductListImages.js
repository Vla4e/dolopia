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

export async function getProductCodeToImageUrlMap(productCodes, useCompressed) {
  const codeToUrlMap = {};
  const mainImageMap = useCompressed ? compressedMainImageMap : uncompressedMainImageMap;

  for (const code of productCodes) {
    // Special case for candied fruits
    const placeholder = code === 'GTL280' 
      ? candiedFruitsPlaceholder 
      : placeholderImageGeneral;

    const imageInfo = mainImageMap[code];
    if (!imageInfo) {
      codeToUrlMap[code] = {
        mainImage: placeholder,
        shadow: shadowsMap['250'],
        overlay: overlaysMap['250'],
        code,
        preload: true
      };
    } else {
      codeToUrlMap[code] = {
        mainImage: imageInfo.url,
        shadow: shadowsMap[imageInfo.prefix] || null,
        overlay: overlaysMap[imageInfo.prefix] || null,
        code,
        preload: true
      };
    }
  }

  return codeToUrlMap;
}