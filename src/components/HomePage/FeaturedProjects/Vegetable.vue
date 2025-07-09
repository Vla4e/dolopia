<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { goToRoute } from '@/helpers/goToRoute';

defineOptions({
  name:'FeaturedTomato'
})

let container = ref();
let topTarget = ref();
let rightTarget = ref();
let floatingImage = ref();
let topSection = ref();

const positionElementC = async () => {
  await nextTick(); // Ensure DOM is updated

  if (!container.value || !topTarget.value || !rightTarget.value || !floatingImage.value) {
      return;
  }

  // Get the bounding topTargetRectngles relative to the viewport
  const topTargetRect = topTarget.value.getBoundingClientRect();
  const rightTargetRect = rightTarget.value.getBoundingClientRect();
  // C's right edge should align with B's left edge
  // So C's left position = B's left - C's width
  const offsetInVW = 12;
  const offsetManual = 0;
  const offsetFinal = offsetInVW - offsetManual
  const offsetInPixels = (offsetFinal * window.innerWidth) / 100;
  const leftVal = rightTargetRect.width - offsetInPixels;

  const marginOffset = 15;
  console.log("TTR>H", topTargetRect.height)
  const heightOffset = 30 * topTargetRect.height / 100;

  const topVal = marginOffset + heightOffset;
  // // console.log("leftVal:", leftVal)
  // // console.log("TOPVAL", topVal)
  // Apply the positioning
  floatingImage.value.style.left = leftVal + 'px';
  // floatingImage.value.style.top = topVal + 'px';
  // floatingImage.value.style.top = -topVal + 'px';
};

onMounted( async () => {
  setTimeout( async () => {
    await positionElementC();
  }, 500)
})

</script>

<template>
  <section ref="container" class="featured">

    <div ref="topSection" class="top-section">
      <h2 @click="goToRoute('/projects/vegetable-project/appetizer/aubergine-salad-smoked-tea')" ref="topTarget" class="product-name">
        Aubergine Salad
        <span class="small-text">
          with Smoked tea
        </span>
      </h2>
    </div>
    <div class="middle-section">
      <img @click="goToRoute('/projects/vegetable-project/appetizer/aubergine-salad-smoked-tea')" ref="floatingImage" src="@/assets/landing/sections/vegetable-group.png" class="product-image"/>

      <div class="text">
        <span ref="rightTarget" class="large no-break">
          Smoky, Silky, <b>Unforgettable</b>
        </span>
        <p>
          One of Dolopia’s oldest recipes and still our biggest success, this
          <br/> aubergine salad redefines tradition. Instead of smoking the
          <br/>aubergines, we infuse the velvety pulp with smoked tea – a subtle
          <br/>twist that preserves purity while adding mystery. A hint of garlic, a
          <br/>drizzle of extra virgin olive oil, and fresh ingredients only
          <br/>– no additives, ever. 
        </p>
        
        <span class="large lt-1">
          <b>Rooted in 
          <br/>Mediterranean simplicity</b>
          Crafted with care
        </span>
      </div>
    </div>
    <div class="bottom-section">
      <p>
        Part of our Vegetable Project, under the Salads & Spreads subcategory, it shares the spotlight with red pepper
        <br/>creations and slow-cooked vegetables in EVO oil 
      </p>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.featured {
  display: flex;
  flex-direction: column;
  width: 60%;
  margin: 0 auto;
  height: 100vh;
  justify-content: center;
  align-items: center;
  color: black;
  position: relative;
  
  .top-section {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    margin-bottom: 15px;
    position: relative;
    .product-name {
      display: flex;
      flex-direction: column;
      color: #FFF;
      text-align: left;
      font-family: "Century Gothic";
      /* Further reduced */
      font-size: clamp(2.3rem, 4vw, 4.8rem);
      line-height: 1.1;
      font-style: normal;
      font-weight: 700;
      letter-spacing: 6px;
      cursor: pointer;
      .small-text {
        color: #FFF;
        text-align: left;
        font-family: "Century Gothic";
        /* Further reduced */
        font-size: clamp(1.2rem, 1.8vw, 2.0rem);
        line-height: 1.1;
        font-style: normal;
        font-weight: 700;
        margin-top: 12px;
      }
    }
  }

  .middle-section {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: clamp(15px, 2vh, 30px);
    width: 100%;
    position: relative;
    overflow: visible;

    .product-image {
      width: 28vw;
      object-fit: contain;
      max-width: 100%;
      position: absolute;
      // right: 0;
      // top: 50%;
      bottom: -25px;
      // transform: translateY(-50%);
      cursor: pointer;
    }

    .text {
      display: flex;
      flex-direction: column;
      row-gap: 12px;
      width: 60%;
      .large {
        color: #039EA2;
        font-family: "Century Gothic";
        font-size: clamp(1.4rem, 2vw, 2.2rem);
        line-height: 1.25;
        font-style: normal;
        font-weight: 400;
        letter-spacing: 0.9px;
        display: flex;
        flex-direction: column;

        b {
          color: #039EA2;
          font-family: "Century Gothic";
          font-size: clamp(1.3rem, 1.9vw, 2.1rem);
          line-height: 1.25;
          font-style: normal;
          font-weight: 700;
          letter-spacing: 0.8px;
        }
      }

      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1.05vw, 1.05rem);
        line-height: 1.6;
        font-style: normal;
        font-weight: 400;
      }
    }
  }

  .bottom-section {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    p {
      color: #000;
      font-family: "Raleway";
      font-size: clamp(12px, 1.05vw, 1.05rem);
      line-height: 1.6;
      font-style: normal;
      font-weight: 400;
    }
  }

  @media (max-width: 1600px) and (max-height: 900px) {
    .top-section .product-name {
      font-size: clamp(2.1rem, 3.5vw, 4.2rem);
      line-height: 1.1;
      .small-text {
        font-size: clamp(1.1rem, 1.6vw, 1.8rem);
        line-height: 1.1;
      }
    }
    .middle-section .text {
      .large {
        font-size: clamp(1.2rem, 1.7vw, 1.9rem);
        b { font-size: clamp(1.1rem, 1.5vw, 1.7rem); }
      }
      p { font-size: clamp(10px, 0.9vw, 0.9rem); }
    }
    .bottom-section p { font-size: clamp(10px, 0.9vw, 0.9rem); }
  }
}
</style>