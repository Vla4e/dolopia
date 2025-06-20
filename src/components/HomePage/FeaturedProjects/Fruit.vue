<script setup>
import { nextTick, onMounted, ref } from 'vue';

defineOptions({
  name:'FeaturedTomato'
})

let container = ref();
let topTarget = ref();
let rightTarget = ref();
let leftTarget = ref();
let bottomTarget = ref();
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
  const leftTargetRect = leftTarget.value.getBoundingClientRect();
  const bottomTargetRect = bottomTarget.value.getBoundingClientRect();
  const imageRect = floatingImage.value.getBoundingClientRect();
  // C's right edge should align with B's left edge
  // So C's left position = B's left - C's width
  const offsetInVW = 0;
  const offsetManual = 0;
  const offsetFinal = offsetInVW - offsetManual
  const offsetInPixels = (offsetFinal * window.innerWidth) / 100;
  const leftVal = rightTargetRect.width - offsetInPixels;
  const offsetByAwardIcon = (25 * imageRect.width / 100); //Icon is 34.4% of the whole image, removing 9.4% for space to left

  const marginOffset = 0;
  const heightOffset = 10 * imageRect.height / 100;
  const topVal = marginOffset + heightOffset;

  console.log("leftVal:", leftTargetRect.width)
  console.log("TOPVAL", topVal)
  // Apply the positioning
  floatingImage.value.style.left = leftTargetRect.width - offsetByAwardIcon + 'px';
  // floatingImage.value.style.top = topVal + 'px';
  floatingImage.value.style.bottom = -heightOffset - 5 + 'px';
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
        Strawberry
        <span class="small-text">
          with Mint and Pepper Jam
        </span>
      </h2>
    </div>
    <div class="middle-section">

      <img ref="floatingImage" src="@/assets/landing/sections/fruit-group.png" class="product-image"/>

      <div class="text">
        <span ref="rightTarget" class="large lt-1 no-break">
          A bold twist on <b>classic sweetness</b>
        </span>
        <p>
          Dolopia's Strawberry with Mint and Pepper Jam blends ripe 
          <br/>
          strawberries with fresh mint and a subtle hint of pepper, creating a 
          <br/>
          vibrant balance of sweet, fresh, and spicy notes. Perfect on its own 
          <br/>
          or paired with cheeses, it's equally delicious as a regular jam or a 
          <br/>
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
        Part of our Fruit Project, this jam joins a family of unique creations like fine cut lemon marmalade with extra
        <br/>
        virgin olive oil and luscious candied cherries with bitter almonds – all made without colours, colour stabilizers,
        <br/>
        or any other additives. Clean label, pure taste.
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
      font-size: clamp(3rem, 6vw, 6rem); // 48px → 96px
      line-height: 1.1;
      font-style: normal;
      font-weight: 700;
      letter-spacing: 6px;
      // New media query for laptop screens with limited height
      @media(min-width: 1400px) and (max-height: 800px){
        font-size: clamp(2.1rem, 4.2vw, 4.2rem); // 30% reduction from original
        line-height: clamp(2.1rem, 4.2vw, 4.2rem);
        letter-spacing: 4px;
        .small-text{
          font-size: clamp(0.875rem, 1.75vw, 1.75rem); // 30% reduction
          line-height: clamp(0.875rem, 1.75vw, 1.75rem);
        }
      }
      .small-text {
        color: #FFF;
        text-align: right;
        font-family: "Century Gothic";
        font-size: clamp(1.25rem, 2.5vw, 2.5rem); // 20px → 40px
        line-height: clamp(1.25rem, 2.5vw, 2.5rem);
        font-style: normal;
        font-weight: 700;
      }
    }
  }

  .middle-section {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 30px;;
    width: 100%;
    // height: 45%;
    position: relative;
    overflow: visible;

    .product-image {
      width: 27vw;
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
        font-style: normal;
        font-weight: 400;
        letter-spacing: 0.9px;
        display: flex;
        flex-direction: column;
        &.lt-1{
          font-size: clamp(1.5rem, 2.25vw, 2.25rem);
          line-height: 1.25;
          b{
            font-size: clamp(1.5rem, 2.25vw, 2.25rem);
            line-height: 1.25;
          }
        };
        &.lt-2{
          font-size: clamp(2rem, 3vw, 3rem);
          line-height: clamp(2rem, 3vw, 3rem);
          b{
            font-size: clamp(2.2rem, 3.125vw, 3.125rem); // 50px
            line-height: clamp(2.2rem, 3.125vw, 3.125rem);
          }
        };
        &.no-break{
          display: inline;
        }
        
        // New media query for laptop screens with limited height
        @media(min-width: 1400px) and (max-height: 800px){
          &.lt-1{
            font-size: clamp(1.05rem, 1.875vw, 1.575rem); // 30% reduction
            b{
              font-size: clamp(1.05rem, 1.875vw, 1.575rem);
            }
          }
          &.lt-2{
            font-size: clamp(1.4rem, 2.1vw, 2.1rem); // 30% reduction
            line-height: clamp(1.4rem, 2.1vw, 2.1rem);
            b{
              font-size: clamp(1.54rem, 2.188vw, 2.188rem); // 30% reduction
              line-height: clamp(1.54rem, 2.188vw, 2.188rem);
            }
          }
          letter-spacing: 0.6px;
        }
        
        b {
          color: #039EA2;
          font-family: "Century Gothic";
          font-size: clamp(1.5rem, 2.5vw, 2.5rem);
          line-height: clamp(1.5rem, 2.5vw, 2.5rem);
          font-style: normal;
          font-weight: 700;
          letter-spacing: 0.8px;
          
          // New media query for laptop screens with limited height
          @media(min-width: 1400px) and (max-height: 800px){
            font-size: clamp(1.05rem, 1.75vw, 1.75rem); // 30% reduction
            line-height: clamp(1.05rem, 1.75vw, 1.75rem);
            letter-spacing: 0.56px;
          }
        }
        @media(max-width: 1600px) and (min-width: 1366px) and (max-height: 900px){
          .large{
            &.lt-1{
              font-size: 36px;
              b{
                
              }
            }
            &.lt-2{
              font-size: 50px;
              b{

              }
            }
            font-size: 64px;
            line-height: 64px;
          }
          .small-text{
            font-size: 30px;
            line-height: 30px;
          }
        }
      }

      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(1rem, 1.5vw, 1.25rem);
        line-height: 1.5;
        font-style: normal;
        font-weight: 400;
        margin-bottom: 50px;
        
        // New media query for laptop screens with limited height
        @media(min-width: 1400px) and (max-height: 800px){
          font-size: clamp(0.7rem, 1.05vw, 0.875rem); // 30% reduction
          margin-bottom: 35px; // 30% reduction
        }
        
        @media(max-width: 1366px){
          margin-bottom: 25px;
          font-size: 12px;
        }
      }
    }
  }

  .bottom-section {
    width: 100%;
    
    // New media query for laptop screens with limited height
    @media(min-width: 1400px) and (max-height: 800px){
      margin-top: -15px; // Reduce spacing to save vertical space
    }
    
    p {
      color: #000;
      font-family: "Raleway";
      font-size: clamp(1rem, 1.25vw, 1.25rem);
      line-height: 1.5;
      
      // New media query for laptop screens with limited height
      @media(min-width: 1400px) and (max-height: 800px){
        font-size: clamp(0.7rem, 0.875vw, 0.875rem); // 30% reduction
      }
      
      @media(max-width: 1366px){
        font-size: 12px;
      }
      font-style: normal;
      font-weight: 400;
    }
  }
}
</style>