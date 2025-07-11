<script setup>
import { ref, watch, computed } from "vue";
import ProductData from "./ProductData/ProductData.vue";
import PhaseCarousel from "../../PhaseCarousel.vue";
import ProductImage from "./ProductData/ProductImage.vue";

import { useProductStore } from "@/store/product";
import { useProductStoreCleanup } from "@/store/productCleanup.js";
import { useProductViewStore } from "@/store/productView.js"; // Import the store

const productStoreCleanup = useProductStoreCleanup();
const productViewStore = useProductViewStore(); // Initialize the store

let localProductData = computed(() => {
  return productStoreCleanup.currentProduct;
});

// No props needed for phase management anymore!

let isTransitioning = ref(false); // Prevent actions during transition to not break animation

watch(() => productViewStore.currentPhaseName, () => {
  isTransitioning.value = true;
  setTimeout(() => {
    isTransitioning.value = false;
  }, 1000); // Match this duration with your CSS transition
});

function selectedPhaseFromCarousel(phaseIndex) {
  if (!isTransitioning.value) {
    // Call the action on the store directly
    productViewStore.setPhase(productViewStore.ALL_PHASES_ARRAY[phaseIndex]);
  }
}

function selectProduct(id) {
  productStoreCleanup.productCodeByIdentifier = id;
}
</script>

<template>
  <div class="product-overview">
    <img
      src="@/assets/product_overview/ellipse.png"
      class="half-circle"
      :class="`half-circle-${productViewStore.currentPhaseName}`"
    />
    <ProductImage
      class="image-container"
      :class="[`image-container-${productViewStore.currentPhaseName}`, { transitioning: isTransitioning }]"
    />

    <div class="dynamic-container" :class="productViewStore.currentPhaseName">
      <Transition name="fade-slide" mode="out-in">
        <div
          v-if="productViewStore.currentPhaseName === productViewStore.PHASES.productDescription"
          key="productDescription"
          class="productDescription"
        >
          <p>
            {{ localProductData.properties["Description EN"] }}
          </p>
        </div>

        <div
          v-else-if="productViewStore.currentPhaseName === productViewStore.PHASES.informationWheel"
          key="informationWheel"
          class="information-wheel"
        >
          <div class="info serving">
            <h2 class="heading">Serving Suggestion</h2>
            <p class="text">
              {{ localProductData.properties["Serving suggestion EN"] }}
            </p>
          </div>

          <div v-if="localProductData.properties['Award']" class="info awards">
            <h2 class="heading">Awards</h2>
            <p class="text">
              {{ localProductData.properties["Award"] }}
            </p>
          </div>
          <div
            v-if="localProductData.properties['consumers comments']"
            class="info awards review"
          >
            <h2 class="heading">User Reviews</h2>
            <p class="text">
              {{ localProductData.properties["consumers comments"] }}
            </p>
          </div>

          <div class="info vegetarian-tags">
            <h2 class="heading">Tags</h2>
            <p class="text">
              {{ localProductData.properties["Tags Eng"] }}
            </p>
          </div>
        </div>

        <ProductData v-else-if="productViewStore.currentPhaseName === productViewStore.PHASES.nutritionalData" key="nutritionalData" />
      </Transition>
    </div>

    <PhaseCarousel
      @selectedPhaseFromCarousel="selectedPhaseFromCarousel"
      :currentPhaseIndex="productViewStore.currentPhaseIndex"
      :currentPhaseName="productViewStore.currentPhaseName"
      :phasesShownOnCarousel="productViewStore.ALL_PHASES_ARRAY"
    />
  </div>
</template>

<style scoped lang="scss">
.phase-carousel {
  position: absolute;
  right: 1%;
}
.product-overview {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/product_overview/background.png");
  background-size: cover;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.half-circle {
  height: 70vh;
  position: absolute;
  transition: all 1s ease;
  left: 50%;
  transform: translateX(25%);

  clip-path: inset(100% 0 0 0); /* Start fully hidden */
  transition: clip-path 0.5s ease, transform 1s ease;
  &-productDescription {
    transform: translateX(-50%);
  }
  &-informationWheel {
    transform: translateX(-120%);
    clip-path: inset(0 0 0 0);
    transition: clip-path 0.5s 1s ease;
  }
  &-nutritionalData {
    transform: translateX(-120%);
    transition-delay: 0s;
    clip-path: inset(100% 0 0 0);
  }
}
.image-container {
  // width: 40%;
  width: 70vh;
  height: 70vh;
  border-radius: 200%;
  position: absolute;
  transition: all 1s ease;
  left: 50%;
  transform: translateX(15%);
  // &:not(&.image-container-description), &:not(&.image-container-wheel), &:not(&.image-container-data){
  //   .placeholder{
  //     transform: translateX(-10%);
  //   }
  // }
  &-productDescription {
    transform: translateX(-50%);
    .placeholder {
      // transform: translateX(-10%);
    }
  }
  &-informationWheel {
    transform: translateX(-115%);
  }
  &-nutritionalData {
    transform: translateX(-115%);
  }
}

.dynamic-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &.overview,
  &.productDescription {
    .description {
      transition-delay: 0.5s;
    }
  }
  .productDescription {
    display: flex;
    // width: 65%;
    justify-content: center;
    width: 40%;
    color: black;
    font-family: "Raleway";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    &.inactive {
      transition-delay: 0.5s;
    }
    p {
      width: 65%;
    }
  }
  .information-wheel {
    width: 50%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .info {
      min-height: 10%;
      display: flex;
      flex-direction: column;
      max-width: 60%;
      h2 {
        color: #000;
        font-family: "Century Gothic";
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 120% */
        letter-spacing: 1px;
        text-transform: capitalize;
        margin-bottom: 15px;
      }
      p {
        color: #000;
        font-family: "Raleway";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
      }
      &.serving {
        margin-left: -5%;
      }
      &.awards {
        margin-left: 15%;
      }
      &.vegetarian-tags {
        margin-left: 5%;
      }
    }
  }
  .product-data {
    width: 60%;
  }
}

@keyframes reveal-circle {
  0% {
    clip-path: circle(0% at 0% 50%);
  }
  100% {
    clip-path: circle(150% at 0% 50%);
  }
}

.info {
  opacity: 0;
  transform: translateX(100%);
  animation: slide-in 0.5s ease-out forwards;
}

.serving {
  animation-delay: 0.2s;
}
.awards {
  animation-delay: 0.4s;
}
.vegetarian-tags {
  animation-delay: 0.6s;
}

@keyframes slide-in {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Text to Wheel transition */
.image-container-text.transitioning {
  animation: move-to-left 1s ease forwards;
}

@keyframes move-to-left {
  to {
  }
}

/* Wheel to Data transition */
.information-wheel.fade-slide-leave-active {
  animation: slide-out-left 0.5s ease forwards;
}

@keyframes slide-out-left {
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
}

/* Add more specific styles as needed */
</style>
