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
  const containerRect = container.value.getBoundingClientRect();
  const topTargetRect = topTarget.value.getBoundingClientRect();
  const rightTargetRect = rightTarget.value.getBoundingClientRect();
  const topSectionRect = topSection.value.getBoundingClientRect();
  // console.log("TSR", topSection.value.offsetTop)
  // Calculate positions relative to the container
  const containerLeft = containerRect.left;
  const containerTop = containerRect.top;
  // console.log("Container left / top / height / width", containerLeft,"/", containerTop, "/", containerRect.height, "/", containerRect.width)
  // console.log("Right target left / top / height / width", rightTargetRect.left,"/", rightTargetRect.top, "/", rightTargetRect.height, "/", rightTargetRect.width)
  // console.log("Top target left / top / height / width", topTargetRect.left,"/", topTargetRect.top, "/", topTargetRect.height, "/", topTargetRect.width)
  // C's right edge should align with B's left edge
  // So C's left position = B's left - C's width
  const offsetInVW = 0;
  const offsetManual = 0;
  const offsetFinal = offsetInVW - offsetManual
  const offsetInPixels = (offsetFinal * window.innerWidth) / 100;
  const rightVal = rightTargetRect.width - offsetInPixels;

  const marginOffset = 50;
  const heightOffset = 30 * topTargetRect.height / 100;
  // const topVal = topTargetRect.height + topSection.value.offsetTop;
  const topVal = -topTargetRect.height - marginOffset;
  // console.log("RIGHTVAL:", rightVal)
  // console.log("TOPVAL", topVal)
  // Apply the positioning
  floatingImage.value.style.right = rightVal + 'px';
  // floatingImage.value.style.top = topVal + 'px';
  floatingImage.value.style.top = topVal + 'px';
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
        Two-Coloured
        <span class="small-text">
          Seafood Orzo
        </span>
      </h2>
    </div>
    <div class="middle-section">
      <img ref="floatingImage" src="@/assets/landing/sections/pasta-group.png" class="product-image"/>

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
  margin-left: auto;
  margin-right: auto;
  height: 100vh;
  justify-content: center;
  align-items: center;
  color: black;
  position: relative;
  @media(max-width: 1366px){
    width: 70%;
  }
  
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
      text-align: left;
      font-family: "Century Gothic";
      font-size: clamp(1.5rem, 2.5vw, 3rem);
      line-height: clamp(1.5rem, 2.5vw, 3rem);
      font-style: normal;
      font-weight: 700;
      letter-spacing: 6px;
      width: 65%;
      
      // New media query for laptop screens with limited height
      @media(min-width: 1400px) and (max-height: 800px){
        font-size: clamp(1.05rem, 1.75vw, 2.1rem); // 30% reduction
        line-height: clamp(1.05rem, 1.75vw, 2.1rem);
        letter-spacing: 4.2px;
        .small-text{
          font-size: clamp(2.1rem, 3.5vw, 4.2rem); // 30% reduction
          line-height: clamp(2.1rem, 3.5vw, 4.2rem);
        }
      }
      
      .small-text {
        color: #FFF;
        text-align: left;
        font-family: "Century Gothic";
        font-size: clamp(3rem, 5vw, 6rem);
        line-height: clamp(3rem, 5vw, 6rem);
        font-style: normal;
        font-weight: 700;
      }
    }
  }

  .middle-section {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    margin-bottom: 30px;
    width: 100%;
    // height: 45%;
    position: relative;
    overflow: visible;

    .product-image {
      width: 24vw;
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
      // margin-right: 40px;
      width: 65%;
      align-items: flex-start;
      .large {
        color: #039EA2;
        font-family: "Century Gothic";
        font-size: clamp(1.75rem, 3vw, 2.8rem);
        line-height: clamp(1.75rem, 3vw, 2.8rem);
        font-style: normal;
        font-weight: 400;
        letter-spacing: 0.9px;
        display: flex;
        flex-direction: column;
        
        // New media query for laptop screens with limited height
        @media(min-width: 1400px) and (max-height: 800px){
          font-size: clamp(1.225rem, 2.1vw, 1.96rem); // 30% reduction
          line-height: clamp(1.225rem, 2.1vw, 1.96rem);
          letter-spacing: 0.63px;
          b {
            font-size: clamp(1.05rem, 1.75vw, 1.75rem); // 30% reduction
            line-height: clamp(1.05rem, 1.75vw, 1.75rem);
            letter-spacing: 0.56px;
          }
        }
        
        b {
          color: #039EA2;
          font-family: "Century Gothic";
          font-size: clamp(1.5rem, 2.5vw, 2.5rem);
          line-height: clamp(1.5rem, 2.5vw, 2.5rem);
          font-style: normal;
          font-weight: 700;
          letter-spacing: 0.8px;
        }
      }

      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1.5vw, 1.25rem);
        line-height: clamp(18px, 1.5vw, 1.25rem);
        font-style: normal;
        font-weight: 400;
        
        // New media query for laptop screens with limited height
        @media(min-width: 1400px) and (max-height: 800px){
          font-size: clamp(8.4px, 1.05vw, 0.875rem); // 30% reduction
          line-height: clamp(12.6px, 1.05vw, 0.875rem); // 30% reduction
        }
        
        @media(max-width: 1366px){
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }

  .bottom-section {
    // New media query for laptop screens with limited height
    @media(min-width: 1400px) and (max-height: 800px){
      margin-top: -15px; // Reduce spacing to save vertical space
    }
    
    p {
      color: #000;
      font-family: "Raleway";
      font-size: clamp(12px, 1.2vw, 1.25rem);
      line-height: clamp(18px, 1.2vw, 1.25rem);
      font-style: normal;
      font-weight: 400;
      
      // New media query for laptop screens with limited height
      @media(min-width: 1400px) and (max-height: 800px){
        font-size: clamp(8.4px, 1vw, 0.875rem); // 30% reduction
        line-height: clamp(12.6px, 1vw, 0.875rem); // 30% reduction
      }
    }
  }
}
</style>