
<script setup>
import LandingHero from '../components/LandingHero.vue'
import AboutProjects from '@/components/AboutPage/AboutProjects.vue';
import ProjectCatalogMobile from '@/components/ProjectCatalogMobile.vue';

import { inject, onMounted, ref } from 'vue';
const { isMobile } = inject('screenSize')
const emitter = inject('emitter')

onMounted(() => {
  console.log("Emitting mount finished")
  emitter.emit('mountFinished', true)
})
</script>

<template>
  <div class="home-container">

    <div class="hero-container">
      <LandingHero />
    </div>
    
    <!-- Mobile only -->
    <img class="landing-mobile" v-if="isMobile" src="@/assets/landing/landing-mobile-smallest.png"/>

    <!-- Phase 3 - 6 -->
    <!-- <div class="phase phase-3" key="phase-3">
      <AboutProjects :project="'pasta'"/>
    </div>
    <div class="phase phase-4" key="phase-4">
      <AboutProjects :project="'tomato'"/>
    </div>
    <div class="phase phase-5" key="phase-5">
      <AboutProjects :project="'vegetable'"/>
    </div>
    <div class="phase phase-6" key="phase-6">
      <AboutProjects :project="'fruit'"/>
    </div> -->
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