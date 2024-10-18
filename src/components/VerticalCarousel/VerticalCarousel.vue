<template>
  <div 
    class="vertical-carousel" 
    @touchstart="startDrag" 
    @touchmove="onDrag" 
    @touchend="endDrag"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    :style="carouselStyle"
  >
    <div class="carousel-content" :style="contentStyle">
      <div 
        v-for="(item, index) in items" 
        :key="item.productCode" 
        class="item"
        :class="{ 'selected': selectedIndex === index }"
        :style="getItemStyle(index)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="mask top"></div>
    <div class="mask bottom"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
let items = [
  {
    productCode: '123',
    name: '123'
  },
  {
    productCode: '456',
    name: '457'
  },
  {
    productCode: '789',
    name: '789'
  },
  {
    productCode: '1001',
    name: '1001'
  },
]
let itemsLength = items.length
let selectedProductCode = ref('123')
function selectProductCode(code){
  selectedProductCode.value = code
}

const props = defineProps({
  initialSelectedIndex: {
    type: Number,
    default: 0
  }
});

const selectedIndex = ref(props.initialSelectedIndex);
const dragStart = ref(null);
const dragOffset = ref(0);

const itemHeight = 50; // Height of each item in pixels
const visiblePortion = 0.3; // Portion of adjacent items to show

const carouselStyle = computed(() => ({
  '--item-height': `${itemHeight}px`,
  '--visible-portion': visiblePortion,
  height: `${itemHeight * (1 + 2 * visiblePortion)}px`
}));

const contentStyle = computed(() => ({
  transform: `translateY(${-selectedIndex.value * itemHeight + dragOffset.value}px)`
}));

const getItemStyle = (index) => ({
  transform: `translateY(${index * itemHeight}px)`,
  opacity: index === selectedIndex.value ? 1 : 0.5,
  zIndex: items.length - Math.abs(index - selectedIndex.value)
});

const startDrag = (event) => {
  dragStart.value = event.touches ? event.touches[0].clientY : event.clientY;
};

const onDrag = (event) => {
  if (dragStart.value === null) return;
  const currentPosition = event.touches ? event.touches[0].clientY : event.clientY;
  dragOffset.value = currentPosition - dragStart.value;
};

const endDrag = () => {
  if (dragOffset.value === 0) return;

  const threshold = itemHeight / 2;
  const direction = dragOffset.value > 0 ? -1 : 1;
  const change = Math.abs(dragOffset.value) > threshold ? 1 : 0;

  selectedIndex.value = Math.max(0, Math.min(items.length - 1, selectedIndex.value + change * direction));
  dragStart.value = null;
  dragOffset.value = 0;
};

</script>

<style lang="scss" scoped>
.vertical-carousel {
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
  min-width: 150px;
}

.carousel-content {
  position: absolute;
  width: 100%;
  transition: transform 0.3s ease;
  min-height: 100%;
}

.item {
  position: absolute;
  left: 0;
  right: 0;
  height: var(--item-height);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  cursor: pointer;
  color: white;

  &.selected {
    font-weight: bold;
  }
}

.mask {
  position: absolute;
  left: 0;
  right: 0;
  height: calc(var(--item-height) * var(--visible-portion));
  pointer-events: none;

  &.top {
    top: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
  }

  &.bottom {
    bottom: 0;
    background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
  }
}
</style>