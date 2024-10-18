<template>
  <div class="left-content">
    <h1 class="current-selection">
      <span class="category">
        <!-- {{ productStore.selectedCategory }} -->
        <!-- <ManualCarousel /> -->
        <Dropdown 
          :forType="'category'"
          :items="mergedCategoryItems"
          :changeByType="{
            flag: true,
            type: 'category'
          }"
          :selectedItemProp="selectedCategoryProp"
          :dropdownAlignment="'left'"
        />
      </span>
      <span class="vertical-line"/>
      <span class="subcategory">
        <!-- <ManualCarousel /> -->
        <!-- {{ productStore.selectedSubcategory.name }} -->
        <Dropdown
          :forType="'subcategory'"
          :items="mergedSubcategoryItems" 
          :changeByType="{
            flag: true,
            type: 'subcategory'
          }"
          :selectedItemProp="selectedSubcategoryProp"
          :dropdownAlignment="'center'"
        />
      </span>
    </h1>
    <div class="suggested-product-container">
        <h2 class="product-name">
          <span class="large-text">
            {{ firstPart }}
          </span>
          <span class="medium-text">
            <!-- with mint & pepper -->
            {{ secondPart }}
          </span>
        </h2>
        <p class="product-description">
          {{ productStore.productData.properties['Short Description EN'] }}
        </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, toRaw, computed } from 'vue';
import { useRouteParamsStore } from '@/store/routeParams.js'
import Dropdown from '../Dropdown/Dropdown.vue';
import ManualCarousel from '../VerticalCarousel/VerticalCarousel.vue';

import { useProductStore } from '@/store/product';
const productStore = useProductStore();
let categoryData = computed(() => productStore.categoryData)
let productData = computed(() => productStore.productData);
console.log("CD", categoryData)
console.log("PD", productData)

const routeParamsStore = useRouteParamsStore();

const mergedCategoryItems = ref([]);
const mergedSubcategoryItems = ref([]);
let selectedProductProp = ref({});
let selectedCategoryProp = ref('')
let selectedSubcategoryProp = ref('')

watch(() => mergedCategoryItems.value, (val) => {
  // console.log('triggered MCI', val[0])
  selectedCategoryProp.value = val[0].identifier
})
watch(() => mergedSubcategoryItems.value, (val) => {
  // console.log('triggered MSI', val)
  selectedSubcategoryProp.value = val[0].identifier
})

watch(() => selectedSubcategoryProp.value, (val) => {
  // console.log("change detected in SUBCATPROP")
})

// Function to update merged items
const updateMergedItems = () => {

  const categoriesCopy = Object.values(productStore.categories);
  mergedCategoryItems.value = Object.values(productStore.categoriesFullNames).map((item, idx) => ({
    name: item,
    identifier: categoriesCopy[idx]
  }));
  mergedSubcategoryItems.value = productStore.subcategoryNames.map((item, idx) => ({
    name: item,
    identifier: productStore.subcategories[idx]
  }));

};


let firstPart = ref('')
let secondPart = ref('')
watch(() => productStore.productData.name, (newProduct) => {
  // Check if the product name contains "with" or "*"
  const withIndex = newProduct.indexOf(' with ')
  const asteriskIndex = newProduct.indexOf('*')

  if (withIndex !== -1) {
    // split at "with"
    firstPart.value = newProduct.slice(0, withIndex).trim()
    secondPart.value = newProduct.slice(withIndex).trim()
  } else if (asteriskIndex !== -1) {
    // Split at "*"
    firstPart.value = newProduct.slice(0, asteriskIndex).trim()
    secondPart.value = newProduct.slice(asteriskIndex + 1).trim()
  } else {
    // If neither "with" nor "*" is found, put everything in firstPart
    firstPart.value = newProduct.trim()
    secondPart.value = ''
  }

  console.log("First part:", firstPart.value)
  console.log("Second part:", secondPart.value)
}, {
  immediate: true
})
// Call updateMergedItems immediately
updateMergedItems();

// Watch for changes in productStore
watch(() => [
    productStore.categories, 
    productStore.categoriesFullNames, 
    productStore.subcategoryNames, 
    productStore.subcategories
  ], 
  updateMergedItems, 
  { deep: true }
);

onMounted(() => {
  // console.log("Component mounted");
  updateMergedItems(); // Update again in case any async data loaded
  // console.log("mounted product", toRaw(productStore.selectedProduct))
});
</script>

<style lang="scss" scoped>
.left-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 45%;
  height: 100%;
  position: absolute;
  z-index:3;
  .current-selection{
    display: flex;
    width: 79%;
    margin-left: auto;
    margin-right: auto;
    .category{
      font-family: 'Century Gothic';
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      color: black;
      display: flex;
    }
    .vertical-line{
      width: 2px;
      height: 100%;
      background-color: black;
      margin-left: 10px;
      margin-right: 10px;
    }
    .subcategory{
      font-family: "Century Gothic";
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      color: black;
      text-transform: uppercase;
      display: flex;
    }
  }
  .suggested-product-container{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    .product-name{
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-bottom: 20px;
      transition: height 0.3s ease;
      .large-text{
        font-family: "Century Gothic";
        font-weight: 400;
        font-style: normal;
        font-size: 50px;
        color: black; 
        transition: height 0.3s ease;
      }
      .medium-text{
        font-family: "Century Gothic";
        font-weight: 400;
        font-style: normal;
        font-size: 24px;
        color: black;
        transition: height 0.3s ease;
      }
    }
    .product-description{
      font-family: "Raleway";
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: black;
      max-width: 65%;
      transition: height 0.3s ease;
    }
  }
}
</style>