<script setup>
import dolopiaDLogo from "@/assets/about/d-logo.png";
import dolopiaLogo from "@/assets/about/dolopia.png";
import ScrollIndicator from "../ScrollIndicator.vue";
import { ref, watch, onMounted, onUnmounted, inject } from "vue";

const { isMobile } = inject("screenSize");

const props = defineProps({
  phaseId: {
    type: Number,
    required: true,
    default: 0,
  },
});

const phases = [{ label: "Logo" }, { label: "Introduction" }, { label: "Selections" }];

const animateInText = ref(false);

watch(
  () => props.phaseId,
  (newPhaseId) => {
    console.log("Got phaseId INTRO", newPhaseId);

    // Reset text animation
    animateInText.value = false;

    if (newPhaseId === 1) {
      setTimeout(() => {
        animateInText.value = true;
      }, 300);
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log("onmounted intro");
});

onUnmounted(() => {});
</script>

<template>
  <div class="phase-container phase">
    <!-- Phase 0 - Logo -->
    <Transition name="slide-up">
      <div v-if="phaseId === 0" class="phase phase-0" key="phase-0">
        <img :src="dolopiaDLogo" v-if="isMobile" class="d-logo" alt="Dolopia Logo" />
        <img :src="dolopiaLogo" class="logo" alt="Dolopia Logotype" />
      </div>

      <!-- Phase 1 - Introduction -->
      <div v-else-if="phaseId === 1" class="phase phase-1" key="phase-1">
        <section class="text-container">
          <span class="text-row first-row large-text">Where we craft</span>
          <span class="text-row second-row large-text">high-quality, artisanal </span>
          <div class="third-row">
            <h2 class="large-text">food products</h2>
            <p class="small-text" :class="{ 'animate-in': animateInText }">
              bringing vibrant flavors<br v-if="!isMobile" />
              from Greece and <br v-if="isMobile" />beyond to<br v-if="!isMobile" />
              kitchens around the world.
            </p>
          </div>
        </section>
      </div>

      <!-- Phase 2 - Culinary Selections -->
      <div v-else-if="phaseId === 2" class="phase phase-2" key="phase-2">
        <section class="hero-section" aria-labelledby="main-heading">
          <div class="container">
            <div class="content-wrapper">
              <div class="hero-content">
                <h3 class="section-label">Our Culinary Selections</h3>
                <h2 id="main-heading" class="main-heading">
                  We specialize in four distinct categories
                </h2>
                
                <p v-if="isMobile" class="highlight-text">
                  Each selection highlighting our <br />
                  commitment to fresh, locally <br />
                  sourced ingredients and traditional <br />
                  craftsmanship.
                </p>
                <p class="description">
                  In addition to refining our existing offerings, we are excited to
                  explore new categories and develop innovative recipes that reflect our
                  commitment to culinary excellence.
                </p>
                
              </div>
              <div class="hero-content">
                <p v-if="!isMobile" class="highlight-text">
                  Each selection highlighting our <br />
                  commitment to fresh, locally <br />
                  sourced ingredients and traditional <br />
                  craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Transition>

    <ScrollIndicator :phaseId="props.phaseId" :disappearAtPhaseId="1" />
  </div>
</template>

<style lang="scss" scoped>
.phase-container {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #8ac3c7;
}

.phase {
  background-color: #8ac3c7;
  display: flex;
  flex-grow: 1;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

// Phase 0 - Logo
.phase-0 {
  .logo {
    max-width: 300px;
    height: auto;
    filter: brightness(0) invert(1);
  }
  @media (max-width: 450px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .d-logo {
      margin-bottom: 30px;
      max-width: 200px;
    }
    .logo {
      max-width: 200px;
    }
  }
}

// Phase 1 - Text Introduction
.phase-1 {
  .text-container {
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: fit-content;
    margin: 0 auto;
  }

  .large-text {
    display: flex;
    color: #fff;
    font-family: "Kugile", serif;
    font-size: clamp(2.5rem, 5vw, 60px);
    font-style: normal;
    font-weight: 400;
    line-height: 90px;
    letter-spacing: 3px;
    margin-bottom: 0.2em;
  }

  .first-row {
    align-self: flex-end;
  }

  .third-row {
    display: flex;
    align-items: flex-start;
    margin-top: 1rem;

    h2 {
      margin: 0;
    }

    .small-text {
      color: #fff;
      font-family: "Belleza", serif;
      font-size: clamp(1.2rem, 2vw, 24px);
      font-style: normal;
      font-weight: 400;
      line-height: 35px;
      letter-spacing: 1.28px;
      max-width: 20vw;
      display: flex;
      margin-left: 10px;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s 0.5s ease;

      &.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
  @media (max-width: 450px) {
    .text-container {
      align-items: center;
    }
    .large-text {
      color: #fff;
      text-align: center;
      font-family: "Kugile";
      font-size: 29px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.2;
      letter-spacing: 1.16px;
      margin-bottom: 5px;
    }
    .first-row {
      align-self: center;
    }
    .third-row {
      margin-top: 5px;
      flex-direction: column;
      align-items: center;
      text-align: center;
      .small-text {
        color: #fff;
        text-align: center;
        font-family: Belleza;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.25;
        letter-spacing: 0.64px;
        margin-left: 0;
        margin-top: 1rem;
        max-width: 90vw;
      }
    }
  }
}

// Phase 2 - Culinary Selections
.phase-2 {
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 2rem;
    width: 100%;

    .container {
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      height: 60vh;
    }

    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      height: 100%;
    }

    .hero-content {
      color: white;
      height: 100%;
      display: flex;
      flex-direction: column;
      // align-items: center;
      justify-content: space-around;
    }

    .section-label {
      color: #fff;
      font-family: "Century Gothic";
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.2; /* 120% */
      letter-spacing: 0.8px;
      text-transform: uppercase;
      @media (max-width: 1600px) and (max-height: 900px) {
        font-size: 14px;
      }
    }

    .main-heading {
      color: #fff;
      font-family: "Kugile";
      font-size: 75px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.2; /* 120% */
      @media (max-width: 1600px) and (max-height: 900px) {
        font-size: 60px;
      }
    }

    .description {
      color: #fff;
      font-family: "Belleza";
      font-size: 27px;
      font-style: normal;
      font-weight: 400;
      line-height: 1; /* 100% */
      letter-spacing: 1.08px;
      @media (max-width: 1600px) and (max-height: 900px) {
        font-size: 20px;
      }
    }

    .highlight-text {
      color: #fff;
      font-family: "Belleza";
      font-size: 27px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.1; /* 111.111% */
      letter-spacing: 1.08px;
      @media (max-width: 1600px) and (max-height: 900px) {
        font-size: 20px;
      }
    }
  }
  @media (max-width: 450px) {
    .content-wrapper {
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      gap: 0 !important;
    }
    .hero-content{
     justify-content: flex-start !important;   
    }
    .section-label {
      color: #fff;
      text-align: center;
      font-family: "Century Gothic";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 150; /* 150% */
      letter-spacing: 0.64px;
      text-transform: uppercase;
      margin-bottom: 40px;
    }
    .main-heading {
      color: #fff;
      text-align: center;
      font-family: "Kugile";
      font-size: 36px !important;
      font-style: normal;
      font-weight: 400;
      line-height: 1.25; /* 125% */
      letter-spacing: 1.44px;
      margin-bottom: 40px;
    }
    .description,
    .highlight-text {
      color: #fff;
      text-align: center;
      font-family: "Belleza";
      font-size: 16px !important;
      font-style: normal;
      font-weight: 400;
      line-height: 1.25; /* 125% */
      letter-spacing: 0.64px;
      margin-bottom: 15px;
    }
  }
}

// @media (max-width: 768px) {
//   .phase-1 {
//     .third-row {
//       flex-direction: column;
//       align-items: center;
//       text-align: center;

//       .small-text {
//         margin-left: 0;
//         margin-top: 1rem;
//         max-width: 90vw;
//       }
//     }
//   }

//   .phase-2 {
//     .hero-section {
//       padding: 1rem;

//       .content-wrapper {
//         grid-template-columns: 1fr;
//         gap: 2rem;
//         text-align: center;
//       }
//     }
//   }

//   .phase-controls {
//     bottom: 1rem;
//     flex-wrap: wrap;
//     max-width: 90%;

//     .phase-btn {
//       font-size: 0.8rem;
//       padding: 0.4rem 0.8rem;
//     }
//   }
// }

/* introduction__fade-in-up */
.introduction__fade-in-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.introduction__fade-in-up-enter-active {
  transition: all 0.5s ease;
}
.introduction__fade-in-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.introduction__fade-in-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.introduction__fade-in-up-leave-active {
  transition: all 0.5s ease;
}
.introduction__fade-in-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  transform: translateY(100vh);
}
.slide-up-enter-to {
  transform: translateY(0);
}
.slide-up-leave-from {
  transform: translateY(0);
}
.slide-up-leave-to {
  transform: translateY(-100vh);
}
</style>
