<script setup>
import { nextTick, onMounted, ref } from 'vue';

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
  const offsetInVW = 10;
  const offsetManual = 9;
  const offsetFinal = offsetInVW - offsetManual
  const offsetInPixels = (offsetFinal * window.innerWidth) / 100;
  const leftVal = rightTargetRect.width - offsetInPixels;

  const marginOffset = 15;
  const heightOffset = 30 * topTargetRect.height / 100;

  const topVal = marginOffset + heightOffset;
  // // console.log("leftVal:", leftVal)
  // // console.log("TOPVAL", topVal)
  // Apply the positioning
  floatingImage.value.style.left = leftVal + 'px';
  // floatingImage.value.style.top = topVal + 'px';
  floatingImage.value.style.top = -topVal + 'px';
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
      <h2 ref="topTarget" class="product-name">
        Aubergine Salad
        <span class="small-text">
          with Smoked tea
        </span>
      </h2>
    </div>
    <div class="middle-section">
      <img ref="floatingImage" src="@/assets/landing/sections/vegetable-group.png" class="product-image"/>

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
    justify-content: flex-start;
    margin-bottom: 15px;
    position: relative;
    .product-name {
      display: flex;
      flex-direction: column;
      color: #FFF;
      text-align: left;
      font-family: "Century Gothic";
      font-size: clamp(3rem, 5vw, 6rem);
      line-height: clamp(3rem, 5vw, 6rem);
      font-style: normal;
      font-weight: 700;
      letter-spacing: 6px;
      .small-text {
        color: #FFF;
        text-align: left;
        font-family: "Century Gothic";
        font-size: clamp(1.5rem, 2.25vw, 2.5rem);
        line-height: clamp(1.5rem, 2.25vw, 2.5rem);
        font-style: normal;
        font-weight: 700;
        margin-top: 14px;
      }
    }
  }

  .middle-section {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: clamp(15px, 2vh, 50px);
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
        font-size: clamp(1.75rem, 2.5vw, 2.8rem);
        line-height: clamp(1.75rem, 2.5vw, 2.8rem);
        font-style: normal;
        font-weight: 400;
        letter-spacing: 0.9px;
        display: flex;
        flex-direction: column;
        &.no-break{
          display: inline;
        }
        &.lt-1{
          font-size: clamp(2rem, 2.5vw, 2.8rem);
          line-height: 1.25;
        }
        b {
          color: #039EA2;
          font-family: "Century Gothic";
          font-size: clamp(1.5rem, 2.25vw, 2.5rem);
          line-height: 1.25;
          font-style: normal;
          font-weight: 700;
          letter-spacing: 0.8px;
        }
      }

      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1.25vw, 1.25rem);
        line-height: 1.5;
        font-style: normal;
        font-weight: 400;        
        @media(max-width: 1600px) and (min-width: 1366px)and (max-height: 900px){
          font-size: 18px;
        }
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
      font-size: clamp(12px, 1.25vw, 1.25rem);
      line-height: 1.5;
      font-style: normal;
      font-weight: 400;        
        @media(max-width: 1600px) and (min-width: 1366px) and (max-height: 900px){
          font-size: 18px;
        }
    }
  }

  // Media query for smaller screens with 30% font-size reduction
  @media (max-width: 1600px) and (max-height: 900px) {
    .top-section {
      .product-name {
        font-size: clamp(2.1rem, 3.5vw, 4.2rem); // 30% reduction from clamp(3rem, 5vw, 6rem)
        line-height: clamp(2.1rem, 3.5vw, 4.2rem); // 30% reduction from clamp(3rem, 5vw, 6rem)
        
        .small-text {
          font-size: clamp(1.05rem, 1.575vw, 1.75rem); // 30% reduction from clamp(1.5rem, 2.25vw, 2.5rem)
          line-height: clamp(1.05rem, 1.575vw, 1.75rem); // 30% reduction from clamp(1.5rem, 2.25vw, 2.5rem)
        }
      }
    }

    .middle-section {
      .text {
        .large {
          font-size: clamp(1.225rem, 1.75vw, 1.96rem); // 30% reduction from clamp(1.75rem, 2.5vw, 2.8rem)
          line-height: clamp(1.225rem, 1.75vw, 1.96rem); // 30% reduction from clamp(1.75rem, 2.5vw, 2.8rem)
          
          &.lt-1 {
            font-size: clamp(1.4rem, 1.75vw, 1.96rem); // 30% reduction from clamp(2rem, 2.5vw, 2.8rem)
          }
          
          b {
            font-size: clamp(1.05rem, 1.575vw, 1.75rem); // 30% reduction from clamp(1.5rem, 2.25vw, 2.5rem)
          }
        }

        p {
          font-size: clamp(8.4px, 0.875vw, 0.875rem); // 30% reduction from clamp(12px, 1.25vw, 1.25rem)
        }
      }
    }

    .bottom-section {
      p {
        font-size: clamp(8.4px, 0.875vw, 0.875rem); // 30% reduction from clamp(12px, 1.25vw, 1.25rem)
      }
    }
  }
}
</style>