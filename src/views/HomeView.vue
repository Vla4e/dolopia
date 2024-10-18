
<script setup>
import LandingHero from '../components/LandingHero.vue'
import ProjectCatalogMobile from '@/components/ProjectCatalogMobile.vue';

import { inject } from 'vue';
const { isMobile } = inject('screenSize')
</script>

<template>
  <div class="home-container">

    <div class="hero-container">
      <LandingHero />
    </div>

    <!-- Mobile only -->
    <img class="landing-mobile" v-if="isMobile" src="@/assets/landing/landing-mobile-edited.png"/>

    <!-- <ProjectCatalogMobile v-if="isMobile"/> -->

  </div>
</template>

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
@media(max-width: 450px){
  .home-container{
    padding-top: 0px;
    min-height: calc(100vw * 4.334) !important;
    .hero-container{
      z-index: 2;
      padding-top: 20vh;
      color: black;
    }
  }
  .landing-mobile{
    position: absolute;
    width: 100vw;
    height: calc(100vw * 4.334);
    max-height: calc(100vw * 4.334) !important;
    z-index: 1;
  }
  .project-cards-container{
    z-index: 2;
  }
}
</style>