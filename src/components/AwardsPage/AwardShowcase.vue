
<script setup>
import { ref, watch, onMounted } from 'vue';
const props = defineProps({
  award: {
    type: String,
    required: true
  }
})
watch(() => props.award, (value) => {
  console.log("value", value)
}, { immediate: true })
</script>

<template>
  <div class="award-container">
    <div class="white-bg"/>
    <div class="blue-bg"/>
    <div class="text-section">
      <img :src="awardImage"/>
      <div class="text-container">
        <div class="heading-container">
          <h2></h2>
          <span></span>|<span></span>
        </div> 
        <p class="award-description"></p>
      </div>
    </div>
    <div class="products-section">
    <!-- Product Carousel -->
    <!-- Product Description -->
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>