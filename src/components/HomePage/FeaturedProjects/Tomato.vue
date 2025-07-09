<script setup>
import { nextTick, onMounted, ref } from 'vue';
import ChevronLink from '@/components/Routing/ChevronLink.vue';
import { goToRoute } from '@/helpers/goToRoute';

defineOptions({
  name:'FeaturedTomato'
})

let container = ref(); // Keep this ref if it's still used by positionElementC
let topTarget = ref();
let rightTarget = ref();
let floatingImage = ref();
let topSection = ref();

const positionElementC = async () => {
  await nextTick();

  if (!container.value || !topTarget.value || !rightTarget.value || !floatingImage.value) {
      return;
  }

  const containerRect = container.value.getBoundingClientRect();
  const topTargetRect = topTarget.value.getBoundingClientRect();
  const rightTargetRect = rightTarget.value.getBoundingClientRect();

  const offsetInVW = 9;
  const offsetManual = 9;
  const offsetFinal = offsetInVW - offsetManual
  const offsetInPixels = (offsetFinal * window.innerWidth) / 100;
  const rightVal = rightTargetRect.width - offsetInPixels;

  const marginOffset = 15;
  const heightOffset = 30 * topTargetRect.height / 100;

  const topVal = marginOffset + heightOffset;

  floatingImage.value.style.right = rightVal + 'px';
  // floatingImage.value.style.top = -topVal + 'px';
};


onMounted(async () => {
  // Position the floating image
  setTimeout(async () => {
    await positionElementC();
  }, 500);

});

</script>

<template>
  <section ref="container" class="featured">

    <div ref="topSection" class="top-section">
      
      <h2 @click="goToRoute('/projects/tomato-project/pasta-sauces/feta-cheese-savory')" ref="topTarget" class="product-name">
        Tomato sauce
        <span class="small-text">
          with Feta and savory
        </span>
      </h2>
      <!-- <ChevronLink style="z-index: 10;" :routePath="'/catalog'" linkText=""/> -->
    </div>
    <div class="middle-section">
      <img @click="goToRoute('/projects/tomato-project/pasta-sauces/feta-cheese-savory')" ref="floatingImage" src="@/assets/landing/sections/tomato-group.png" class="product-image"/>

      <div class="text">
        <span ref="rightTarget" class="large">
          Thick, Creamy
          <b>Intensely Greek</b>
        </span>
        <p>
          Dolopia's Tomato Sauce with Feta and Savory brings the
          <br/>
          warmth of a summer garden straight to your plate. Made with
          <br/>sun-ripened tomatoes, real chunks of Greek Feta, and the
          <br/>earthy aroma of savory, this sauce turns any pasta into a rustic
          <br/> Mediterranean experience.
        </p>

        <span class="large">
          Tasty, Tangy
          <b>Irresistible</b>
        </span>
      </div>
    </div>
    <div class="bottom-section">
      <p>
        It's part of our Tomato project - a celebration of authentic traditional tomato sauces. Alongside classic
        <br/>
        Mediterranean flavors, you'll find bold creations like our oriental sauce with 12 spices, or our oven-baked
        <br/>
        aubergines in tomato sauce, inspired by the beloved Mousaka.
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
    justify-content: flex-end;
    margin-bottom: 15px;
    position: relative;
    .product-name {
      display: flex;
      flex-direction: column;
      width: 60%;
      margin-right: 25%;
      color: #FFF;
      text-align: right;
      font-family: "Century Gothic";
      /* Further reduced */
      font-size: clamp(2.2rem, 4.5vw, 5rem);
      line-height: 1.1;
      font-style: normal;
      font-weight: 700;
      letter-spacing: 6px;
      cursor: pointer;
      .small-text {
        color: #FFF;
        text-align: right;
        font-family: "Century Gothic";
        /* Further reduced */
        font-size: clamp(1.2rem, 2vw, 2.8rem);
        line-height: 1;
        font-style: normal;
        font-weight: 700;
        letter-spacing: 0.9px;
      }
    }
  }

  .middle-section {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    margin-bottom: 20px;
    width: 100%;
    position: relative;
    overflow: visible;

    .product-image {
      width: 28vw;
      object-fit: contain;
      max-width: 100%;
      position: absolute;
      // left: 0;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }

    .text {
      display: flex;
      flex-direction: column;
      row-gap: 12px;
      margin-right: 40px;
      width: 60%;
      .large {
        color: #039EA2;
        font-family: "Century Gothic";
        font-size: clamp(1.2rem, 2.0vw, 2.2rem);
        line-height: 1.2;
        font-style: normal;
        font-weight: 400;
        letter-spacing: 0.9px;
        display: flex;
        flex-direction: column;
        b {
          color: #039EA2;
          font-family: "Century Gothic";
          font-size: clamp(1.1rem, 1.7vw, 2.1rem);
          line-height: 1.2;
          font-style: normal;
          font-weight: 700;
          letter-spacing: 0.8px;
        }
      }

      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1.1vw, 1.05rem);
        line-height: 1.6;
        font-style: normal;
        font-weight: 400;
      }
    }
  }

  .bottom-section {
    p {
      color: #000;
      font-family: "Raleway";
      font-size: clamp(12px, 1.1vw, 1.05rem);
      line-height: 1.6;
      font-style: normal;
      font-weight: 400;
    }
  }

  @media (max-width: 1600px) and (max-height: 900px) {
    .top-section .product-name {
      font-size: clamp(1.8rem, 4.2vw, 4.2rem);
      .small-text { font-size: clamp(1.1rem, 1.8vw, 2.4rem); }
    }
    .middle-section .text {
      .large {
        font-size: clamp(1rem, 1.5vw, 1.7rem);
        b { font-size: clamp(0.9rem, 1.2vw, 1.5rem); }
      }
      p { font-size: clamp(10px, 0.9vw, 0.9rem); }
    }
    .bottom-section p { font-size: clamp(10px, 0.9vw, 0.9rem); }
  }
}
</style>