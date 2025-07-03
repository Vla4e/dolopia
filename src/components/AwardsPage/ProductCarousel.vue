<template>
  <div ref="carousel" class="carousel-container" :style="isReady ? 'opacity: 1;': ''">
    <div ref="carouselAnimationContainer" 
         class="carousel-animation-container"
         @mousedown="(event) => startDrag(event, scrollEnabled)" 
         @mousemove="onMouseMove" 
         @mouseup="endDrag" 
         @mouseleave="endDrag"
         @touchstart="startDrag" 
         @touchmove="onMouseMove" 
         @touchend="endDrag"
         @touchcancel="endDrag">
      <div
        ref="carouselContent"
        class="carousel-content"
        :class="computedCarouselDirection === 'row' ? 'row' : 'column'"
        :style="{ transform: `translateX(${translateValue}px)` }"
      >
        <div
          v-for="(obj, index) in awardedItems"
          :key="index"
          class="carousel-item"
          @click="goToItem(obj)"
          @mouseenter="hoverTrigger(index, true)"
          @mouseleave="hoverTrigger(index, false)"
          ref="awardedItems"
          :style="itemDynamicStyles[index]"
        >
          <slot :name="index">
            <img 
              :src="obj.imageUrl" 
              :ref="'jar' + index" 
              class="jar-image" 
              loading="lazy" 
              :draggable="false"
              @load="loadTest()"
            />
            <Transition name="slide-in" :key="index">
              <section v-show="indexHoveredItem === index" class="product-information">
                <span class="name"> {{ obj.name }} </span>
                <span class="award"> {{ obj.award }} </span>
                <span class="description"> {{obj.description}} </span>
              </section>
            </Transition>
          </slot>
        </div>
      </div>
      <div class="fade-overflow-left"></div>
      <div class="fade-overflow-right"></div>
    </div>
  </div>
</template>

<script setup>
import { 
  ref, 
  onMounted, 
  inject, 
  useTemplateRef, 
  nextTick,
  watch
} from 'vue';
import { useCarousel } from '@/composables/useCarousel.js'; // Adjust path as needed

defineOptions({
  name: "Carousel"
});

const props = defineProps({
  awardedItems: {
    type: Object,
    required: true
  },
  scrollEnabled: {
    type: Boolean,
    required: false,
    default: true
  }
});

const screenSize = inject('screenSize');
const { isMobile, isTablet } = screenSize;

// Use the carousel composable
const {
  carouselAnimationContainer,
  carouselContent,
  carousel,
  translateValue,
  itemDynamicStyles,
  computedCarouselDirection,
  startDrag,
  onMouseMove,
  endDrag,
  calculateItemWidth,
  updateItemFadeEffect,
  itemWidth
} = useCarousel(props, screenSize);

// Component-specific logic (not related to carousel mechanics)
let awardedItemsRef = useTemplateRef('awardedItems');
let indexHoveredItem = ref(null);
let jar0 = ref();
let carouselLeftMarginOffset;

function hoverTrigger(index, hoverStatus) {
  if (!hoverStatus) indexHoveredItem.value = null;
  else indexHoveredItem.value = index;
}

function goToItem(val) {
  // console.log('Item selected ===================================>', val);
}

let loadedImages = 0;
let isReady = ref(false);
function loadTest(){
  loadedImages++
  if(loadedImages === props.awardedItems.length){
    // console.log("ALL IAMGES LAODED")
    isReady.value = true
  }
}

// Initialize carousel with proper offset
onMounted( async () => {
  // console.log("REF", awardedItemsRef);
  // console.log("MOUNTED CAROUSEL", props.awardedItems);
  await nextTick();
  setTimeout(() => {
    calculateItemWidth();
    // Set initial position so first visible item is at left edge
    // This means we start with one item width offset to the left
    translateValue.value = -itemWidth.value;
    updateItemFadeEffect();
  }, 100);
  
  setTimeout(() => {
    // console.log("JAR REF", jar0.value[0].width);
    if (jar0.value && jar0.value[0]) {
      carouselLeftMarginOffset = jar0.value[0].width * 28 / 100;
      // console.log("CARLEFTMARG", carouselLeftMarginOffset);
    }
  }, 1500);
});
</script>

<style lang="scss" scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 120px;
  min-height: 450px;
  transition: opacity 0.7s ease;
  opacity: 0;
}

.carousel-animation-container {
  width: 100%;
  height: 100%;
  cursor: grab;
  position: relative;
  overflow-x: hidden;
  overflow-y: visible;
}

.carousel-content {
  height: 100%;
  display: flex;
  will-change: transform;
  
  &.row {
    flex-direction: row;
    align-items: flex-start;
  }
  &.column {
    flex-direction: column;
    justify-content: center;
  }
}

.dragging {
  .carousel-item {
    .jar-image {
      cursor: grab !important;
    }
  }
}

.carousel-item {
  flex: 0 0 30%;
  @media(max-width: 1600px) and (max-height: 900px) {
    flex: 0 0 20%;
  }
  flex-shrink: 0;
  text-align: center;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  
  .jar-image {
    object-fit: contain;
    cursor: pointer;
    @media(min-width: 1440px) {
      // width: 80%;
    }
    @media(max-width: 480px) {
      width: 100%;
    }
  }
  
  .product-information {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 150%;
    position: absolute;
    top: 100%;
    left: 27%;
    z-index: 10;
    pointer-events: none;
    text-align: left;
    
    .award {
      color: #000;
      font-family: "Century Gothic";
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 5px;
      @media(max-height: 900px) {
        font-size: 12px;
      }
    }
    .name {
      color: #000;
      font-family: "Century Gothic";
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
      @media(max-height: 900px) {
        font-size: 14px;
      }
    }
    .description {
      color: #000;
      font-family: "Raleway";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      @media(max-height: 900px) {
        font-size: 12px;
      }
    }
  }
}

.fade-overflow {
  &-right, &-left {
    @media(max-width: 1024px) {
      display: none;
    }
  }
}

.fade-overflow-right {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 10%;
  pointer-events: none;
  z-index: 20;
}

.fade-overflow-left {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 5%;
  pointer-events: none;
  z-index: 20;
}

/* Slide-in transition styles */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.5s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.slide-in-enter-to,
.slide-in-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>