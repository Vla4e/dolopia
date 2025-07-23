<script setup>
import ChevronLink from "@/components/Routing/ChevronLink.vue";
import { nextTick, onMounted, ref } from "vue";

defineOptions({
  name: "FeaturedTomato",
});

let container = ref();
let topTarget = ref();
let rightTarget = ref();
let leftTarget = ref();
let bottomTarget = ref();
let floatingImage = ref();
let topSection = ref();

const positionElementC = async () => {
  await nextTick(); // Ensure DOM is updated

  if (
    !container.value ||
    !topTarget.value ||
    !rightTarget.value ||
    !floatingImage.value
  ) {
    return;
  }

  // Get the bounding topTargetRectngles relative to the viewport
  const topTargetRect = topTarget.value.getBoundingClientRect();
  const rightTargetRect = rightTarget.value.getBoundingClientRect();
  const leftTargetRect = leftTarget.value.getBoundingClientRect();
  const bottomTargetRect = bottomTarget.value.getBoundingClientRect();
  const imageRect = floatingImage.value.getBoundingClientRect();
  // C's right edge should align with B's left edge
  // So C's left position = B's left - C's width
  const offsetInVW = 10;
  const offsetManual = 0;
  const offsetFinal = offsetInVW - offsetManual;
  const offsetInPixels = (offsetFinal * window.innerWidth) / 100;
  const leftVal = rightTargetRect.width - offsetInPixels;
  // console.log()
  const offsetByAwardIcon = (25 * imageRect.width) / 100; //Icon is 34.4% of the whole image, removing 9.4% for space to left

  const marginOffset = 0;
  const heightOffset = (5 * imageRect.height) / 100;
  const topVal = marginOffset + heightOffset;

  // Apply the positioning
  floatingImage.value.style.left =
    leftTargetRect.width - (offsetByAwardIcon + offsetInPixels) + "px";
  // floatingImage.value.style.top = topVal + 'px';
  floatingImage.value.style.bottom = -heightOffset + "px";
};

onMounted(async () => {
  setTimeout(async () => {
    await positionElementC();
  }, 500);
});

let hoverProp = ref(false);
</script>

<template>
  <section ref="container" class="featured">

    <div ref="topSection" class="top-section">
      <router-link
        to="/projects/fruit-project/jam/strawberry-mint-pepper"
        class="product-name-link"
        @mouseenter="hoverProp = true"
        @mouseleave="hoverProp = false"
      >
        <h2 ref="topTarget" class="product-name">
          Strawberry
          <span class="small-text"> with Mint and Pepper Jam </span>
        </h2>
        <ChevronLink :routePath="'/catalog'" :hoverProp="hoverProp" linkText="" />
      </router-link>
    </div>

    <div class="middle-section">
      <router-link
        to="/projects/fruit-project/jam/strawberry-mint-pepper"
        class="product-image-link"
        @mouseenter="hoverProp = true"
        @mouseleave="hoverProp = false"
      >
        <img
          ref="floatingImage"
          src="@/assets/landing/sections/fruit-group.png"
          class="product-image"
        />
      </router-link>
      <div class="text">
        <span ref="rightTarget" class="large lt-1 no-break">
          A bold twist on <b>classic sweetness</b>
        </span>
        <p>
          Dolopia's Strawberry with Mint and Pepper Jam blends ripe
          <br />
          strawberries with fresh mint and a subtle hint of pepper, creating a
          <br />
          vibrant balance of sweet, fresh, and spicy notes. Perfect on its own
          <br />
          or paired with cheeses, it's equally delicious as a regular jam or a
          <br />
          creative filling for pastries and desserts.
        </p>

        <span ref="leftTarget" class="large lt-2">
          <b>Sweet & Fresh</b>
          with Spicy notes
        </span>
      </div>
    </div>

    <div ref="bottomTarget" class="bottom-section">
      <p>
        Part of our Fruit Project, this jam joins a family of unique creations like fine
        cut lemon marmalade with extra
        <br />
        virgin olive oil and luscious candied cherries with bitter almonds – all made
        without colours, colour stabilizers,
        <br />
        or any other additives. Clean label, pure taste.
      </p>
    </div>

  </section>
</template>

<style lang="scss" scoped>
.product-name-link {
  text-decoration: none;
  color: inherit;
  display: contents;
  .chevron-link-container{
    margin-left: 15px;
  }
}
.product-image-link{
  text-decoration: none;
  color: inherit;
  display: contents;
}

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
    align-items: center;
    margin-bottom: 15px;
    position: relative;
    .product-name {
      display: flex;
      flex-direction: column;
      color: #fff;
      text-align: left;
      font-family: "Century Gothic";
      // Reduced font size by ~15%
      font-size: clamp(2.5rem, 5vw, 5.1rem);
      line-height: 1.1;
      font-style: normal;
      font-weight: 700;
      letter-spacing: 5px;

      @media (min-width: 1400px) and (max-height: 800px) {
        font-size: clamp(1.8rem, 3.5vw, 3.6rem);
        line-height: 1.1;
        .small-text {
          font-size: clamp(0.9rem, 1.5vw, 1.5rem);
        }
      }
      .small-text {
        color: #fff;
        text-align: right;
        font-family: "Century Gothic";
        font-size: clamp(1.05rem, 2.1vw, 2.1rem);
        line-height: 1;
        font-style: normal;
        font-weight: 700;
        margin-top: 10px;
      }
    }
  }

  .middle-section {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 20px; // Reduced from 30px
    width: 100%;
    position: relative;
    overflow: visible;

    .product-image {
      width: 25vw; // Reduced from 27vw
      object-fit: contain;
      max-width: 100%;
      position: absolute;
      // top: 50%;
      // transform: translateY(-50%);
    }

    .text {
      display: flex;
      flex-direction: column;
      row-gap: 12px;
      width: 65%; // Adjusted width to prevent overlap

      .large {
        color: #039ea2;
        font-family: "Century Gothic";
        font-style: normal;
        font-weight: 400;
        letter-spacing: 0.9px;
        display: flex;
        flex-direction: column;
        // margin-bottom: 25px;
        &.lt-1 {
          font-size: clamp(1.3rem, 1.9vw, 1.9rem);
          line-height: 1.25;
          b {
            font-size: clamp(1.3rem, 1.9vw, 1.9rem);
          }
        }
        &.lt-2 {
          font-size: clamp(1.7rem, 2.5vw, 2.5rem);
          line-height: 1.1;
          b {
            font-size: clamp(1.8rem, 2.6vw, 2.6rem);
          }
          margin-bottom: 25px;
        }
        &.no-break {
          display: inline;
        }

        @media (min-width: 1400px) and (max-height: 800px) {
          &.lt-1 {
            font-size: clamp(1.1rem, 1.6vw, 1.6rem);
          }
          &.lt-2 {
            font-size: clamp(1.4rem, 2.1vw, 2.1rem);
          }
        }
      }

      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(0.9rem, 1.2vw, 1.1rem);
        line-height: 1.6;
        font-style: normal;
        font-weight: 400;
        margin-bottom: 30px; // Reduced from 50px

        @media (min-width: 1400px) and (max-height: 800px) {
          font-size: clamp(0.7rem, 1vw, 0.9rem);
          margin-bottom: 25px;
        }
        @media (max-width: 1366px) {
          margin-bottom: 20px;
          font-size: 12px;
        }
      }
    }
  }

  .bottom-section {
    width: 100%;
    @media (min-width: 1400px) and (max-height: 800px) {
      margin-top: -15px;
    }

    p {
      color: #000;
      font-family: "Raleway";
      font-size: clamp(0.9rem, 1vw, 1.1rem);
      line-height: 1.6;
      @media (min-width: 1400px) and (max-height: 800px) {
        font-size: clamp(0.7rem, 0.8vw, 0.8rem);
      }
      @media (max-width: 1366px) {
        font-size: 12px;
      }
      font-style: normal;
      font-weight: 400;
    }
  }
}
</style>
