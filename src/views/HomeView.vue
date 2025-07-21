<script setup>
import LandingHero from '../components/LandingHero.vue'

// TODO: Merge all 4 into single component
import Pasta from '@/components/HomePage/FeaturedProjects/Pasta.vue';
import Tomato from '@/components/HomePage/FeaturedProjects/Tomato.vue';
import Vegetable from '@/components/HomePage/FeaturedProjects/Vegetable.vue';
import Fruit from '@/components/HomePage/FeaturedProjects/Fruit.vue';

import ProjectCatalogMobile from '@/components/ProjectCatalogMobile.vue';

import { inject, nextTick, onMounted, onUnmounted, ref } from 'vue';
const { isMobile } = inject('screenSize')
const emitter = inject('emitter')

let showFeaturedDisclaimer = ref(false);
let heroContainer = ref();
let tomatoSection = ref();

let heroObserver;
let tomatoSectionObserver;

// Callback to hide disclaimer when scrolling back up to hero section
const heroObserverCallback = (entries) => {
  entries.forEach(entry => {
    // If hero section is at least 30% visible and disclaimer is currently shown, hide it.
    if (entry.isIntersecting && entry.intersectionRatio >= 0.6 && showFeaturedDisclaimer.value) {
      showFeaturedDisclaimer.value = false;
    }
  });
}

// Callback to show disclaimer when scrolling into the first featured section
const tomatoSectionObserverCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.4 && !showFeaturedDisclaimer.value) {
      if (heroContainer.value) {
          showFeaturedDisclaimer.value = true;
      } else {
        // Fallback if heroContainer ref isn't ready for some reason
        showFeaturedDisclaimer.value = true;
      }
    }
  });
}

onMounted( async () => {
  emitter.emit('mountFinished', true)
  await nextTick(); // Ensure DOM is rendered before observing

  // Observer for the hero section
  if (heroContainer.value) {
    const heroOptions = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };
    heroObserver = new IntersectionObserver(heroObserverCallback, heroOptions);
    heroObserver.observe(heroContainer.value);
  }

  // Observer for the first featured section (Tomato)
  if (tomatoSection.value) {
    const firstFeaturedOptions = {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.01, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9]
    };
    tomatoSectionObserver = new IntersectionObserver(tomatoSectionObserverCallback, firstFeaturedOptions);
    tomatoSectionObserver.observe(tomatoSection.value);
  } else {
      console.error("tomatoSection ref is null/undefined during onMounted. Check template ref assignment.");
  }
})

onUnmounted(() => {
  if (heroObserver) {
    heroObserver.disconnect();
  }
  if (tomatoSectionObserver) {
    tomatoSectionObserver.disconnect();
  }
})
</script>

<template>
  <div class="home-container">

    <div ref="heroContainer" class="hero-container">
      <LandingHero class="text-container" />
    </div>

    <img class="landing-mobile" v-if="isMobile" src="@/assets/landing/landing-mobile-smallest.png"/>

    <div v-if="!isMobile" class="project-section" id="tomato" key="phase-4" ref="tomatoSection">
      <Tomato/>
    </div>
    <div v-if="!isMobile" class="project-section gradient" key="phase-3">
      <Vegetable :project="'pasta'"/>
    </div>
    <div v-if="!isMobile" class="project-section" key="phase-5">
      <Pasta :project="'vegetable'"/>
    </div>
    <div v-if="!isMobile" class="project-section gradient" key="phase-6">
      <Fruit :project="'fruit'"/>
    </div>
    <Transition name="slide-disclaimer" mode="in-out">
      <div v-show="showFeaturedDisclaimer" class="featured-products-disclaimer">Featured products</div>
    </Transition>

  </div>
</template>

<style lang="scss" scoped>
/* Your existing styles remain the same */
.home-container{
  justify-content: flex-start;
  // padding-top: 10vh;
  .hero-container{
    min-height: 100vh;
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
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 0.8; /* 83.333% */
  z-index: 2000;
  pointer-events: none;
  @media(max-width: 1600px){
    font-size: 28px;
    line-height: 28px;
  }
}

/* Transition for the disclaimer */
.slide-disclaimer-enter-active,
.slide-disclaimer-leave-active {
  transition: transform 0.5s ease;
}

.slide-disclaimer-enter-from,
.slide-disclaimer-leave-to {
  transform: translateY(-50%) translateX(-100%);
}
</style>