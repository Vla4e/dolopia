
<script setup>
import Pasta from '@/components/HomePage/FeaturedProjects/Pasta.vue';
import LandingHero from '../components/LandingHero.vue'
import AboutProjects from '@/components/AboutPage/AboutProjects.vue';
import Tomato from '@/components/HomePage/FeaturedProjects/Tomato.vue';
import ProjectCatalogMobile from '@/components/ProjectCatalogMobile.vue';

import { inject, onMounted, ref } from 'vue';
import Vegetable from '@/components/HomePage/FeaturedProjects/Vegetable.vue';
import Fruit from '@/components/HomePage/FeaturedProjects/Fruit.vue';
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
      <LandingHero class="text-container" />
    </div>
    
    <!-- Mobile only -->
    <img class="landing-mobile" v-if="isMobile" src="@/assets/landing/landing-mobile-smallest.png"/>

    <!-- Phase 3 - 6 -->
    <div class="project-section" key="phase-4">
      <Tomato/>
    </div>
    <div class="project-section gradient" key="phase-3">
      <Vegetable :project="'pasta'"/>
    </div>
    <div class="project-section" key="phase-5">
      <Pasta :project="'vegetable'"/>
    </div>
    <div class="project-section gradient" key="phase-6">
      <Fruit :project="'fruit'"/>
    </div>
    <!-- <ProjectCatalogMobile v-if="isMobile"/> -->
    <div class="featured-products-disclaimer">Featured products</div>

  </div>
</template>

<style lang="scss" scoped>
.home-container{
  justify-content: flex-start;
  // padding-top: 10vh;
  .hero-container{
    .text-container{
      width: 90%;
      margin-left: auto;
      margin-right: auto;
      padding-top: 10vh;
    }
    height: 100vh;
    background: url("@/assets/landing/landing.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
  .about-singular-project{
    padding-top: 5vh;
    padding-bottom: 5vh;
  }
  .project-section{
    background: #CEEBEC;
    &.gradient{
      background: url("@/assets/landing/gradient-background.png");
      background-size: cover;
    }
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
.featured-products-disclaimer{
  position: fixed;
  left: 0;
  top: 50%;
  writing-mode: vertical-rl;
  transform: translateY(-50%);
  padding: 15px 25px;
  // min-width: 150px;
  min-height: 100px;
  border-radius: 0px 50px 50px 50px;
  background: rgba(255, 255, 255, 0.50);
  color: #039EA2;
  text-align: center;
  font-family: "Century Gothic";
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 30px; /* 83.333% */
  z-index: 2000;
  @media(max-width: 1600px){
    font-size: 28px;
    line-height: 28px;
  }
}
</style>