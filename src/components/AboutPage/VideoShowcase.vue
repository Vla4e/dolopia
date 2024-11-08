<template>
  <!-- Video is on left side -->
  <div v-if="side === 'left'" class="video-showcase left">
    <div class="video-container">
      <video 
        :src="videoSource" 
        disableremoteplayback="true"
      />
    </div>
    <div class="text-container">
      <h2>{{ heading }}</h2>
      <p>{{ paragraph }}</p>
    </div>
  </div>

  <!-- Video is on right side -->
  <div v-else class="video-showcase right">
    <div class="text-container">
    </div>
    <div class="video-container">
      <video 
        :src="videoSource" 
        disableremoteplayback="true"
      />
      <span class="flavour-text">{{ flavourText }}</span>
    </div>
  </div>

</template>

<script setup>
const props = defineProps({
  videoSource: {
    type: String,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  paragraph: {
    type: String,
    required: true
  },
  flavourText: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<style lang="scss" scoped>

</style>