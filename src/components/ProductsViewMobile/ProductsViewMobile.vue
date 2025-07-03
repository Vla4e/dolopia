<script setup>
import leftChevron from "@/assets/project-catalog/left-chevron.png";
import rightChevron from "@/assets/project-catalog/right-chevron.png";

import ProductImage from "../ProductView/ProductInformation/ProductData/ProductImage.vue";
import ProductEmbeddedMobile from "./ProductEmbeddedMobile.vue";

import { ref, computed, onMounted } from "vue";

import { useProductStore } from "@/store/product";
const productStore = useProductStore();
let productData = computed(() => {
  return productStore.productData;
});
let productIdentifiers = computed(() => {
  return productStore.subcategoryData.productIdentifiers;
});
let processedProductName = computed(() => {
  return splitIntoParts(productData.value.name);
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
  productStore.productCodeByIdentifier = productIdentifiers.value[iterator];
}

let currentPhaseName = ref("description");

function splitIntoParts(newProduct) {
  // Check if the product name contains "with" or "*"
  const withIndex = newProduct.indexOf(" with ");
  const asteriskIndex = newProduct.indexOf("*");
  let firstPart = "";
  let secondPart = "";
  if (withIndex !== -1) {
    // split at "with"
    firstPart = newProduct.slice(0, withIndex).trim();
    secondPart = newProduct.slice(withIndex).trim();
  } else if (asteriskIndex !== -1) {
    // Split at "*"
    firstPart = newProduct.slice(0, asteriskIndex).trim();
    secondPart = newProduct.slice(asteriskIndex + 1).trim();
  } else {
    // If neither "with" nor "*" is found, put everything in firstPart
    firstPart = newProduct.trim();
    secondPart = "";
  }

  return [firstPart, secondPart];
}
const localPhases = ["none", "description", "wheel", "data"];
let currentPhaseIndex = ref(0);
let isTransitioning = ref(false);
const Backward = false; //scrollUp
const Forward = true; //scrollDown
let test = true;
function cyclePhase(direction) {
  if (test) return;
  if (!props.isOverviewActive) {
    return;
  }
  if (!currentPhaseIndex.value) {
    currentPhaseIndex.value = 1;
    currentPhaseName.value = localPhases[currentPhaseIndex.value];
    isTransitioning.value = true;
    emit("phaseChange", currentPhaseName.value);
    return;
  }
  if (!isTransitioning.value) {
    if (direction === Forward) {
      if (currentPhaseIndex.value < localPhases.length - 1) {
        currentPhaseIndex.value++;
      } else {
        currentPhaseIndex.value = 1;
      }
    } else {
      if (currentPhaseIndex.value === 1) {
        currentPhaseIndex.value = localPhases.length - 1;
      } else {
        currentPhaseIndex.value--;
      }
    }
    currentPhaseName.value = localPhases[currentPhaseIndex.value];
    isTransitioning.value = true;
  }
}
function selectedPhaseFromCarousel(phaseIndex) {
  if (test) return;
  currentPhaseIndex = phaseIndex;
  currentPhaseName.value = localPhases[currentPhaseIndex];
  isTransitioning.value = true;
}
const phasesShownOnCarousel = ["description", "wheel", "data"];
</script>

<template>
  <div class="products-mobile">
    <div class="selection-menu">
      <div class="products">
        <img @click="cycleProduct('left')" :src="leftChevron" class="chevron left" />
        <span class="product">
          <span class="large-text">{{ processedProductName[0] }}</span>
          <span class="small-text">{{ processedProductName[1] }}</span>
        </span>
        <img @click="cycleProduct('right')" :src="rightChevron" class="chevron right" />
      </div>
    </div>

    <ProductImage class="product-image" />

    <div class="dynamic-container">
      <div
        v-if="currentPhaseName === 'description'"
        key="description"
        class="description"
      >
        <p>
          {{ productData.properties["Description EN"] }}
        </p>
      </div>
    </div>

    <ProductEmbeddedMobile />

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
  .product-image {
    width: 90%;
    height: 40%;
    min-height: 40%;
    max-height: 45%;
  }
  .dynamic-container {
    margin-top: 20px;
    margin-bottom: 20px;
    .description {
      width: 95%;
      margin-left: auto;
      margin-right: auto;
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
.selection-menu {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  min-height: 20%;
  max-height: 25%;
  @media (max-width: 390px) {
    min-height: 20%;
  }
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
</style>
