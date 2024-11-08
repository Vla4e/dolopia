<script setup>
import { ref } from "vue";

import dolopiaLogo from "@/assets/about/dolopia.png"
import howItStarted from "@/assets/about/how-it-started.jpg"
import advantageImage from "@/assets/about/advantage.png"

import AboutProject from "@/components/AboutPage/AboutProject.vue";

function cyclePhase(direction){
  console.log("CYCLING")
  if(direction){
    phaseId.value ++
  } else phaseId.value --
}

let phaseId = ref(0)

</script>

<template>
  <div class="about-container" :class="`about-${phaseId}`">
    <!-- Phase 0 -->
    <div v-if="phaseId === 0" class="phase phase-0">
      <img :src="dolopiaLogo" class="logo" alt="Logo"/>
    </div>

    <!-- Phase 1 -->
    <div v-else-if="phaseId === 1" class="phase phase-1">
      <h2>where we craft <br/>high-quality, artisanal <br/>food products</h2>
      <span>bringing vibrant flavors from Greece and beyond to kitchens around the world.</span>
    </div>

    <!-- Phase 2 -->
    <div v-else-if="phaseId === 2" class="phase phase-2">
      <p>Our offerings span four main categories, each reflecting our commitment to using fresh, locally sourced ingredients and traditional methods</p>
    </div>

    <!-- Phase 3 -->
    <div v-else-if="phaseId === 3" class="phase phase-3">
      <AboutProject/>
      ABOUT
    </div>

    <!-- Phase 4 -->
    <div v-else-if="phaseId === 4" class="phase phase-4">
      <img :src="howItStarted" class="background" alt="Background"/>
      <h2>How It All Started</h2>
    </div>

    <!-- Phase 5 -->
    <div v-else-if="phaseId === 5" class="phase phase-5">
      <!-- VIDEO 1 - text -->
      <!-- text - VIDEO 2 -->
      VIDEO HERE
    </div>

    <!-- Phase 6 -->
    <div v-else-if="phaseId === 6" class="phase phase-6">
      <div class="image-container">
        <img :src="advantageImage" class="logo" alt="Logo"/>
      </div>
      <div class="text-container">
        <h2>The Dolopia Advantage</h2>
        <p>commitment to quality, authenticity and flavor</p>
      </div>
    </div>

    <!-- Phase 7 -->
    <div v-else-if="phaseId === 7" class="phase phase-7">
      <!-- VIDEO 1 - text -->
      <!-- text - VIDEO 2 -->
      VIDEO HERE
    </div>

    <!-- Phase 8 -->
    <div v-else-if="phaseId === 8" class="phase phase-8">
      <h2>
        we cater to delis,
        <br/>restaurants,
        <br/>and supermarkets 
      </h2>
      <p>with a dedicated deli section, focusing on businesses that prioritize quality over price. Our products are designed for establishments seeking to offer their customers authentic, artisanal flavors, enhancing their culinary offerings with high-quality, handcrafted ingredients. Whether it’s a local deli looking to provide unique, flavorful options or a restaurant wanting to elevate their menu with genuine Mediterranean tastes, we partner with those who share our commitment to excellence in every bite.</p>
    </div>

    <!-- Phase 9 -->
    <div v-else-if="phaseId === 9" class="phase phase-9">
      <h2> Our goal is to not only preserve the rich culinary heritage of Greece but to elevate it, making it accessible to food lovers around the globe</h2>
      <div class="text-container">
        <p>At Dolopia Savour Creations, we believe in the power of continuous improvement. Our passion for high-quality, authentic flavors drives us to refine our methods and enhance our products constantly. We are dedicated to sourcing the finest ingredients and employing innovative techniques to ensure that every product we create meets our high standards for taste and quality.</p>
        <p>In addition to refining our existing offerings, we are excited to explore new categories and develop innovative recipes that reflect our commitment to culinary excellence. Our team is already hard at work experimenting with new flavors and ingredients, ensuring that we remain at the forefront of the artisanal food movement. As we continue to grow, our mission remains the same: to bring the best of Greek and Mediterranean cuisine to your table, enriching your culinary experiences with every product we offer.</p>
      </div>
    </div>
  </div>
  <div class="controls">
    <button @click="cyclePhase(0)">PREV</button>
    <button @click="cyclePhase(1)">NEXT</button>
  </div>
</template>

<style lang="scss">
.controls{
  display: flex;
  position: fixed;
  z-index: 20000;
  bottom: 5%;
  left: 50%;
  width: 100px;
  height: 100px;
  background-color: #13131350;
  transform: translateX(-50%)
}
.about-container{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .phase{
    display: flex;
    width: 100%;
    height: 100%;
    // Phase 0
    &-0{
      background-color: #8AC3C7;
      justify-content: center;
      align-items: center;
      img{
        max-width: 30%;
      }
    }

    // Phase 1
    &-1{
      background-color: #8AC3C7;
      h2{
        color: #FFF;
        font-family: Kugile;
        font-size: 75px;
        font-style: normal;
        font-weight: 400;
        line-height: 90px; /* 120% */
        letter-spacing: 3px;
        text-transform: capitalize;
      }
      p{
        color: #FFF;
        font-family: Belleza;
        font-size: 32px;
        font-style: normal;
        font-weight: 400;
        line-height: 35px; /* 109.375% */
        letter-spacing: 1.28px;
        text-transform: capitalize;
      }
    }

    // Phase 2
    &-2{
      h2{
        color: #000;
        font-family: Belleza;
        font-size: 50px;
        font-style: normal;
        font-weight: 400;
        line-height: 55px; /* 110% */
        letter-spacing: 2px;
        text-transform: capitalize;
      }
    }

    // Phase 3
    &-3{

    }

    // Phase 4
    &-4{
      img{
        z-index: 2;
        width: 100%;
        height: 100%;
      }
      h2{
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #000;
        font-family: Belleza;
        font-size: 80px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 30% */
        letter-spacing: 3.2px;
        text-transform: capitalize;
        z-index: 3;
      }
    }

    // Phase 5
    &-5{

    }

    // Phase 6
    &-6{
      .image-container{
        width: 100%;
        height: 100%;
        position: relative;
        display: inline-block;
        display: block;
        width: 100%;
        height: auto;
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(217, 217, 217, 0.00) 0%, rgba(39, 39, 39, 0.70) 100%);
          pointer-events: none;
        }
      }
      // img{
      //   z-index: 2;
      //   opacity: 0.8%;
      // }
      .text-container{
        z-index: 3;
        position: absolute;
        top:65%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        min-width: 70%;
      }
      h2{
        color: #FFF;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        font-family: Belleza;
        font-size: 75px;
        font-style: normal;
        font-weight: 400;
        // line-height: 24px; /* 32% */
        letter-spacing: 3px;
        text-transform: capitalize;
        text-align: center;
      }
      p{
        color: #FFF;
        text-align: right;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        font-family: Kugile;
        font-size: 50px;
        font-style: normal;
        font-weight: 400;
        // line-height: 55px; /* 110% */
        text-transform: capitalize;
        text-align: center;
      }
    }

    // Phase 7
    &-7{

    }

    // Phase 8
    &-8{
      flex-direction: column;
      background-color: #E6F6F6;
      align-items: center;
      justify-content: center;
      h2{
        color: #000;
        text-align: right;
        font-family: Belleza;
        font-size: 75px;
        font-style: normal;
        font-weight: 400;
        line-height: 75px; /* 100% */
        letter-spacing: 3px;
        text-transform: capitalize;
        max-width: 60%;
        margin-bottom: 20px;
      }
      p{
        color: #000;
        text-align: center;
        font-family: Raleway;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
        letter-spacing: 0.64px;
        text-transform: capitalize;
        max-width: 60%;
      }
    }

    // Phase 9
    &-9{
      background-color: #FFF;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h2{
        color: #8AC3C7;
        text-align: center;
        font-family: Kugile;
        font-size: 60px;
        font-style: normal;
        font-weight: 400;
        line-height: 70px; /* 116.667% */
        letter-spacing: 2.4px;
        text-transform: capitalize;
        max-width: 80%;
      }
      .text-container{
        display: flex;
        width: 80%;
        justify-content: space-around;
        p{
          color: #000;
          text-align: center;
          font-family: Raleway;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px; /* 150% */
          letter-spacing: 0.64px;
          text-transform: capitalize;
          max-width: 40%;
        }
      }
    }
  }
}
@media (min-width: 1024px) {
  .about-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
