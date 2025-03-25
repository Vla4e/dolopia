<script setup>
import { ref, computed } from "vue";

import dolopiaLogo from "@/assets/about/dolopia.png"
import howItStarted from "@/assets/about/how-it-started-resized.jpg"
import advantageImage from "@/assets/about/advantage.jpg"

import AboutProjects from "@/components/AboutPage/AboutProjects.vue";
import VideoShowcase from "@/components/AboutPage/VideoShowcase.vue";

let phaseId = ref(0)
let phaseCount = 13
function cyclePhase(direction){
  console.log("before cycle", phaseId.value)
  if(direction){
    if(phaseId.value < phaseCount - 1){ //end of phases, jump back to first phase
      phaseId.value ++
    } else {
      phaseId.value = 0;
    }
  } else phaseId.value --
  console.log("after cycle", phaseId.value)
}


let thirdRowVisible = ref(false)
let animatePhase7Text = ref(false)

let currentTransition = computed(() => {
  // That gets the "fade-in-up" transition.
  if (phaseId.value === 1) {
    setTimeout(() => {
      thirdRowVisible.value = true;
    }, 500);
    return 'fade-in-up';
  }

  //
  if (phaseId.value >= 2) {
    if(phaseId.value === 7){
      setTimeout(() => {
        animatePhase7Text.value = true
      }, 500)
    }
    return 'slide-up';
  }

  // For phase 0 (initial load) or any other cases, 
  // you can either return an empty string or a default transition:
  return '';
})


</script>

<template>
  <div class="about-container" :class="`about-${phaseId}`">
  <TransitionGroup :name="currentTransition">
      <!-- Phase 0 -->
      <div v-if="phaseId === 0" class="phase phase-0"  key="phase-0">
        <img :src="dolopiaLogo" class="logo" alt="Logo"/>
      </div>

      <!-- Phase 1 -->
      <div v-else-if="phaseId === 1" class="phase phase-1" key="phase-1">
        <div class="text-container">
          <span class="text-row first-row large-text">Where we craft</span>
          <span class="text-row second-row large-text">high-quality, artisanal </span>
          <span class="third-row" >
            <span class="large-text">food products</span>
            <span class="small-text" :class="{'animate-in': thirdRowVisible}">Bringing vibrant flavors from Greece and beyond to kitchens around the world.</span>
          </span>
        </div>
      </div>

      <!-- Phase 2 -->
      <div v-else-if="phaseId === 2" class="phase phase-2" key="phase-2">
        <p>Our offerings span four main categories, each reflecting our commitment to using fresh, locally sourced ingredients and traditional methods</p>
      </div>

      <!-- Phase 3 - 6 -->
      <div v-else-if="phaseId === 3" class="phase phase-3" key="phase-3">
        <AboutProjects :project="'pasta'"/>
      </div>
      <div v-else-if="phaseId === 4" class="phase phase-4" key="phase-4">
        <AboutProjects :project="'tomato'"/>
      </div>
      <div v-else-if="phaseId === 5" class="phase phase-5" key="phase-5">
        <AboutProjects :project="'vegetable'"/>
      </div>
      <div v-else-if="phaseId === 6" class="phase phase-6" key="phase-6">
        <AboutProjects :project="'fruit'"/>
      </div>

      <!-- Phase 7 -->
      <div v-else-if="phaseId === 7" class="phase phase-7" key="phase-7">
        <img :src="howItStarted" class="background" alt="Background"/>
        <h2 :class="{'animate-in': animatePhase7Text}">How It All Started</h2>
      </div>

      <!-- Phase 8 -->
      <div v-else-if="phaseId === 8" class="phase phase-8" key="phase-8">
        <!-- VIDEO 1 - text -->
        <!-- text - VIDEO 2 -->
        <VideoShowcase :key="'passion'" side="left" sectionId="passion"/>
        <VideoShowcase :key="'quality'" side="right" sectionId="quality"/>
      </div>

      <!-- Phase 9 -->
      <div v-else-if="phaseId === 9" class="phase phase-9" key="phase-9">
        <div class="image-container">
          <img :src="advantageImage" class="logo" alt="Logo"/>
        </div>
        <div class="text-container">
          <h2>The Dolopia Advantage</h2>
          <p>commitment to quality, authenticity and flavor</p>
        </div>
      </div>

      <!-- Phase 10 -->
      <div v-else-if="phaseId === 10" class="phase phase-10" key="phase-10">
        <!-- VIDEO 1 - text -->
        <!-- text - VIDEO 2 -->
        <VideoShowcase :key="'artisanal'" side="left" sectionId="artisanal"/>
        <VideoShowcase :key="'essence'" side="right" :isPlaceholder="true" sectionId="essence"/>
      </div>

      <!-- Phase 11 -->
      <div v-else-if="phaseId === 11" class="phase phase-11" key="phase-11">
        <h2>
          we cater to delis,
          <br/>restaurants,
          <br/>and supermarkets 
        </h2>
        <p>with a dedicated deli section, focusing on businesses that prioritize quality over price. Our products are designed for establishments seeking to offer their customers authentic, artisanal flavors, enhancing their culinary offerings with high-quality, handcrafted ingredients. Whether it’s a local deli looking to provide unique, flavorful options or a restaurant wanting to elevate their menu with genuine Mediterranean tastes, we partner with those who share our commitment to excellence in every bite.</p>
      </div>

      <!-- Phase 12 -->
      <div v-else-if="phaseId === 12" class="phase phase-12" key="phase-12">
        <h2> Our goal is to not only preserve the rich culinary heritage of Greece but to elevate it, making it accessible to food lovers around the globe</h2>
        <div class="text-container">
          <p>At Dolopia Savour Creations, we believe in the power of continuous improvement. Our passion for high-quality, authentic flavors drives us to refine our methods and enhance our products constantly. We are dedicated to sourcing the finest ingredients and employing innovative techniques to ensure that every product we create meets our high standards for taste and quality.</p>
          <p>In addition to refining our existing offerings, we are excited to explore new categories and develop innovative recipes that reflect our commitment to culinary excellence. Our team is already hard at work experimenting with new flavors and ingredients, ensuring that we remain at the forefront of the artisanal food movement. As we continue to grow, our mission remains the same: to bring the best of Greek and Mediterranean cuisine to your table, enriching your culinary experiences with every product we offer.</p>
        </div>
      </div>
  </TransitionGroup>
  </div>
  <div class="controls">
    <button @click="cyclePhase(0)">PREV</button>
    {{phaseId}}
    <button @click="cyclePhase(1)">NEXT!</button>
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
  position: relative;
  overflow: hidden;
  .phase{
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    // Phase 0 phase-0  
    &-0{
      background-color: #8AC3C7;
      justify-content: center;
      align-items: center;
      img{
        max-width: 30%;
      }
    }

    // Phase 1 phase-1
    &-1{
      background-color: #8AC3C7;
      justify-content: center;
      align-items: center;
      .text-container{
        max-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Left-aligns items by default */
        width: fit-content; /* Adjusts container width to content */
        margin: 0 auto; /* Centers the text-container horizontally */
      }
      
      .large-text{
        display: flex;
        color: #FFF;
        font-family: "Kugile";
        font-size: 60px;
        font-style: normal;
        font-weight: 400;
        line-height: 90px; /* 120% */
        letter-spacing: 3px;
      }
      .first-row{
        align-self: flex-end;
      }
      .third-row {
        display: flex;
        .small-text {
          color: #FFF;
          font-family: "Belleza";
          font-size: 24px;
          font-style: normal;
          font-weight: 400;
          line-height: 35px; /* 109.375% */
          letter-spacing: 1.28px;
          max-width: 20vw;
          display: flex;
          margin-left: 10px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s 0.5s ease;
          &.animate-in{
            opacity: 1;
            transform: translateY(0);
          }
        }
      }

    }

    // Phase 2
    &-2{
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #E6F6F6;
      p{
        color: #000;
        font-family: "Belleza";
        font-size: 30px;
        font-style: normal;
        font-weight: 400;
        line-height: 110%; /* 110% */
        letter-spacing: 2px;
        text-transform: capitalize;
        max-width: 75%;
      }
    }

    // Phase 3 - 6
    &-3, &-4, &-5, &-6{
      background-color: white;
    }

    // Phase 7
    &-7{
      background-color: white;
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
        opacity: 0;
        transform: translate(-50%, -100%);
        transition: opacity 3s 0.2s ease, transform 0.5s ease;
        &.animate-in{
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
    }

    // Phase 8
    &-8{
      background-color: #E6F6F6;
      flex-direction: column;
      overflow: scroll;
      padding-top: 15vh;
      padding-left: 2vw;
      padding-right: 2vw;
      .video-showcase:last-child{
        margin-top: 10vh;
      }
    }

    // Phase 9
    &-9{
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
        top: 55%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        min-width: 85%;
      }
      h2{
        color: #FFF;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        font-family: "Belleza";
        font-size: 75px;
        font-style: normal;
        font-weight: 400;
        // line-height: 24px; /* 32% */
        letter-spacing: 3px;
        text-align: center;
      }
      p{
        color: #FFF;
        text-align: right;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        font-family: "Kugile";
        font-size: 40px;
        font-style: normal;
        font-weight: 400;
        // line-height: 55px; /* 110% */
        text-align: center;
      }
    }

    // Phase 10
    &-10{
      background-color: #E6F6F6;
      flex-direction: column;
      overflow: scroll;
      padding-top: 15vh;
      .video-showcase:last-child{
        margin-top: 10vh;
      }
    }

    // Phase 11
    &-11{
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

    // Phase 12
    &-12{
      background-color: #FFF;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h2{
        margin-top: 15vh;
        margin-bottom: 20px;
        color: #8AC3C7;
        text-align: center;
        font-family: "Kugile";
        font-size: 45px;
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
          font-family: "Raleway";
          font-size: 12px;
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


// Transitions

/* fade-in-up */
.fade-in-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-in-up-enter-active {
  transition: all 0.5s ease;
}
.fade-in-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-in-up-leave-active {
  transition: all 0.5s ease;
}
.fade-in-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Slide-up transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.5s ease;
}

/* New element (entering) starts below view and slides up to 0 */
.slide-up-enter-from {
  transform: translateY(100vh);
}
.slide-up-enter-to {
  transform: translateY(0);
}

/* Old element (leaving) starts at 0 and slides up off screen */
.slide-up-leave-from {
  transform: translateY(0);
}
.slide-up-leave-to {
  transform: translateY(-100vh);
}
</style>
