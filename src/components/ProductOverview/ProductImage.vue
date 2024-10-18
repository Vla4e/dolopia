<script setup>
import { ref, watch, computed, onMounted, toRaw } from 'vue'

import { useProductStore } from '@/store/product';
const productStore = useProductStore();
const productData = computed(() => productStore.productData);
const subcategoryData = computed(() => productStore.subcategoryData);
const categoryByIdentifier = computed(() => productStore.categoryByIdentifier)

const images = import.meta.glob('@/assets/products/product-images/projects/**/*.png', { eager: true, as: 'url' });
const shadowsOverlaysImages = import.meta.glob('@/assets/products/product-images/shadows-overlay/**/*.png', { eager: true, as: 'url' });
const candiedFruitsPlaceholder = import.meta.glob('@/assets/products/product-images/candied-fruits/*.png', { eager: true, as: 'url' });
import placeholderImage from '@/assets/products/product-images/placeholder/placeholder.png'

const productImageMap = ref({});
const imagesParsed = ref(false);
const isLoading = ref(true);
const currentImages = ref(null);
const nextImages = ref(null);

// Parse images and create product code to image info map
const parseImages = () => {
  const newMap = {};
  for (const path in images) {
    const filename = path.substring(path.lastIndexOf('/') + 1);
    let [prefix, code] = filename.split('-');
    if (code) {
      code = code.split('.')[0];
      newMap[code] = {
        prefix: prefix,
        fullPath: images[path]
      };
    }
  }
  productImageMap.value = newMap;
  imagesParsed.value = true;
};

// Get images for current product
const getProductImages = async (code) => {
  console.log("getting product images for", code)
  if (!code) return null;
  
  if (subcategoryData.value.isCandiedFruit) {
    return {
      mainImage: Object.values(candiedFruitsPlaceholder)[0],
      shadow: shadowsOverlaysImages['/src/assets/products/product-images/shadows-overlay/shadows/250.png'],
      overlay: shadowsOverlaysImages['/src/assets/products/product-images/shadows-overlay/overlays/250.png'],
      code: code
    };
  }

  const imageInfo = productImageMap.value[code];
  if (!imageInfo) { //default placeholder
    return {
      mainImage: placeholderImage,
      shadow: shadowsOverlaysImages['/src/assets/products/product-images/shadows-overlay/shadows/250.png'],
      overlay: shadowsOverlaysImages['/src/assets/products/product-images/shadows-overlay/overlays/250.png'],
      code: code,
      preload: true
    }
  };

  if(categoryByIdentifier.value === 'pasta-project'){
    return {
      mainImage: imageInfo.fullPath,
      shadow: null,
      overlay: null,
      code: code,
      preload: false
    };
  }
  
  console.log("Will return:", imageInfo.fullPath, imageInfo.prefix)
  return {
    mainImage: imageInfo.fullPath,
    shadow: shadowsOverlaysImages[`/src/assets/products/product-images/shadows-overlay/shadows/${imageInfo.prefix}.png`],
    overlay: shadowsOverlaysImages[`/src/assets/products/product-images/shadows-overlay/overlays/${imageInfo.prefix}.png`],
    code: code,
    preload: true
  };
};

// Preload images
const preloadImages = (imageUrls) => {
  return Promise.all(imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
  }));
};

async function preloadWrapper(code) {
  isLoading.value = true;
  console.log("getting images")
  nextImages.value = await getProductImages(code);
  console.log("got images")
  if (nextImages.value && nextImages.preload) {
    console.log("preloading")
    try {
      await preloadImages([nextImages.value.mainImage, nextImages.value.shadow, nextImages.value.overlay]);
      console.log("finished preloading")
      currentImages.value = nextImages.value;
      nextImages.value = null;
    } catch (error) {
      console.error("Error preloading images:", error);
    }
  } else {
    currentImages.value = nextImages.value
  }
  isLoading.value = false;
}

watch(() => productData.value.code, async (newCode) => {
  if (newCode) {
    await preloadWrapper(newCode)
  }
});

onMounted(async () => {
  parseImages();
  if (productData.value.code) {
    await preloadWrapper(productData.value.code);
  }
});
</script>

<template>
  <Transition name="fade-product-image" mode="out-in">
    <div v-if="imagesParsed && currentImages && !isLoading" :key="currentImages.code" class="product-image">
      <div class="space"/>
      <img v-if="categoryByIdentifier !== 'pasta-project'" :src="currentImages.shadow" class="silhouette-shadow"/>
      <img :src="currentImages.mainImage" class="product" alt="Product image" />
      <img v-if="categoryByIdentifier !== 'pasta-project'" :src="currentImages.overlay" class="highlight"/>
    </div>
    <div v-else-if="isLoading" class="loading-placeholder">
      <!-- Add a loading spinner or placeholder here -->
      Loading...
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.product-image {
  position: relative;
  .silhouette-shadow, .product, .highlight {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .silhouette-shadow { z-index: 1; }
  .product { z-index: 2; }
  .highlight { z-index: 3; }
}

.loading-placeholder {
  // Style your loading placeholder here
}

.fade-product-image-enter-active,
.fade-product-image-leave-active {
  transition: opacity 0.5s ease;
}

.fade-product-image-enter-from,
.fade-product-image-leave-to {
  opacity: 0;
}
</style>