

<script setup>
import { ref, watch, computed, toRaw } from "vue";
import { useProductStoreCleanup } from "@/store/productCleanup.js";

const productStoreCleanup = useProductStoreCleanup();
let currentProduct = computed(() => {
  return productStoreCleanup.currentProduct
})


const mergedSubcategoryItems = computed(() => {
  const currentCat = productStoreCleanup.currentCategory;
  if (!currentCat || !currentCat.subcategories) {
    return [];
  }
  return currentCat.subcategoryNames.map((name, idx) => ({
    name: name,
    identifier: currentCat.subcategories[idx],
  }));
});

</script>

<template>
  <div class="selection-information-panel">
    <div class="selection-information-positioning-container">
      <h1 class="current-selection breadcrumbs">

        <router-link :to="`/projects/${productStoreCleanup.currentCategory.id}`" class="category">
          {{ productStoreCleanup.currentCategory.name }} &nbsp;
        </router-link>

        <svg
          width="15px"
          height="15px"
          xmlns="http://www.w3.org/2000/svg"
          fill="#131313"
          class="bi bi-chevron-right chevron"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
          />
        </svg>

        <router-link :to="`/projects/${productStoreCleanup.currentCategory.id}/${productStoreCleanup.currentSubcategory.id}`" class="subcategory">
          &nbsp;{{ productStoreCleanup.currentSubcategory.name }}
        </router-link>

      </h1>

      <div class="suggested-product-container">

        <h2 class="product-name">
          <span class="large-text">
            {{ currentProduct.properties.splitName.firstPart }}
          </span>
          <span class="medium-text">
            {{ currentProduct.properties.splitName.secondPart }}
          </span>
        </h2>

        <p class="product-description">
          {{ productStoreCleanup.currentProduct.properties["Short Description EN"] }}
        </p>
      </div>

      <div class="subcategory-selection" style="color: #131313">
        <router-link
          v-for="(subcat, idx) in mergedSubcategoryItems"
          :key="subcat.identifier"
          :to="`/projects/${productStoreCleanup.currentCategory.id}/${subcat.identifier}`"
          class="subcategory-item"
          :class="{
            active: subcat.identifier === productStoreCleanup.selectedSubcategoryId,
          }"
        >
          {{ subcat.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selection-information-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 45%;
  height: 100%;
  position: absolute;
  z-index: 3;
  .selection-information-positioning-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 70%;
    z-index: 3;
    position: relative;
  }
  .current-selection {
    display: flex;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    align-items: center;
    .category,
    .subcategory {
      color: #000;
      text-align: right;
      font-family: "Raleway";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px; /* 133.333% */
      letter-spacing: 1.08px;
      cursor: pointer;
      @media (min-width: 1900px) {
        font-size: 16px;
      }

      transition: color 0.2s ease;
      &:hover{
        color: #2B565D;
      }
    }
  }
  .suggested-product-container {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    .product-name {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-bottom: 20px;
      transition: height 0.3s ease;
      .large-text {
        font-family: "Century Gothic";
        font-weight: 400;
        font-style: normal;
        font-size: 50px;
        line-height: 55px;
        color: black;
        transition: height 0.3s ease;
      }
      .medium-text {
        font-family: "Century Gothic";
        font-weight: 400;
        font-style: normal;
        font-size: 24px;
        color: black;
        transition: height 0.3s ease;
      }
    }
    .product-description {
      font-family: "Raleway";
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: black;
      max-width: 65%;
      transition: height 0.3s ease;
    }
  }
  .subcategory-selection {
    position: absolute;
    bottom: 0;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    .subcategory-item{
      color: #000;
      // text-align: right;
      font-family: "Raleway";
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px; /* 123.077% */
      letter-spacing: 1.17px;
      cursor: pointer;
      &.active {
        font-weight: 700;
      };
      &:not(:last-child)::after{
        content: " | ";
      }
    }
    span {
      color: #000;
      // text-align: right;
      font-family: "Raleway";
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px; /* 123.077% */
      letter-spacing: 1.17px;
      cursor: pointer;
      &.active {
        font-weight: 700;
      }
    }
  }
}
</style>
