<script setup>
import { ref, watch, onMounted, reactive, computed } from "vue";
import ProductData from "./ProductData/ProductData.vue";
import PhaseCarousel from "../../PhaseCarousel.vue";
import ProductImage from "./ProductData/ProductImage.vue";

import { useProductStore } from "@/store/product";
import { useProductStoreCleanup } from "@/store/productCleanup.js";
const productStore = useProductStore();
const productStoreCleanup = useProductStoreCleanup();
let localProductData = computed(() => {
  // console.log("PROPS:", productStoreCleanup.currentProduct);
  return productStoreCleanup.currentProduct;
});
const props = defineProps({
  isOverviewActive: {
    type: Boolean,
    required: true,
  },
});

const phasesShownOnCarousel = ["initial", "description", "wheel", "data"];
const localPhases = ["initial","description", "wheel", "data"];
let currentPhaseIndex = 0;
let currentPhaseName = ref("initial");

const emit = defineEmits(["phaseChange"]);
const Backward = false; //scrollUp
const Forward = true; //scrollDown
function cyclePhase(direction) {
  // if (!props.isOverviewActive) {
  //   return;
  // }
  if (!currentPhaseIndex) {
    currentPhaseIndex = 1;
    currentPhaseName.value = localPhases[currentPhaseIndex];
    isTransitioning.value = true;
    emit("phaseChange", currentPhaseName.value);
    return;
  }
  if (!isTransitioning.value) {
    if (direction === Forward) {
      if (currentPhaseIndex < localPhases.length - 1) {
        currentPhaseIndex++;
      } else {
        currentPhaseIndex = 1;
      }
    } else {
      if (currentPhaseIndex === 1) {
        currentPhaseIndex = localPhases.length - 1;
      } else {
        currentPhaseIndex--;
      }
    }
    currentPhaseName.value = localPhases[currentPhaseIndex];
    isTransitioning.value = true;
    emit("phaseChange", currentPhaseName.value);
  }
}

function selectedPhaseFromCarousel(phaseIndex) {
  currentPhaseIndex = phaseIndex;
  currentPhaseName.value = localPhases[currentPhaseIndex];
  isTransitioning.value = true;
  emit("phaseChange", currentPhaseName.value);
}
let isTransitioning = ref(false); //Prevent actions during transition to not break animation
watch(currentPhaseName, () => {
  setTimeout(() => {
    isTransitioning.value = false;
  }, 1000);
});

watch(
  () => props.isOverviewActive,
  (isActive) => {
    //initial expansion of component (subcategory page -> product page transition)
    if (isActive) {
      // cyclePhase(Forward);
    } else {
      currentPhaseName.value = "initial";
    }
  },
  {
    immediate: true,
  }
);

import { useScrollDirection } from "@/composables/useScrollDirection"; //Enable scrolling through phases using composable.

useScrollDirection(
  () => cyclePhase(Backward), //onScrollUp
  () => cyclePhase(Forward) //onScrollDown
);

function selectProduct(id) {
  // console.log(productStoreCleanup.productCodeByIdentifier);
  productStoreCleanup.productCodeByIdentifier = id;
}
</script>

<template>
  <div class="product-overview">
    <!-- Product Image + Half-circle around product in Wheel phase -->
    <img
      src="@/assets/product_overview/ellipse.png"
      class="half-circle"
      :class="`half-circle-${currentPhaseName}`"
    />
    <ProductImage
      class="image-container"
      :class="[`image-container-${currentPhaseName}`, { transitioning: isTransitioning }]"
    />

    <div class="dynamic-container" :class="currentPhaseName">
      <Transition name="fade-slide" mode="out-in">
        <div
          v-if="currentPhaseName === 'description'"
          key="description"
          class="description"
        >
          <p>
            {{ localProductData.properties["Description EN"] }}
          </p>
        </div>

        <div
          v-else-if="currentPhaseName === 'wheel'"
          key="wheel"
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

        <!-- Nutrition Data Phase -->
        <ProductData v-else-if="currentPhaseName === 'data'" key="data" />
      </Transition>
    </div>

    <!-- <Dropdown class=""/> -->
    <PhaseCarousel
      @selectedPhaseFromCarousel="selectedPhaseFromCarousel"
      @cyclePhase="cyclePhase"
      :currentPhaseIndex="currentPhaseIndex"
      :currentPhaseName="currentPhaseName"
      :phasesShownOnCarousel="phasesShownOnCarousel"
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
  &-description {
    transform: translateX(-50%);
  }
  &-wheel {
    transform: translateX(-120%);
    clip-path: inset(0 0 0 0);
    transition: clip-path 0.5s 1s ease;
  }
  &-data {
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
  &-description {
    transform: translateX(-50%);
    .placeholder {
      // transform: translateX(-10%);
    }
  }
  &-wheel {
    transform: translateX(-115%);
  }
  &-data {
    transform: translateX(-115%);
  }
}

.dynamic-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &.initial,
  &.description {
    .description {
      transition-delay: 0.5s;
    }
  }
  .description {
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
