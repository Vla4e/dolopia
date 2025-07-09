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
  const imageBottomOffset = 5 * floatingImage.value.height /100; //empty space in image from product to bottom
  floatingImage.value.style.marginBottom = (parseFloat(getComputedStyle(floatingImage.value).marginBottom) - imageBottomOffset) + 'px';

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
    </div>
    <div class="middle-section">
      <img @click="goToRoute('/projects/pasta-project/seafood-pasta/orzo-squid-ink')" ref="floatingImage" src="@/assets/landing/sections/pasta-group.png" class="product-image"/>
      <div class="texts-container">
        <h2 @click="goToRoute('/projects/pasta-project/seafood-pasta/orzo-squid-ink')" ref="topTarget" class="product-name">
          Two-Coloured
          <span class="small-text">
            Seafood Orzo
          </span>
        </h2>

        <div ref="rightTarget" class="text">
          <span class="large">
            Seafood elegance
            <b>Shaped into orzo</b>
          </span>
          <p>
            Dolopia’s Two-Coloured Seafood Orzo brings together two worlds: jet-black
            <br/>orzo with squid ink and golden orzo infused with shellfish essence. It’s a visual 
            <br/>and culinary ode to the Greek seaside, where simplicity meets bold taste.
            <br/>Part of our Pasta Project, this creation stands alongside traditional pastas
            <br/>made with goat or sheep milk, vibrant vegan blends with vegetables and
            <br/>spices, and other specialty shapes.
          </p>
          
          <span class="large">
            Where simplicity meets
            <b>Bold taste</b>
          </span>
        </div>
      </div>
    </div>
    <div class="bottom-section">
      <p>
        Every piece of pasta is air-dried slowly, never heat-treated – so the aromas stay locked inside. With no
        <br/>added salt and a naturally rough surface for sauces to cling to, it’s designed to carry flavor in every bite.
        <br/>Pair it with seafood, lemon zest, or just a touch of olive oil – and let it speak for itself.
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
  @media(max-width: 1366px){
    width: 70%;
  }

  .middle-section {
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px; // Reduced from 30px
    width: 100%;
    height: 50vh; // Reduced from 55vh
    position: relative;
    overflow: visible;

    .texts-container{
      width: 70%;
    }
    .product-image {
      max-height: 100%;
      height: 100%;
      object-fit: contain;
      max-width: 100%;
    }
    
    .product-name {
      display: flex;
      flex-direction: column;
      color: #FFF;
      text-align: left;
      font-family: "Century Gothic";
      // Reduced font size by ~20%
      font-size: clamp(1.2rem, 2vw, 2.4rem);
      line-height: clamp(1.2rem, 2vw, 2.4rem);
      font-style: normal;
      font-weight: 700;
      letter-spacing: 5px;
      width: 100%;
      
      @media(min-width: 1400px) and (max-height: 800px){
        font-size: clamp(0.9rem, 1.5vw, 1.8rem);
        line-height: clamp(0.9rem, 1.5vw, 1.8rem);
        letter-spacing: 4px;
        .small-text{
          font-size: clamp(1.8rem, 3vw, 3.6rem);
          line-height: clamp(1.8rem, 3vw, 3.6rem);
        }
      }
      
      .small-text {
        color: #FFF;
        text-align: left;
        font-family: "Century Gothic";
        // Reduced font size by ~20%
        font-size: clamp(2.4rem, 4vw, 4.8rem);
        line-height: clamp(2.4rem, 4vw, 4.8rem);
        font-style: normal;
        font-weight: 700;
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      row-gap: 10px; // Reduced from 12px
      width: 100%;
      align-items: flex-start;
      .large {
        color: #039EA2;
        font-family: "Century Gothic";
        // Reduced font size by ~15%
        font-size: clamp(1.5rem, 2.5vw, 2.4rem);
        line-height: clamp(1.5rem, 2.5vw, 2.4rem);
        font-style: normal;
        font-weight: 400;
        letter-spacing: 0.9px;
        display: flex;
        flex-direction: column;
        
        @media(min-width: 1400px) and (max-height: 800px){
          font-size: clamp(1rem, 1.8vw, 1.6rem);
          line-height: clamp(1rem, 1.8vw, 1.6rem);
          b {
            font-size: clamp(0.9rem, 1.5vw, 1.5rem);
            line-height: clamp(0.9rem, 1.5vw, 1.5rem);
          }
        }
        
        b {
          color: #039EA2;
          font-family: "Century Gothic";
          // Reduced font size by ~15%
          font-size: clamp(1.3rem, 2.1vw, 2.1rem);
          line-height: clamp(1.3rem, 2.1vw, 2.1rem);
          font-style: normal;
          font-weight: 700;
          letter-spacing: 0.8px;
        }
      }

      p {
        color: #000;
        font-family: "Raleway";
        // Reduced font size by ~15%
        font-size: clamp(12px, 1.2vw, 1rem);
        line-height: clamp(18px, 1.8vw, 1.4rem);
        font-style: normal;
        font-weight: 400;
        
        @media(min-width: 1400px) and (max-height: 800px){
          font-size: clamp(10px, 0.9vw, 0.7rem);
          line-height: clamp(14px, 1.2vw, 0.9rem);
        }
      }
    }
  }

  .bottom-section {
    @media(min-width: 1400px) and (max-height: 800px){
      margin-top: -10px;
    }
    
    p {
      color: #000;
      font-family: "Raleway";
      font-size: clamp(12px, 1vw, 1rem);
      line-height: clamp(18px, 1.5vw, 1.4rem);
      font-style: normal;
      font-weight: 400;
      
      @media(min-width: 1400px) and (max-height: 800px){
        font-size: clamp(10px, 0.8vw, 0.7rem);
        line-height: clamp(14px, 1.2vw, 0.9rem);
      }
    }
  }
}
</style>