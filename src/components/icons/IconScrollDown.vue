<template>
  <div class="scroll-down-container">
    <svg class="scroll-down-svg" viewBox="0 0 40 80">
      <rect
        class="scroll-rectangle"
        fill="none"
        stroke="currentColor"
      />
      <circle
        class="animated-circle"
        fill="currentColor"
      />
      <path
        d="M 16 45 L 20 49 L 24 45"
        class="animated-arrow"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  </div>
</template>

<script setup>
defineOptions({
  name: 'IconScrollDown'
})
</script>

<style scoped>
.scroll-down-container {
  /* CSS Variables - Customize these to change the icon */
  --icon-width: 40px;
  --icon-height: 80px;
  /* Colors */
  --icon-color: #3f3f3d;
  --circle-color: #3f3f3d;
  --arrow-color: #3f3f3d;
  --stroke-color: #3f3f3d;
  --stroke-width: 2px;
  
  /* Rectangle dimensions and position */
  --rect-x: 10px;
  --rect-y: 10px;
  --rect-width: 20px;
  --rect-height: 30px;
  --rect-radius: 10px;
  
  /* Circle properties */
  --circle-cx: 20px;
  --circle-cy: 20px;
  --circle-radius: 4px;
  
  /* Arrow properties */
  --arrow-start-x: 16px;
  --arrow-start-y: 50px;
  --arrow-tip-x: 10px;
  --arrow-tip-y: 54px;
  --arrow-end-x: 24px;
  --arrow-end-y: 30px;
  
  /* Animation properties */
  --animation-duration: 1.8s; /* CHANGED: 1.3s (original) + 0.5s (pause) */
  --animation-distance: 13px;
  --arrow-animation-distance: 15px;
  --animation-timing: ease-out;
  
  display: inline-block;
  color: var(--icon-color);
}

.scroll-down-svg {
  width: var(--icon-width);
  height: var(--icon-height);
  overflow: visible;
}

.scroll-rectangle {
  x: var(--rect-x);
  y: var(--rect-y);
  width: var(--rect-width);
  height: var(--rect-height);
  rx: var(--rect-radius);
  ry: var(--rect-radius);
  stroke-width: var(--stroke-width);
  stroke: var(--stroke-color);
}

.animated-circle {
  cx: var(--circle-cx);
  cy: var(--circle-cy);
  r: var(--circle-radius);
  fill: var(--circle-color);
}

.animated-arrow {
  stroke-width: var(--stroke-width);
  stroke: var(--arrow-color);
}

/* MODIFIED: Keyframes updated to include a pause */
@keyframes scroll-down {
  0% {
    transform: translateY(0);
  }
  /* Peak of animation: 0.77 * 72% ≈ 55% */
  55% {
    transform: translateY(var(--animation-distance));
  }
  /* End of movement, start of pause */
  72% {
    transform: translateY(0);
  }
  /* End of pause */
  100% {
    transform: translateY(0);
  }
}

/* MODIFIED: Keyframes updated to include a pause */
@keyframes scroll-down-arrow {
  0% {
    transform: translateY(0);
  }
  /* Peak of animation: 0.77 * 72% ≈ 55% */
  55% {
    transform: translateY(var(--arrow-animation-distance));
  }
  /* End of movement, start of pause */
  72% {
    transform: translateY(0);
  }
  /* End of pause */
  100% {
    transform: translateY(0);
  }
}

.animated-circle {
  animation: scroll-down var(--animation-duration) var(--animation-timing) infinite;
}

.animated-arrow {
  animation: scroll-down-arrow var(--animation-duration) var(--animation-timing) infinite;
}
</style>