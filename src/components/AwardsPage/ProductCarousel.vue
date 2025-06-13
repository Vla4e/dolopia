<template>
  <div class="carousel-container">
    <div ref="carouselAnimationContainer" 
         class="carousel-animation-container"
         @mousedown="startDrag" 
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
        >
          <slot :name="index">
            <img :src="obj.imageUrl" :ref="'jar' + index" class="jar-image" loading="lazy" :draggable="false"/>
            <Transition name="slide-in" :key="index">
              <section v-show="indexHoveredItem === index" class="product-information">
                <span class="award"> {{ obj.award }} </span>
                <span class="name"> {{ obj.name }} </span>
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
import { ref, onMounted, onBeforeMount, onBeforeUnmount, watchEffect, inject, computed, toRaw, watch } from 'vue';
// import router from '@/router/index.js'

defineOptions({
  name: "Carousel"
})

const props = defineProps({
  awardedItems: {
    type: Object,
    required: true
  },
});

const { isMobile, isTablet } = inject('screenSize')


// Carousel item logic
let indexHoveredItem = ref(null)
function hoverTrigger(index, hoverStatus){
  console.log("Hovered => ", index)
  if(!hoverStatus) indexHoveredItem.value = null
  else indexHoveredItem.value = index
}
let jar0 = ref();
let carouselLeftMarginOffset;
function goToItem(val){
  console.log('Item selected ===================================>', val)
}

// carousel logic
let computedCarouselDirection = computed(() => {
  if(isMobile.value) return 'column'
  else return 'row'
})

const carouselAnimationContainer = ref(null);
const carouselContent = ref(null);

const translateValue = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const previousTranslate = ref(0);

const lastTranslateValue = ref(0);
const lastTime = ref(0);
const velocity = ref(0);

const itemWidth = ref(0);

watchEffect(() => {
  calculateItemWidth();
  updateTranslateBounds();
});

function calculateItemWidth() {
  requestAnimationFrame(() => {
    if (carouselContent.value) {
      const carouselItems = carouselContent.value.querySelectorAll('.carousel-item');
      if (carouselItems.length > 0) {
        itemWidth.value = carouselItems[0].clientWidth;
        updateTranslateBounds();
      }
    }
  });
}

// Gets called upon animationFrames - checks current value against max/min and adjusts if out of bounds
function updateTranslateBounds() {
  const maxTranslate = 0;
  const minTranslate = -(itemWidth.value * (props.awardedItems.length - 1));

  // Translate value is never lower than minTranslate (right direction) and higher than maxTranslate (left direction)
  translateValue.value = Math.max(Math.min(translateValue.value, maxTranslate), minTranslate);
}

let moved = ref(false)
function startDrag(event) {
  if(isMobile.value ) return
  event.preventDefault();
  isDragging.value = true;
  startX.value = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
  previousTranslate.value = translateValue.value;
  moved.value = false;

  document.body.classList.add('dragging');
  carouselContent.value.style.transition = 'none';

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', endDrag);
  // passive = false due to https://chromestatus.com/feature/5093566007214080 
  document.addEventListener('touchmove', onMouseMove, { passive: false });
  document.addEventListener('touchend', endDrag);
  document.addEventListener('touchcancel', endDrag);

  lastTime.value = performance.now(); // Record the start time for velocity/inertia after release
}

function onMouseMove(event) {
  if (!isDragging.value) return;
  // event.preventDefault();

  const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
  const deltaX = clientX - startX.value;
  translateValue.value = previousTranslate.value + deltaX;
  if (Math.abs(deltaX) > 5) { // threshold to consider it a drag
    // console.log("It is a drag")
    moved.value = true;
  } else {
    // console.log("not a drag")
    moved.value = false;
  }
  if(moved.value){
    // console.log("prevent from onMouseMouve")
    event.preventDefault()
  }
  // Calculate the velocity
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime.value;
  velocity.value = (translateValue.value - lastTranslateValue.value) / deltaTime;
  lastTranslateValue.value = translateValue.value;
  lastTime.value = currentTime;
}

function endDrag(event) {
  if (!isDragging.value) return;
  isDragging.value = false;

  console.log("Moved enddrag", moved.value)
  if (moved.value) {
    event.preventDefault(); // prevent default only if it was a drag
  } else {
  }

  document.body.classList.remove('dragging');

  // Remove the event listeners to clean up after dragging
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', endDrag);
  // passive = false due to https://chromestatus.com/feature/5093566007214080 
  document.removeEventListener('touchmove', onMouseMove, { passive: false });
  document.removeEventListener('touchend', endDrag);

  snapToNearest()
}


function snapToNearest() {
  const maxTranslate = 0; // Maximum translate value (no scrolling past the first item)
  const minTranslate = -(itemWidth.value * (props.awardedItems.length - 1)); // Minimum translate value (no scrolling past the last visible items)

  // Calculate the nearest snap position
  const snapPosition = Math.round(translateValue.value / itemWidth.value) * itemWidth.value;
  translateValue.value = Math.max(Math.min(snapPosition, maxTranslate), minTranslate);

  // Re-enable the transition for snapping
  carouselContent.value.style.transition = 'transform 0.3s ease';
}

function preventDefaultSelection(event) {
  if (isDragging.value) {
    event.preventDefault();
  }
}


//lifecycle hooks
onMounted(() => {
  console.log("MOUNTED CAROUSEL", props.awardedItems)
  setTimeout(() => {
    console.log("JAR REF", jar0.value[0].width)
    if(jar0.value && jar0.value[0]){
      carouselLeftMarginOffset = jar0.value[0].width * 28 / 100;
      carouselContent.value.style.marginLeft = -carouselLeftMarginOffset + 'px';
      console.log("CARLEFTMARG", carouselLeftMarginOffset) 
    }
  }, 1500)
  calculateItemWidth();
  window.addEventListener('resize', calculateItemWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateItemWidth);
});
</script>

<style lang="scss" scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Add padding to accommodate overflowing product information */
  padding-bottom: 120px; /* Adjust based on your product-information height */
}

.carousel-animation-container {
  width: 100%;
  height: 100%;
  cursor: grab;
  position: relative;
  /* Remove overflow properties - we'll handle clipping with the fade overlays */
}

.carousel-content {
  height: 100%;
  display: flex;
  will-change: transform;
  overflow: visible; /* Allow content to overflow */
  // margin-left: 28px;
  &.row {
    flex-direction: row;
    align-items: flex-start;
  }
  &.column {
    flex-direction: column;
    justify-content: center;
  }
}
.dragging{
  .carousel-item{
    .jar-image{
      cursor: grab !important;
    }
  }
}


.carousel-item {
  flex: 0 0 30%; /* Adjust based on the number of items visible */
  text-align: center;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  // height: 85%;
  // max-height: 10%;
  position: relative;
  /* Remove overflow: hidden if it exists, to allow product-information to overflow */
  
  .jar-image {
    // height: 80%;
    object-fit: contain;
    cursor: pointer;
    @media(min-width: 1440px){
      // width: 80%;
    }
    @media(max-width: 480px){
      max-width: 100%;
    }
  }
  
  .product-information{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 150%; /* This allows it to extend beyond container */
    // gap: 10px;
    position: absolute;
    top: 85%; /* position right after jar image */
    left: 27%; /* Align left edge with container, image empty space is 27% of whole image width */
    z-index: 10;
    /* Add pointer-events: none to prevent it from interfering with carousel interactions */
    pointer-events: none;

    text-align: left;
    
    .award{
      color: #000;
      font-family: "Century Gothic";
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 1px;
      text-transform: uppercase;
      @media(max-width: 1600px) and (max-height: 900px){
        font-size: 16px;
      }
    }
    .name{
      color: #000;
      font-family: "Century Gothic";
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 1px;
      text-transform: uppercase;
      @media(max-width: 1600px) and (max-height: 900px){
        font-size: 14px;
      }
    }
    .description{
      color: #000;
      font-family: "Raleway";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      @media(max-width: 1600px) and (max-height: 900px){
        font-size: 12px;
      }
    }
  }
}

.fade-overflow{
  &-right, &-left{
    @media(max-width: 1024px){
      display: none;
    }
  }
}
.fade-overflow-right{
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 10%; /* Adjust for the fade effect size */
  // background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  pointer-events: none;
  z-index: 20; /* Ensure fade overlay appears above carousel items */
}
.fade-overflow-left{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 5%; /* Adjust for the fade effect size */
  // background: linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  pointer-events: none;
  z-index: 20; /* Ensure fade overlay appears above carousel items */
}
</style>