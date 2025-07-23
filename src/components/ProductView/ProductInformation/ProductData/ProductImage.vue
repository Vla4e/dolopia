<script setup>
import { ref, watch, computed, onMounted, toRaw } from "vue";
import { useProductStoreCleanup } from "@/store/productCleanup";

const productStoreCleanup = useProductStoreCleanup();
const productData = computed(() => productStoreCleanup.currentProduct);
</script>

<template>
  <Transition name="fade-product-image" mode="out-in">
    <div
      v-if="productData"
      :key="productData.code"
      class="product-image"
    >
      <div class="space" />
      <img
        v-if="productData.properties?.shadow"
        :src="productData.properties.shadow"
        class="silhouette-shadow"
        alt="Shadow image"
      />
      <img
        v-if="productData.properties?.mainImage"
        :src="productData.properties.mainImage"
        class="product"
        alt="Product image"
      />
      <img
        v-if="productData.properties?.overlay"
        :src="productData.properties.overlay"
        class="highlight"
        alt="Highlight image"
      />
    </div>
    <div v-else-if="!isLoading" class="loading-placeholder">
      Loading...
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.product-image {
  position: relative;
  .silhouette-shadow,
  .product,
  .highlight {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @media (max-width: 450px) {
      height: auto;
    }
    @media (max-width: 390px) {
      height: 100% !important;
      width: auto !important;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .silhouette-shadow {
    z-index: 1;
    opacity: 0.8;
  }
  .product {
    z-index: 2;
  }
  .highlight {
    z-index: 3;
    opacity: 0.8;
  }
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