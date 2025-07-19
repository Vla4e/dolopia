<template>
  <div class="chevron-link-container" @mouseenter="hovered = true" @mouseleave="hovered = false" :class="{'hovered': hovered}">
    <router-link :to="routePath" class="chevron-link">
      <span class="link-text">{{ linkText }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#131313"
        class="bi bi-chevron-right chevron"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
        />
      </svg>
    </router-link>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

defineOptions({
  name: 'ChevronLink'
})

const props = defineProps({
  routePath: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    default: 'Go to product',
  },
  hoverProp: {
    type: Boolean,
    required: false,
    default: false
  }
});

watch(() => props.hoverProp, (hoverVal) => {
   hovered.value = hoverVal
})
const hovered = ref(false);
</script>

<style lang="scss" scoped>
.chevron-link-container {
  cursor: pointer;
  position: relative;
  min-width: 100px;
  min-height: 40px;
  display: flex;
  align-items: center;

  &.hovered{
    .chevron{
      transform: translateX(30px);
    }
    .link-text{
      opacity: 1;
      transition-delay: 0.4s;
    }
  }

  &:not(.hovered) {
    .link-text {
      transition-delay: 0s; // Make text disappear immediately when not hovered
      transition-duration: 0.2s;
    }
  }
}

.chevron-link {
  position: relative;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  height: 100%;
}

.link-text {
  position: absolute;
  left: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease-out;
}

.chevron {
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  pointer-events: none;
  fill: white;
  stroke: white;
  z-index: 2;
  position: absolute;
  left: 0;
  transition: transform 0.5s ease;
}
</style>