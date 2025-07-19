<script setup>
import placeholderImage from '@/assets/products/product-images/placeholder/placeholder.png';
import candiedFruitsPlaceholder from "@/assets/products/product-images/candied-fruits-placeholder/candied-fruits.png";
import leftChevron from "@/assets/project-catalog/left-chevron.png"
import rightChevron from "@/assets/project-catalog/right-chevron.png"
import cardBackground from "@/assets/project-catalog/card-background.png"
import cardBackgroundPlaceholder from "@/assets/product_overview/background.png"
import placeholderProduct from "@/assets/products/product-images/placeholder/placeholder.png"

// import { getProductImages } from "@/helpers/fetchProductListImages.js"
// // console.log("gpi", getProductImages)
import { getProductCodeToUrlMap } from '@/helpers/fetchProductListImages';

import {ref, computed, watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';

import { subcategoryToProductCodes, subcategoryToProductsMap } from "@/assets/products/subcategoryToProducts"
import { useProductStore } from '@/store/product';
const productStore = useProductStore()

let categoryData = computed(() => {
  return productStore.categoryData
})
let subcategoryData = computed(() => {
  return productStore.subcategoryData
})
let productData = computed(() => {
  return productStore.productData
})
let categoryIdentifier = ref(0)
let subcategoryIdentifier = ref(null)
let productIdentifier = ref(null)
watch(() => categoryData.value.name, (value) => {
  // console.log("LALALALLAL", value)
  productStore.subcategoryByIdentifier = categoryData.value.subcategories[0]
})
let currentCategoryIndex = 0
onMounted(() => {
  if(categoryData.value.name === 'tomato-project') currentCategoryIndex = 0
  else if (categoryData.value.name === 'vegetable-project') currentCategoryIndex = 1
  else if (categoryData.value.name === 'fruit-project') currentCategoryIndex = 2
  else currentCategoryIndex = 3
})
function cycleCategory(direction){
  // console.log("DIRECTION", direction, currentCategoryIndex)
  if(direction === 'right'){
    if(currentCategoryIndex === 3){
      currentCategoryIndex = 0
    } else {
      currentCategoryIndex++
    }
  } else {
    if(currentCategoryIndex === 0){
      currentCategoryIndex = 3
    } else {
      currentCategoryIndex--
    }
  }
  productStore.categoryByIdentifier = productStore.categoriesByIdentifier[currentCategoryIndex]
}

function selectSubcategory(value){
  productStore.subcategoryByIdentifier = value
  // console.log("value", value)
}


const removeAsterisks = (text) => {
  return text.replace(/\*/g, '');
};

function splitIntoParts (newProduct) {
  // Check if the product name contains "with" or "*"
  const withIndex = newProduct.indexOf(' with ')
  const asteriskIndex = newProduct.indexOf('*')
  let firstPart = ''
  let secondPart = ''
  if (withIndex !== -1) {
    // split at "with"
    firstPart = newProduct.slice(0, withIndex).trim()
    secondPart = newProduct.slice(withIndex).trim()
  } else if (asteriskIndex !== -1) {
    // Split at "*"
    firstPart = newProduct.slice(0, asteriskIndex).trim()
    secondPart = newProduct.slice(asteriskIndex + 1).trim()
  } else {
    // If neither "with" nor "*" is found, put everything in firstPart
    firstPart = newProduct.trim()
    secondPart = ''
  }

  return [firstPart, secondPart]
}
let processedProducts = computed(() => {
  return subcategoryData.value.productNames.map(product => {
    return splitIntoParts(product)
  });
})

import router from '@/router';
function goToRoute(categoryPath, subcategoryPath, productQuery ) {
  // console.log("going to product:", categoryPath, subcategoryPath, productQuery)
  router.replace({
    name: "projects",
    params: { 
      category: categoryPath, 
      subcategory: subcategoryPath 
    },
    query: {
      productCode: productQuery
    }
  }).catch((e) => {
    // console.log("Navigation error:", e);
    console.error(e);
  });
}
const productImageMap = ref({})
let mapLoaded = ref(false)
async function updateProductImageMap() {
  // console.log("updating PIM")
  if (subcategoryData.value.productIdentifiers) {
    mapLoaded.value = false
    let tempMap = await getProductCodeToUrlMap(subcategoryData.value.productIdentifiers, true); // useCompressed => true
    productImageMap.value = tempMap;
    mapLoaded.value = true
  }
}
watch(() => subcategoryData.value.productIdentifiers, () => {
    updateProductImageMap();
  },  
{ immediate: true });

// function handleTouchStart(event) {
//   event.target.focus(); // Trigger focus on touch
// }
// onMounted( async () => {
//   const chevrons = document.querySelectorAll('.chevron');
//   chevrons.forEach(chevron => {
//     chevron.addEventListener('touchstart', handleTouchStart);
//   });
// })
// onBeforeUnmount(() => {
//   const chevrons = document.querySelectorAll('.chevron');
//   chevrons.forEach(chevron => {
//     chevron.removeEventListener('touchstart', handleTouchStart);
//   });
// })

</script>

<template>
  <div class="projects-mobile">
    <div class="selection-menu">

      <div class="categories">
        <img @click="cycleCategory('left')" :src="leftChevron" class="chevron left">
        <span class="category">
          {{ categoryData.fullName }}
        </span>
        <img @click="cycleCategory('right')" :src="rightChevron" class="chevron right">
      </div>

      <ul class="subcategories">
        <li 
          v-for="( subcategory, idx) in categoryData.subcategories" 
          :key="subcategory" 
          class="item"
          :class="productStore.subcategoryByIdentifier === subcategory ? 'selected' : ''"
          @click="selectSubcategory(subcategory)"
        >
          <span class="text">
            {{ categoryData.subcategoryNames[idx] }}
          </span>
        </li>
      </ul>

    </div>
    <ul class="product-list">
      <!-- subcategoryData.products is a map so we have to destructure [key,value] -->
      <li 
        v-for="([key, value], idx) in subcategoryData.products" 
        :key="key" 
        class="product-card"
        @click="goToRoute(categoryData.name, subcategoryData.name, key)"
      >
        <div  class="image-container">
          <img class="background" :src="cardBackgroundPlaceholder"/>
          <img v-if="mapLoaded" class="highlight" :src="productImageMap[key].overlay"/>
          <img v-if="mapLoaded" class="shadow-silhouette" :src="productImageMap[key].shadow"/>
          <img v-if="mapLoaded" class="product" :src="productImageMap[key].mainImage"/>
        </div>
        
        <!-- <SelectionInformationPanel class="current-selection-info"/> -->

        <div class="product-texts">
          <div class="category-subcategory">
            <span class="category"> {{ categoryData.fullName }}</span>
            <span class="vertical-line"/>
            <span class="subcategory"> {{ subcategoryData.fullName }}</span>
          </div>
          <div class="product-text-container">
              <h2 class="product-name">
                <span class="large-text">
                  {{ processedProducts[idx][0] }}
                </span>
                <span class="medium-text">
                  {{ processedProducts[idx][1] }}
                </span>
              </h2>
              <p class="product-description">
                {{ value["Short Description EN"] }}
              </p>
          </div>

        </div>
      </li>
    </ul>
  </div>
</template>


<style lang="scss" scoped>
.projects-mobile{
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  .selection-menu{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 250px;
    background: #44A0AD;
    .categories{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 25%;
      width: 90%;
      margin-left: auto;
      margin-right: auto;
      .category{
        color: #000;
        font-family: "Century Gothic";
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        text-transform: uppercase;
      }
      .chevron{
        width: 10px;
        height: 20px;
        transition: transform 0.3s ease;
        &.left{

        }
        &.right{

        }
        &:focus{
          transform: scale(110%);
        }
      }
    }
    .subcategories{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 95%;
      margin-left: auto;
      margin-right: auto;
      height: 80px;
      .item{
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        padding: 5px 15px;
        min-height: 50px; 
        &.selected{
          background: rgba(255, 255, 255, 0.50);
        }
        .text{
          color: #000;
          font-family: "Century Gothic";
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 10px; /* 83.333% */
          text-transform: uppercase;
        }
      }
    }
  }
  .product-list{
    display: grid;
    width: 95%;
    max-width: 95%;
    overflow:hidden;
    margin-left: auto;
    margin-right: auto;
    row-gap: 60px;
    grid-template-columns: 48% 48%;
    column-gap: 4%;
    margin-top: 30px;
    .product-card{
      display: flex;
      flex-direction: column;
      .image-container{
        position: relative;
        width: 100%;
        height: auto;
        .background{
          width: 100%;
          height: 250px;
          border-top-right-radius: 20px;
          border-top-left-radius: 20px;
        }
        .product, .shadow-silhouette, .highlight{
          width: 100%;
          height: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      
      .product-texts{
        width: 100%;
        margin-top: 10px;
        .category-subcategory{
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          min-width: 30px;
          .category, .subcategory{
            color: #000;
            font-family: "Century Gothic";
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            letter-spacing: 0.9px;
            text-transform: capitalize;
          }
        }
        .product-name{
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 5px;
          .large-text{
            color: #000;
            font-family: "Century Gothic";
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px; /* 100% */
            letter-spacing: 2.16px;
            text-transform: uppercase;
            text-wrap:wrap;
            word-break: normal;
          }
          .medium-text{
            color: #000;
            font-family: "Century Gothic";
            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
            letter-spacing: 1.08px;
            text-transform: uppercase;
          }
        }
        .product-description{
          color: #000;
          font-family: "Raleway";
          font-size: 10px;
          font-style: normal;
          font-weight: 400;
          line-height: 15px; /* 150% */
        }
      }
    }
  }
}
.vertical-line{
  display: flex;
  width: 1px;
  height: 15px;
  background-color: #131313;
  margin-left: 5px;
  margin-right: 5px;
}
</style>