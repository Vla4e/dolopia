<script setup>
import LandingHero from '../components/LandingHero.vue'

// TODO: Merge all 4 into single component
import Pasta from '@/components/HomeView/FeaturedProjects/Pasta.vue';
import Tomato from '@/components/HomeView/FeaturedProjects/Tomato.vue';
import Vegetable from '@/components/HomeView/FeaturedProjects/Vegetable.vue';
import Fruit from '@/components/HomeView/FeaturedProjects/Fruit.vue';

import ProjectCatalogMobile from '@/components/ProjectCatalogMobile.vue';
import FeaturedProductGenerated from '@/components/HomeView/FeaturedProjects/FeaturedProductGenerated.vue';

import { inject, nextTick, onMounted, onUnmounted, ref } from 'vue';
const { isMobile } = inject('screenSize')
const emitter = inject('emitter')

let showFeaturedDisclaimer = ref(false);
let heroContainer = ref();
let firstFeaturedSection = ref();

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

  // Observer for the first featured section
  if (firstFeaturedSection.value) {
    console.log("FIRSTFEATUREDSECTION", firstFeaturedSection.value[0])
    const firstFeaturedOptions = {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.01, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9]
    };
    tomatoSectionObserver = new IntersectionObserver(tomatoSectionObserverCallback, firstFeaturedOptions);
    tomatoSectionObserver.observe(firstFeaturedSection.value[0]);
  } else {
      console.error("firstFeaturedSection ref is null/undefined during onMounted. Check template ref assignment.");
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

const products = [
  {
    layoutType: 'tomato',
    product: {
      route: '/projects/tomato-project/pasta-sauces/feta-cheese-savory',
      imageSrc: new URL('@/assets/landing/sections/tomato-group.png', import.meta.url).href,
      name: {
        large: 'Tomato sauce',
        small: 'with Feta and savory'
      },
      taglines: [
        { text: 'Thick, Creamy <b>Intensely Greek</b>' }
      ],
      description: `Dolopia's Tomato Sauce with Feta and Savory brings the<br />
      warmth of a summer garden straight to your plate. Made with<br />sun-ripened tomatoes, real chunks of Greek Feta, and the <br />earthy
      aroma of savory, this sauce turns any pasta into a rustic <br />
      Mediterranean experience.`,
      closingTagline: 'Tasty, Tangy <b>Irresistible</b>',
      projectInfo: `It's part of our Tomato project - a celebration of authentic traditional tomato sauces. Alongside classic<br />
      Mediterranean flavors, you'll find bold creations like our oriental sauce with 12 spices, or our oven-baked<br />
      aubergines in tomato sauce, inspired by the beloved Mousaka.`
    }
  },
  {
    layoutType: 'vegetable',
    product: {
      route: '/projects/vegetable-project/appetizer/aubergine-salad-smoked-tea',
      imageSrc: new URL('@/assets/landing/sections/vegetable-group.png', import.meta.url).href,
      name: {
        large: 'Aubergine Salad',
        small: 'with Smoked tea'
      },
      taglines: [
        { text: 'Smoky, Silky, <b>Unforgettable</b>', class: 'no-break' },
        { text: '<b>Rooted in <br />Mediterranean simplicity</b> Crafted with care', class: 'lt-1' }
      ],
      description: `One of Dolopia’s oldest recipes and still our biggest success, this<br />
      aubergine salad redefines tradition. Instead of smoking the <br />aubergines, we
      infuse the velvety pulp with smoked tea – a subtle <br />twist that preserves
      purity while adding mystery. A hint of garlic, a <br />drizzle of extra virgin
      olive oil, and fresh ingredients only <br />– no additives, ever.`,
      projectInfo: `Part of our Vegetable Project, under the Salads & Spreads subcategory, it shares the spotlight with red pepper
      <br />creations and slow-cooked vegetables in EVO oil`
    }
  },
  {
    layoutType: 'pasta',
    product: {
      route: '/projects/pasta-project/seafood-pasta/orzo-seafood',
      imageSrc: new URL('@/assets/landing/sections/pasta-group.png', import.meta.url).href,
      name: {
        large: 'Two-Coloured',
        small: 'Seafood Orzo'
      },
      taglines: [
        { text: 'Seafood elegance<br /><b>Shaped into orzo</b>' }
      ],
      description: `Dolopia’s Two-Coloured Seafood Orzo brings together two worlds: jet-black<br />
      orzo with squid ink and golden orzo infused with shellfish essence. It’s a visual <br />
      and culinary ode to the Greek seaside, where simplicity meets bold taste. <br />
      Part of our Pasta Project, this creation stands alongside traditional pastas <br />
      made with goat or sheep milk, vibrant vegan blends with vegetables and <br />
      spices, and other specialty shapes.`,
      closingTagline: 'Where simplicity meets<br /><b>Bold taste</b>',
      projectInfo: `Every piece of pasta is air-dried slowly, never heat-treated – so the aromas stay locked inside. With no<br />
      added salt and a naturally rough surface for sauces to cling to, it’s designed to carry flavor in every bite. <br />
      Pair it with seafood, lemon zest, or just a touch of olive oil – and let it speak for itself.`
    }
  },
  {
    layoutType: 'fruit',
    product: {
      route: '/projects/fruit-project/jam/strawberry-mint-pepper',
      imageSrc: new URL('@/assets/landing/sections/fruit-group.png', import.meta.url).href,
      name: {
        large: 'Strawberry',
        small: 'with Mint and Pepper Jam'
      },
      taglines: [
        { text: 'A bold twist on <b>classic sweetness</b>', class: 'lt-1 no-break' },
        { text: '<b>Sweet & Fresh</b> with Spicy notes', class: 'lt-2' }
      ],
      description: `Dolopia's Strawberry with Mint and Pepper Jam blends ripe<br />
      strawberries with fresh mint and a subtle hint of pepper, creating a<br />
      vibrant balance of sweet, fresh, and spicy notes. Perfect on its own<br />
      or paired with cheeses, it's equally delicious as a regular jam or a<br />
      creative filling for pastries and desserts.`,
      projectInfo: `Part of our Fruit Project, this jam joins a family of unique creations like fine cut lemon marmalade with extra<br />
      virgin olive oil and luscious candied cherries with bitter almonds – all made without colours, colour stabilizers,<br />
      or any other additives. Clean label, pure taste.`
    }
  }
];
</script>

<template>
  <div class="home-page-container">

    <div ref="heroContainer" class="hero-container">
      <LandingHero class="text-container" />
    </div>

    <img class="landing-mobile" v-if="isMobile" src="@/assets/landing/landing-mobile-smallest.png"/>

    <Transition name="slide-disclaimer" mode="in-out">
      <div v-show="showFeaturedDisclaimer" class="featured-products-disclaimer">Featured products</div>
    </Transition>

    <!-- Example usage of the new FeaturedProductGenerated.vue -->
    <div
      v-for="(prod, idx) in products"
      :key="prod.layoutType + idx"
      class="project-section"
      :ref="idx === 0 ? 'firstFeaturedSection' : null"
    >
      <FeaturedProductGenerated :layoutType="prod.layoutType" :product="prod.product" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Your existing styles remain the same */
.home-page-container{
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    &.gradient{
      background: url("@/assets/landing/gradient-background.png");
      background-size: cover;
    }
  }
}
@media(max-width: 450px){
  .home-page-container{
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