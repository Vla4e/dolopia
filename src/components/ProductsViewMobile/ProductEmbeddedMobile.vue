<script setup>
import chevron from "@/assets/dropdown/down-arrow.png";
import AccordionElement from "./AccordionElement.vue";
import { ref, computed } from "vue";

import { useProductStoreCleanup } from "@/store/productCleanup";
const productStore = useProductStoreCleanup();

const productData = computed(() => {
  return productStore.currentProduct;
});

// Menu state
const isBroughtUp = ref(false);
const toggleMenu = () => {
  isBroughtUp.value = !isBroughtUp.value;
};

const dataContainer = ref(null);
const isDragging = ref(false);
const positionY = ref(0);

// Touch tracking
const startTouchY = ref(0);
const startTranslateY = ref(0);
const deltaY = ref(0);
const dragDirection = ref(''); // 'up', 'down', or ''

// Drag bounds and thresholds
let accumulatedDistance = 0;
let rectHeight = 0;
let heightDiff = 0;
let firstDrag = true;
let thresholdReached = false;

// Handle touch start
const startDrag = (event) => {
  const rect = dataContainer.value.getBoundingClientRect();
  rectHeight = rect.height;
  heightDiff = rect.bottom - window.innerHeight;
  
  isDragging.value = true;
  const touch = event.touches[0];
  startTouchY.value = touch.screenY;
  startTranslateY.value = positionY.value;
  
  // Reset direction tracking
  dragDirection.value = '';
  deltaY.value = 0;
  
  console.log("HeightDiff", heightDiff);
  console.log("start -> ", startTouchY.value, startTranslateY.value);
};

// Handle touch move
const onDrag = (event) => {
  if (!isDragging.value) return;
  
  // Prevent default page scrolling behavior
  event.preventDefault();
  
  const touch = event.touches[0];
  const currentDeltaY = touch.screenY - startTouchY.value;
  
  // Determine drag direction
  if (currentDeltaY > deltaY.value) {
    dragDirection.value = 'down';
  } else if (currentDeltaY < deltaY.value) {
    dragDirection.value = 'up';
  }
  
  deltaY.value = currentDeltaY;
  console.log("Delta Y:", deltaY.value, "Direction:", dragDirection.value);
  
  const newTranslateY = startTranslateY.value + deltaY.value;
  
  // Check if threshold is reached
  if (Math.abs(accumulatedDistance + deltaY.value) > heightDiff && dragDirection.value === 'up') {
    console.log("ALRIGHTY SHOULD STOP");
    thresholdReached = true;
    stopDrag();
    return;
  } else if (thresholdReached && dragDirection.value === 'down'){

  }
  
  // Clamp the new position. The lowest point is translateY(0).
  // Any attempt to drag further down (positive translateY) is clamped to 0.
  // Upward drags (negative translateY) are permitted.
  if(Math.min(0, newTranslateY) === 0){
    console.log("reached bottom");
    
    // Reset all variables to initial states
    isDragging.value = false;
    positionY.value = 0;
    startTouchY.value = 0;
    startTranslateY.value = 0;
    deltaY.value = 0;
    dragDirection.value = '';
    accumulatedDistance = 0;
    rectHeight = 0;
    heightDiff = 0;
    firstDrag = true;
    thresholdReached = false;
  }
  positionY.value = Math.min(0, newTranslateY);
};

// Handle touch end
const stopDrag = () => {
  if (firstDrag) {
    accumulatedDistance = deltaY.value;
    firstDrag = false;
  } else {
    accumulatedDistance += deltaY.value;
  }
  
  isDragging.value = false;
  
  console.log("Drag ended. Final direction:", dragDirection.value);
  
  // Reset direction after drag ends
  dragDirection.value = '';
};

const accordionItems = computed(() => {
  if (!productData.value?.properties) return [];
  
  return [
    {
      heading: 'Serving Suggestion',
      text: productData.value.properties['Serving suggestion EN'],
      key: 'serving'
    },
    {
      heading: 'Awards',
      text: productData.value.properties['Award'],
      key: 'awards'
    },
    {
      heading: 'User Reviews',
      text: productData.value.properties['consumers comments'],
      key: 'reviews'
    },
    {
      heading: 'Tags',
      text: productData.value.properties['Tags Eng'],
      key: 'tags'
    },
    {
      heading: 'Allergens',
      text: productData.value.properties['Allergens EN'],
      key: 'allergens'
    },
    {
      heading: 'Ingredients',
      text: productData.value.properties['Ingredients EN'],
      key: 'ingredients'
    },
    {
      heading: 'Nutritional Facts',
      text: productData.value.properties['Tags Eng'],
      key: 'nutritional_facts',
      productDataAccordion: true
    }
  ].filter(item => item.text); // Filter out items without text
});

function toggledAccordion(isOpened) {
  console.log("E -> ", isOpened)
  if(isOpened){
    console.log("TOGGLE RECALC")
  }
}
</script>

<template>
  <div
    :class="isBroughtUp ? 'brought-up' : ''"
    class="data-container"
    ref="dataContainer"
    :style="{ transform: `translateY(${positionY}px)` }"
    @touchstart="startDrag"
    @touchmove="onDrag"
    @touchend="stopDrag"
  >
    <img
      :class="isBroughtUp ? 'brought-up' : ''"
      class="chevron"
      @click="toggleMenu()"
      :src="chevron"
    />
    <div class="data-list">

    <AccordionElement
      v-for="item in accordionItems"
      :key="item.key"
      :heading="item.heading"
      :text="item.text"
      :productDataAccordion="item.productDataAccordion || false"
      v-on:accordionToggle="toggledAccordion"
    />
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 50px 50px 0px 0px;
  background: #fff;
  position: relative;
  padding-top: 10%;
  transition: transform 0.3s ease;
  z-index: 2000;

  // Add touch-action to improve touch responsiveness
  touch-action: pan-y;

  &.brought-up {
    transform: translateY(-50%);
  }

  .chevron {
    position: absolute;
    left: 50%;
    top: 15px;
    transform: rotate(180deg) translate(50%, 0%);
    width: 15px;
    transition: transform 0.3s ease;
    cursor: pointer;

    &.brought-up {
      transform: rotate(360deg) translate(-50%, 0%);
    }
  }

  .data-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>