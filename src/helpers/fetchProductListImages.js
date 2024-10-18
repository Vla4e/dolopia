
import placeholderImage from '@/assets/products/product-images/placeholder/placeholder.png';
import candiedFruitsPlaceholder from "@/assets/products/product-images/candied-fruits-placeholder/candied-fruits.png";


export async function getProductCodeToUrlMap(productCodes) {
  console.log("Product Codes", productCodes)
  // Import all images from 'product-images' directory
  const images = import.meta.glob('@/assets/products/product-images/projects/**/*.png', { eager: true, as: 'url' });
  const shadowsOverlaysImages = import.meta.glob('@/assets/products/product-images/shadows-overlay/**/*.png', { eager: true, as: 'url' });
  
  // Import placeholder images

  // Create a map from code to image information
  const codeToUrlMap = {};

  // Parse images and create a map
  const productImageMap = {};
  for (const path in images) {
    const filename = path.substring(path.lastIndexOf('/') + 1);
    let [prefix, codeWithExt] = filename.split('-');
    if (!codeWithExt) continue; // Skip files that don't match the expected pattern

    const code = codeWithExt.split('.')[0];

    // Build the product image map
    productImageMap[code] = {
      prefix: prefix,
      fullPath: images[path]
    };
  }

  // Loop through the product codes and build the codeToUrlMap
  for (const code of productCodes) {
    const imageInfo = productImageMap[code];

    if (!imageInfo) {
      // If image info is not found, use the placeholder
      codeToUrlMap[code] = {
        mainImage: placeholderImage,
        shadow: shadowsOverlaysImages['/src/assets/products/product-images/shadows-overlay/shadows/250.png'],
        overlay: shadowsOverlaysImages['/src/assets/products/product-images/shadows-overlay/overlays/250.png'],
        code: code,
        preload: true
      };
    } else {
      // Build the image data object
      codeToUrlMap[code] = {
        mainImage: imageInfo.fullPath,
        shadow: shadowsOverlaysImages[`/src/assets/products/product-images/shadows-overlay/shadows/${imageInfo.prefix}.png`] || null,
        overlay: shadowsOverlaysImages[`/src/assets/products/product-images/shadows-overlay/overlays/${imageInfo.prefix}.png`] || null,
        code: code,
        preload: true
      };
    }
  }

  return codeToUrlMap;
}
