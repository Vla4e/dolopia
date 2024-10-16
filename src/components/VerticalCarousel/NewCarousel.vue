<template>
  <div class="carousel-container">
    <div
      ref="carouselAnimationContainer"
      class="carousel-animation-container"
      @mousedown="startDrag"
      @mousemove="onMouseMove"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @touchstart="startDrag"
      @touchmove="onMouseMove"
      @touchend="endDrag"
      @touchcancel="endDrag"
    >
      <div
        ref="carouselContent"
        class="carousel-content column"
        :style="{ transform: `translateY(${translateValue}px)` }"
      >
        <div
          v-for="(item, index) in items"
          :key="item"
          class="carousel-item"
        >
          <slot :name="item">
            <span class="name">{{ item }}</span>
          </slot>
        </div>
      </div>
      <div class="fade-overflow-top"></div>
      <div class="fade-overflow-bottom"></div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  inject,
  computed,
  watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  carouselDirection: {
    type: String,
    required: false,
    default: 'column',
  },
  items: {
    type: Array,
    required: true
  }
});

// const { isMobile } = inject('screenSize');
const router = useRouter();

// Assign currentBrand values from props to fetch texts
const currentItem = ref(null);
onMounted(() => {
  currentItem.value = props.items[0];
  calculateItemHeight();
  window.addEventListener('resize', calculateItemHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateItemHeight);
});

// function goToItem(val) {
//   if (!moved.value) {
//     router
//       .push({
//         name: 'Product',
//         params: { selectedBrand: props.brand.name },
//       })
//       .catch((err) => {
//         console.log('error while routing', err);
//       });
//   }
// }

const carouselAnimationContainer = ref(null);
const carouselContent = ref(null);

const translateValue = ref(0);
const isDragging = ref(false);
const startY = ref(0);
const previousTranslate = ref(0);

const itemHeight = ref(0);

const moved = ref(false);
function startDrag(event) {
  event.preventDefault();
  isDragging.value = true;
  startY.value = event.type.includes('touch')
    ? event.touches[0].clientY
    : event.clientY;
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
}

function onMouseMove(event) {
  if (!isDragging.value) return;

  const clientY = event.type.includes('touch')
    ? event.touches[0].clientY
    : event.clientY;
  const deltaY = clientY - startY.value;
  translateValue.value = previousTranslate.value + deltaY;
  if (Math.abs(deltaY) > 5) {
    moved.value = true;
  }
  if (moved.value) {
    event.preventDefault();
  }
}

function endDrag(event) {
  if (!isDragging.value) return;
  isDragging.value = false;

  if (moved.value) {
    event.preventDefault(); // prevent default only if it was a drag
  }

  document.body.classList.remove('dragging');

  // Remove the event listeners to clean up after dragging
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', endDrag);
  // passive = false due to https://chromestatus.com/feature/5093566007214080
  document.removeEventListener('touchmove', onMouseMove);
  document.removeEventListener('touchend', endDrag);
  document.removeEventListener('touchcancel', endDrag);

  snapToNearest();
}

function snapToNearest() {
  const maxTranslate = 0; // Maximum translate value (no scrolling past the first item)
  const minTranslate =
    -(
      itemHeight.value *
      (currentItem.value.length - props.visibleItems)
    ); // Minimum translate value

  // Calculate the nearest snap position
  const snapPosition =
    Math.round(translateValue.value / itemHeight.value) * itemHeight.value;
  translateValue.value = Math.max(
    Math.min(snapPosition, maxTranslate),
    minTranslate
  );

  // Re-enable the transition for snapping
  carouselContent.value.style.transition = 'transform 0.3s ease';
}

function calculateItemHeight() {
  requestAnimationFrame(() => {
    if (carouselContent.value) {
      const carouselItems =
        carouselContent.value.querySelectorAll('.carousel-item');
      if (carouselItems.length > 0) {
        itemHeight.value = carouselItems[0].clientHeight;
        updateTranslateBounds();
      }
    }
  });
}

function updateTranslateBounds() {
  const maxTranslate = 0;
  const minTranslate =
    -(
      itemHeight.value *
      (currentItem.value.length - props.visibleItems)
    );
  translateValue.value = Math.max(
    Math.min(translateValue.value, maxTranslate),
    minTranslate
  );
}
</script>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-animation-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  position: relative;
}

.carousel-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  will-change: transform; /* Hint to the browser for better performance during transitions */
}

.dragging {
  .carousel-item {
    cursor: grab !important;
  }
}

.carousel-item {
  flex: 0 0 auto; /* Adjust based on the number of items visible */
  text-align: center;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px; /* Adjust based on your needs */
}

.name {
  font-family: 'DMSans';
  font-size: 15px;
  font-weight: 400;
  text-align: center;
  color: black;
  text-transform: uppercase;
  width: 80%;
}

.product-line {
  font-family: 'DMSans';
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  color: black;
}

.fade-overflow-top,
.fade-overflow-bottom {
  position: absolute;
  left: 0;
  width: 100%;
  height: 10%; /* Adjust for the fade effect size */
  pointer-events: none;
}

.fade-overflow-top {
  top: 0;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1)
  );
}

.fade-overflow-bottom {
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1)
  );
}
</style>
