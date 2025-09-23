<script setup>
import chevron from "@/assets/dropdown/down-arrow.png";
import AccordionElement from "./AccordionElement.vue";
import { ref, computed, onMounted, nextTick } from "vue";

import { useProductStoreCleanup } from "@/store/productCleanup";
const productStore = useProductStoreCleanup();

const productData = computed(() => {
  return productStore.currentProduct;
});

const isBroughtUp = ref(false);
const toggleMenu = () => {
  isBroughtUp.value = !isBroughtUp.value;
  if (isBroughtUp.value) {
    positionY.value = 0; // Fully visible
  } else {
    positionY.value = initialPosition.value; // initialPos % visible
  }
};

const dataContainer = ref(null);
const isDragging = ref(false);
const positionY = ref(0);

const initialPosition = ref(0);

const startTouchY = ref(0);
const startTranslateY = ref(0);

const calculateInitialPosition = () => {
  if (!dataContainer.value) return;

  const rect = dataContainer.value.getBoundingClientRect();
  const containerHeight = rect.height;

  // show visiblePercent from top
  const visiblePercent = 0.05;
  const hiddenAmount = containerHeight * (1 - visiblePercent);
  initialPosition.value = hiddenAmount;

};

const startDrag = (event) => {
  isDragging.value = true;
  const touch = event.touches[0];
  startTouchY.value = touch.clientY;
  startTranslateY.value = positionY.value;

};

const onDrag = (event) => {
  if (!isDragging.value) return;

  event.preventDefault();

  const touch = event.touches[0];
  const deltaY = touch.clientY - startTouchY.value;
  const newTranslateY = startTranslateY.value + deltaY;

  const clampedY = Math.min(initialPosition.value, Math.max(0, newTranslateY));

  positionY.value = clampedY;
};

// drag end with snap behavior
const stopDrag = () => {
  if (!isDragging.value) return;

  isDragging.value = false;

  // midpoint to calculate snap to closest pos
  const midPoint = initialPosition.value / 2;

  if (positionY.value < midPoint) {
    //closer to fully visible
    positionY.value = 0;
    isBroughtUp.value = true;
  } else {
    // closer to collapsed
    positionY.value = initialPosition.value;
    isBroughtUp.value = false;
  }
};

function toggledAccordion(isOpened) {
  if (isOpened) {
    // Recalculate when accordion expands
    nextTick(() => {
      calculateInitialPosition();
    });
  }
}

onMounted(() => {
  calculateInitialPosition();
  positionY.value = initialPosition.value;
});

const accordionItems = computed(() => {
  if (!productData.value?.properties) return [];

  return [
    {
      heading: "Serving Suggestion",
      text: productData.value.properties["Serving suggestion EN"],
      key: "serving",
    },
    {
      heading: "Awards",
      text: productData.value.properties["Award"],
      key: "awards",
    },
    {
      heading: "User Reviews",
      text: productData.value.properties["consumers comments"],
      key: "reviews",
    },
    {
      heading: "Tags",
      text: productData.value.properties["Tags Eng"],
      key: "tags",
    },
    {
      heading: "Allergens",
      text: productData.value.properties["Allergens EN"],
      key: "allergens",
    },
    {
      heading: "Ingredients",
      text: productData.value.properties["Ingredients EN"],
      key: "ingredients",
    },
    {
      heading: "Nutritional Facts",
      text: productData.value.properties["Tags Eng"],
      key: "nutritional_facts",
      productDataAccordion: true,
    },
  ].filter((item) => item.text);
});
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
  padding-top: 15%;
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
    top: 0px;
    transform: rotate(180deg) translate(50%, 0%);
    width: 30px;
    transition: transform 0.3s ease;
    cursor: pointer;
    animation: pulsate 1.4s linear infinite;

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

@keyframes pulsate {
  0% {
    transform: translate(-50%, 0%) scale(120%) rotate(180deg);
  }
  33% {
    transform: translate(-50%, 0%) scale(90%) rotate(180deg);
  }
  66% {
    transform: translate(-50%, 0%) scale(100%) rotate(180deg);
  }
  100% {
    transform: translate(-50%, 0%) scale(120%) rotate(180deg);
  }
}
</style>
