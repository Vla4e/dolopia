<script setup>
import { nextTick, onMounted, ref } from 'vue';

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

  const offsetInVW = 6;
  const offsetManual = 9;
  const offsetFinal = offsetInVW - offsetManual
  const offsetInPixels = (offsetFinal * window.innerWidth) / 100;
  const rightVal = rightTargetRect.width - offsetInPixels;

  const marginOffset = 15;
  const heightOffset = 30 * topTargetRect.height / 100;

  const topVal = marginOffset + heightOffset;

  floatingImage.value.style.right = rightVal + 'px';
  floatingImage.value.style.top = -topVal + 'px';
};

// No need to inject emitter or use IntersectionObserver here anymore
// import {inject, onUnmounted} from 'vue'; // REMOVE THIS LINE
// let observer = null; // REMOVE THIS LINE
// let hasTriggeredEnter = ref(false) // REMOVE THIS LINE
// const observerCallback = (entries) => { ... } // REMOVE THIS FUNCTION

onMounted(async () => {
  // Position the floating image
  setTimeout(async () => {
    await positionElementC();
  }, 500);

  // IntersectionObserver logic for this component is moved to Home.vue
});

// onUnmounted(() => { // REMOVE THIS onUnmounted BLOCK
//   if (observer) {
//     observer.disconnect();
//   }
// });

</script>

<template>
  <section ref="container" class="featured"> 

    <div ref="topSection" class="top-section">
      <h2 ref="topTarget" class="product-name">
        Tomato sauce
        <span class="small-text">
          with Feta and savory
        </span>
      </h2>
    </div>
    <div class="middle-section">
      <img ref="floatingImage" src="@/assets/landing/sections/tomato-group.png" class="product-image"/>

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
/* Your existing styles remain the same */
.featured {
  display: flex;
  flex-direction: column;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
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
      color: #FFF;
      text-align: right;
      font-family: "Century Gothic";
      font-size: clamp(2.5rem, 7vw, 7rem);
      line-height: 1; // 135% of font-size
      font-style: normal;
      font-weight: 700;
      letter-spacing: 6px;
      .small-text {
        color: #FFF;
        text-align: right;
        font-family: "Century Gothic";
        font-size: clamp(1.5rem, 3vw, 4rem);
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
    margin-bottom: 30px;;
    width: 100%;
    // height: 45%;
    position: relative;
    overflow: visible;

    .product-image {
      width: 30vw;
      // width: 30vw;
      // height: auto;
      object-fit: contain;
      max-width: 100%;
      position: absolute;
      // top: -25%;
      // left: 5%;
    }

    .text {
      display: flex;
      flex-direction: column;
      row-gap: 12px;
      margin-right: 40px;
      .large {
        color: #039EA2;
        font-family: "Century Gothic";
        font-size: clamp(1.4rem, 2.5vw, 2.8rem);
        line-height: 1.2;
        font-style: normal;
        font-weight: 400;
        letter-spacing: 0.9px;
        display: flex;
        flex-direction: column;
        b {
          color: #039EA2;
          font-family: "Century Gothic";
          font-size: clamp(1.3rem, 2vw, 2.5rem);
          line-height: 1.2;
          font-style: normal;
          font-weight: 700;
          letter-spacing: 0.8px;
        }
      }

      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1.3vw, 1.25rem);
        line-height: 1.5;
        font-style: normal;
        font-weight: 400;
      }
    }
  }

  .bottom-section {
    p {
      color: #000;
      font-family: "Raleway";
      font-size: clamp(12px, 1.3vw, 1.25rem);
      line-height: 1.5;
      font-style: normal;
      font-weight: 400;
    }
  }

  // Media query for smaller screens with 30% font-size reduction
  @media (max-width: 1600px) and (max-height: 900px) {
    .top-section {
      .product-name {
        font-size: clamp(1.75rem, 4.9vw, 4.9rem); // 30% reduction from clamp(2.5rem, 7vw, 7rem)

        .small-text {
          font-size: clamp(1.05rem, 2.1vw, 2.8rem); // 30% reduction from clamp(1.5rem, 3vw, 4rem)
        }
      }
    }

    .middle-section {
      .text {
        .large {
          font-size: clamp(0.98rem, 1.75vw, 1.96rem); // 30% reduction from clamp(1.4rem, 2.5vw, 2.8rem)

          b {
            font-size: clamp(0.91rem, 1.4vw, 1.75rem); // 30% reduction from clamp(1.3rem, 2vw, 2.5rem)
          }
        }

        p {
          font-size: clamp(8.4px, 0.91vw, 0.875rem); // 30% reduction from clamp(12px, 1.3vw, 1.25rem)
        }
      }
    }

    .bottom-section {
      p {
        font-size: clamp(8.4px, 0.91vw, 0.875rem); // 30% reduction from clamp(12px, 1.3vw, 1.25rem)
      }
    }
  }
}
</style>