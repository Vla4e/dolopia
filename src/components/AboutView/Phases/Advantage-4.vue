<script setup>
import VideoShowcase from "../VideoShowcase.vue";
import advantageImage from "@/assets/about/advantage.jpg";
import { watch, ref } from "vue";
import { useWithinPhaseScroll } from "@/composables/useWithinPhaseScroll";

const animateInText = ref(false);

const props = defineProps({
  phaseId: {
    type: Number,
    required: true,
  },
});

// Initialize the phase scroll composable
const {
  isAtTop,
  isAtBottom,
  hasTouchedTop,
  hasTouchedBottom,
  initializeScrollablePhase,
  initializeStaticPhase,
} = useWithinPhaseScroll({
  containerSelector: ".phase-10",
  scrollThreshold: 5,
  onPhaseEnter: (context) => {
    console.log("Phase scroll initialized:", context);
  },
  onPhaseExit: () => {
    console.log("Phase scroll cleaned up");
  },
});

watch(
  () => props.phaseId,
  async (newPhaseId) => {
    console.log("Got phaseId ADVANTAGE", newPhaseId);

    // Reset text animation
    animateInText.value = false;

    if (newPhaseId === 9) {
      // Static phase - just enable normal phase cycling
      initializeStaticPhase();

      setTimeout(() => {
        animateInText.value = true;
      }, 300);
    }

    if (newPhaseId === 10) {
      // Scrollable phase - set up internal scrolling with boundary detection
      await initializeScrollablePhase();
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- Phase 9 -->
  <div class="phase-container">
    <Transition name="slide-up-reusable">
      <section v-if="phaseId === 9" class="phase phase-9" key="phase-9">
        <div class="image-container">
          <img :src="advantageImage" class="logo" alt="Logo" />
        </div>
        <div :class="{ 'animate-in': animateInText }" class="hero-text-container">
          <h2>The Dolopia Advantage</h2>
          <p>commitment to quality, authenticity and flavor</p>
        </div>
      </section>

      <!-- Phase 10 -->
      <section v-else-if="phaseId === 10" class="phase phase-10" key="phase-10">
        <VideoShowcase :key="'artisanal'" side="left" sectionId="artisanal" />
        <VideoShowcase :key="'essence'" side="right" sectionId="essence" />

        <section class="culinary">
          <div class="hero-section">
            <div class="content-wrapper">
              <div class="hero-content">
                <h3 class="section-label">Crafted for Culinary Professionals</h3>

                <div class="row">
                  <h2 id="main-heading" class="main-heading">
                    Serving delis<br />
                    &amp; restaurants<br />
                    with quality
                  </h2>

                  <div class="right">
                    <p class="highlight-text">
                      With a dedicated deli section, focusing on<br/>
                      businesses that prioritize quality over<br/>
                      price. Our products are designed for<br/>
                      establishments seeking to offer their<br/>
                      customers authentic, artisanal flavors,<br/>
                      enhancing their culinary offerings with<br/>
                      high-quality, handcrafted ingredients.  
                    </p>
                  </div>
                </div>

                <p class="description">
                  Whether it’s a local deli looking to provide unique,<br/>
                  flavorful options or a restaurant wanting to elevate<br/>
                  their menu with genuine Mediterranean tastes, we<br/>
                  partner with those who share our commitment to<br/>
                  excellence in every bite.
                </p>
              </div>
            </div>
          </div>
          <ArrowButton :routePath="'/projects'" :buttonText="'Explore'" />
        </section>

        <!-- Debug info - remove in production -->
        <div
          class="debug-info"
          style="
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            font-size: 12px;
          "
        >
          At Top: {{ isAtTop }}<br />
          At Bottom: {{ isAtBottom }}<br />
          Touched Top: {{ hasTouchedTop }}<br />
          Touched Bottom: {{ hasTouchedBottom }}
        </div>
      </section>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.phase-container{
  min-height: 100vh;
  width: 100vw;
  // position: relative;
  overflow: hidden;
}
.phase-9 {
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.phase-10 {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: #e6f6f6;
  flex-direction: column;
  padding-left: 2vw;
  padding-right: 2vw;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;

  .video-showcase {
    min-height: 100vh;
    &:last-child {
      margin-top: 2vh;
    }
  }

  .culinary {
    // position: absolute;
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 2rem 2rem 2rem;
      width: 100%;
      // margin-top: -5vh;
      .content-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 70%;
        width: 80%;
        margin: auto;
      }

      .hero-content {
        color: white;
        height: 100%;
        width: 80%;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: center;
        // width: 45%;
        .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5vh;
        }
      }

      .section-label {
        color: #039ea2;
        font-family: "Century Gothic";
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.2; /* 120% */
        letter-spacing: 0.8px;
        text-transform: uppercase;
        margin-bottom: 5vh;
        @media (max-width: 1600px) and (max-height: 900px) {
          font-size: 14px;
        }
      }

      .main-heading {
        color: #039ea2;
        font-family: "Kugile";
        font-size: 75px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.2; /* 120% */
        @media (max-width: 1600px) and (max-height: 900px) {
          font-size: 54px;
        }
      }

      p {
        color: #000;
        font-family: "Belleza";
        font-size: 22px;
        letter-spacing: 1px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.2; /* 100% */
        @media (max-width: 1600px) and (max-height: 900px) {
          font-size: 18px;
        }
      }
    }
    .arrow-button {
      position: absolute;
      bottom: 50px;
      right: 50px;
      z-index: 10;
      span {
        color: #000;
        font-family: "Century Gothic";
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 120% */
        letter-spacing: 0.8px;
        text-transform: capitalize;
      }
    }
  }
}

.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(217, 217, 217, 0) -14.3%,
      rgba(39, 39, 39, 0.7) 50.14%
    );
    pointer-events: none;
    z-index: 2;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.hero-text-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  top: 70%;
  left: 50%;
  opacity: 0;
  transform: translate(-50%, -100%);
  transition: opacity 3s 0.2s ease, transform 0.5s ease;
  z-index: 3;
  &.animate-in {
    opacity: 1;
    transform: translate(-50%, -50%);
  }

  h2 {
    color: #fff;
    text-align: center;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-family: "Belleza";
    font-size: 80px;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 3.2px;
    margin-bottom: 36px;
  }
  p {
    color: #fff;
    text-align: center;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-family: "Kugile";
    font-size: 50px;
    font-style: normal;
    font-weight: 400;
    line-height: 55px; /* 110% */
  }
}

/* slide-up-advantage transitions */
.slide-up-advantage-enter-active,
.slide-up-advantage-leave-active {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-advantage-enter-from {
  transform: translateY(100vh);
}
.slide-up-advantage-enter-to {
  transform: translateY(0);
}
.slide-up-advantage-leave-from {
  transform: translateY(0);
}
.slide-up-advantage-leave-to {
  transform: translateY(-100vh);
}
</style>
