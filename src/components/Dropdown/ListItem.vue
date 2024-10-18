<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  }
});

const processedText = computed(() => {
  return props.text.replace(/\*/g, '');
});
</script>

<template>
  <li>{{ processedText }}</li>
</template>
