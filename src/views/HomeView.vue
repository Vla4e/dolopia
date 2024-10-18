
<template>
  <div class="home-container">
    <div class="hero-container">
      <LandingHero />
    </div>
    <!-- <TheWelcome /> -->
  </div>
</template>

<script setup>
import LandingHero from '../components/LandingHero.vue'
</script>

<style lang="scss" scoped>
.home-container{
  justify-content: flex-start;
  padding-top: 10vh;
  .hero-container{
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>