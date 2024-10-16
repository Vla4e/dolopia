<script setup>
import { ref, watch } from 'vue';
import { startDrag, onDrag, endDrag } from './movementActions.js';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  selectedIndex: {
    type: Number,
    default: 0,
  },
});
let currentlySelectedItem = ref('')
const selectedIndex = ref(props.selectedIndex);

const isDragging = ref(false);
const startY = ref(0);
const deltaY = ref(0);
const itemHeight = 40; // Adjust as needed
const startDragWrapper = (event, isDragging, startY) => {
  startDrag(event, isDragging, startY)
}
const onDragWrapper = (event, isDragging, startY, deltaY) => {
  onDrag(event, isDragging, startY, deltaY)
}
const endDragWrapper = (event, isDragging, startY) => {
  endDrag(event, isDragging, startY)
}

function getItemStyle(index) {
  const offset = (index - selectedIndex.value) * itemHeight + deltaY.value;

  return {
    transform: `translateY(${offset}px)`,
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: `${itemHeight}px`,
    marginTop: `-${itemHeight / 2}px`,
    // display: index === selectedIndex.value || isDragging.value ? 'block' : 'none',
    transition: isDragging.value ? 'none' : 'transform 0.3s ease',
    'will-change': 'transform',
  };
}

watch(
  () => props.selectedIndex,
  (newVal) => {
    selectedIndex.value = newVal;
  }
);

watch(selectedIndex, (newVal) => {
  // Emit an event if needed
  // emit('update:selectedIndex', newVal);
});
</script>

<template>
  <div
    class="vertical-carousel"
    @mousedown="startDrag($event, isDragging, startY)"
    @touchstart="startDrag($event, isDragging, startY)"
    @mousemove="onDrag($event, isDragging, startY, deltaY)"
    @touchmove="onDrag($event, isDragging, startY, deltaY)"
    @mouseup="endDrag(isDragging, deltaY)"
    @touchend="endDrag(isDragging, deltaY)"
    @mouseleave="endDrag(isDragging, deltaY)"
  >
    <div class="carousel-container">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="carousel-item"
        :class="item === curentlySelectedItem ? 'selected' : ''"
        :style="getItemStyle(index)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>



<style scoped>
.vertical-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  user-select: none;
  touch-action: none;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-item {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 25px; /* Same as itemHeight */
  margin-top: -50px; /* Negative half of itemHeight to center vertically */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Additional styling as needed */
}
</style>
