<template>
  <div class="chevron-link-container" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <router-link :to="routePath" class="chevron-link">
      <span :class="['link-text', { 'is-hovered': hovered }]">{{ linkText }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#131313"
        class="bi bi-chevron-right chevron"
        viewBox="0 0 16 16"
        :class="{ 'is-hovered': hovered }"
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
import { ref } from 'vue';
defineOptions({
  name: 'ChevronLink'
})
// Define props for route path and link text
const props = defineProps({
  routePath: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    default: 'Go to product', // A sensible default
  },
});

const hovered = ref(false);
</script>

<style lang="scss" scoped>
.chevron-link-container {
  display: inline-block; // Ensures the container wraps its content tightly
  overflow: hidden; // Hides the text initially
  position: relative;
  // Adjust these values as needed for your layout
  width: auto; // Will expand with content
  height: 21px; // Based on your original chevron height
  cursor: pointer;
  margin-top: 20px;
}

.chevron-link {
  display: flex;
  align-items: center;
  gap: 5px; // Space between text and chevron
  text-decoration: none; // Remove default router-link underline
  color: white; // Set text color

  // Position the entire link, if needed, or let parent handle it
  // For example, to replicate your original positioning:
  // position: absolute;
  // top: 50%;
  // right: 10%;
  // transform: translateY(-50%); // Center vertically
  // z-index: 10;
}

.link-text {
  white-space: nowrap; // Prevents text from wrapping
  transform: translateX(-100%); // Initially hide the text to the left
  opacity: 0; // Start with text invisible
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  padding-left: 5px; // Give a little padding from the edge if it's revealed from the left
}

.link-text.is-hovered {
  transform: translateX(0); // Reveal text by moving it to its natural position
  opacity: 1; // Make text visible
}

.chevron {
  width: 20px;
  height: 20px;
  flex-shrink: 0; // Prevents the chevron from shrinking
  transition: transform 0.3s ease-out; // Smooth transition for chevron movement
  fill: white;
  stroke: white;
}

.chevron.is-hovered {
  transform: translateX(10px); // Move chevron to the right
}
</style>