<script setup>
//ProductsViewMobile
import leftChevron from "@/assets/project-catalog/left-chevron.png";
import rightChevron from "@/assets/project-catalog/right-chevron.png";

import ProductImage from "../ProductView/ProductInformation/ProductData/ProductImage.vue";
import ProductEmbeddedMobile from "./ProductEmbeddedMobile.vue";

import SelectionMenu from "../SelectionMenu.vue";

import { ref, computed, onMounted } from "vue";

import { useProductStoreCleanup } from "@/store/productCleanup";

const productStore = useProductStoreCleanup();

// Updated to use new store structure
let productData = computed(() => {
  console.log(productStore.currentProduct);
  return productStore.currentProduct;
});

let productIdentifiers = computed(() => {
  return productStore.currentSubcategory.productCodes;
});

let iterator = 0;

onMounted(() => {
  iterator = productIdentifiers.value.indexOf(productData.value.code);
});

function cycleProduct(direction) {
  if (direction === "right") {
    if (iterator === productIdentifiers.value.length - 1) {
      iterator = 0;
    } else {
      iterator++;
    }
  } else {
    if (iterator === 0) {
      iterator = productIdentifiers.value.length - 1;
    } else {
      iterator--;
    }
  }
  // Use the new store method
  productStore.selectProduct(productIdentifiers.value[iterator]);
  iterator = productIdentifiers.value.indexOf(productStore.selectedProductCode);
}

let showMenu = ref(true);
</script>

<template>
  <div :class="showMenu ? '' : 'hidden'" class="products-mobile">
    <SelectionMenu />
    <div class="selection-menu-product">
      <div class="products">
        <img @click="cycleProduct('left')" :src="leftChevron" class="chevron left" />
        <span class="product">
          <span class="large-text">{{ productData.properties.splitName.firstPart }}</span>
          <span class="small-text">{{
            productData.properties.splitName.secondPart
          }}</span>
        </span>
        <img @click="cycleProduct('right')" :src="rightChevron" class="chevron right" />
      </div>
    </div>

    <ProductImage class="product-image" />

    <div class="dynamic-container">
      <div key="description" class="description">
        <p>
          {{ productData.properties["Description EN"] }}
        </p>
      </div>
    </div>

    <ProductEmbeddedMobile class="data-menu" />

    <!-- <PhaseCarousel 
      @selectedPhaseFromCarousel="selectedPhaseFromCarousel"
      @cyclePhase="cyclePhase"
      :currentPhaseIndex="currentPhaseIndex"
      :currentPhaseName="currentPhaseName" 
      :phasesShownOnCarousel="phasesShownOnCarousel"
    /> -->
  </div>
</template>

<style lang="scss" scoped>
.products-mobile {
  // flex-grow:1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
  // margin-top: 10vh;
  .product-image {
    width: 90%;
    height: auto;
    min-height: 50vh;
    max-height: 45%;
  }
  .dynamic-container {
    margin-top: 20px;
    margin-bottom: 20px;
    @media(min-width: 400px){
      margin-top: 30px;
    }
    @media(min-width: 430px){
      margin-top: 70px;
    }
    .description {
      width: 95%;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 20px;
      p {
        color: #000;
        text-align: center;
        font-family: "Raleway";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
        @media (max-width: 390px) {
          font-size: 12px;
        }
      }
    }
  }
}
.selection-menu-product {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  min-height: 20%;
  max-height: 25%;
  @media (max-width: 390px) {
    min-height: 15%;
  }
  margin-top: 30px;
  .products {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    .product {
      display: flex;
      flex-direction: column;
      width: 90%;
      justify-content: center;
      align-items: center;
      .large-text {
        color: #000;
        text-align: center;
        font-family: "Century Gothic";
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 75% */
        letter-spacing: 2.88px;
        text-transform: uppercase;
        margin-bottom: 10px;
        @media (max-width: 390px) {
          font-size: 18px;
          margin-bottom: 5px;
        }
        @media (max-width: 365px) {
          font-size: 16px;
          margin-bottom: 5px;
        }
      }
      .small-text {
        color: #000;
        text-align: center;
        font-family: "Century Gothic";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
        letter-spacing: 1.44px;
        text-transform: uppercase;
        @media (max-width: 365px) {
          font-size: 14px;
        }
      }
    }
    .chevron {
      width: 10px;
      height: 20px;
      transition: transform 0.3s ease;
      &.left {
      }
      &.right {
      }
      &:focus {
        transform: scale(110%);
      }
    }
  }
}
// .hidden {
//   transform: translateY(-160px);
//   .selection-menu {
//     transform: translateY(-30px);
//   }
// }
.data-menu {
  position: fixed;
  bottom: 0%;
}
</style>
