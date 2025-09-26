<script setup>
//PrivateLabel-6
import privateLabelHeroImage from "@/assets/about/mission/private-label.png";
import ArrowButton from "@/components/ArrowButton.vue";
import { ref, watch, onMounted, onUnmounted, inject } from "vue";
const { isMobile } = inject("screenSize");
const props = defineProps({
  phaseId: {
    type: Number,
    required: true,
    default: 0,
  },
});

const animateInText = ref(false);
watch(
  () => props.phaseId,
  (newPhaseId) => {
    console.log("Got phaseId MISSION", newPhaseId);

    // Reset text animation
    animateInText.value = false;

    // Handle phase-specific animations
    if (newPhaseId === 13) {
      setTimeout(() => {
        console.log("animating in text");
        animateInText.value = true;
      }, 300);
    } else if (newPhaseId === 14 && isMobile.value) {
      setTimeout(() => {
        console.log("animating in text");
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
  <div class="phase-container">
    <Transition name="slide-up-reusable">
      <section
        v-if="phaseId === 13 || (phaseId === 14 && isMobile)"
        class="phase phase-13"
        key="phase-13"
      >
        <div class="image-container">
          <img :src="privateLabelHeroImage" class="background" alt="Background" />
        </div>
        <div :class="{ 'animate-in': animateInText }" class="hero-text-container">
          <h2>Private label</h2>
          <p>
            Mediterranean products for your brand, <br />
            blending innovation and tradition
          </p>
        </div>
      </section>

      <section
        v-else-if="phaseId === 14 && !isMobile"
        class="phase phase-14"
        key="phase-14"
      >
        <div class="hero-section">
          <div class="content-wrapper">
            <div class="hero-content">
              <h3 class="section-label">Private Label by Dolopia</h3>

              <div class="row">
                <h2 id="main-heading" class="main-heading">
                  Tradition, Expertise,
                  <br />and Innovation in <br />Every Jar
                </h2>

                <div class="right">
                  <p class="highlight-text">
                    While the vision of making authentic
                    <br />Greek flavours accessible to food lovers <br />around the globe
                    comes to life through <br />Dolopia’s own product line, it extends far
                    <br />beyond. The same dedication, expertise, <br />and craftsmanship
                    are also offered to <br />selected partners through tailored
                    <br />Private Label solutions.
                  </p>
                </div>
              </div>

              <p class="description">
                Dolopia provides full-service Private Label production for businesses
                <br />looking to expand their offerings with high-quality, Mediterranean
                <br />-inspired creations. From adapting existing recipes to developing
                <br />entirely new product lines, every item reflects Dolopia’s commitment
                <br />to flavour, innovation, and authenticity. With a strong foundation
                in <br />food technology and artisanal methods, Dolopia becomes a reliable
                <br />partner for bringing Greek excellence to shelves around the world —
                <br />under another brand, yet with the same soul.
              </p>
            </div>
          </div>
        </div>
        <ArrowButton :routePath="'/projects'" :buttonText="'Explore'" />
      </section>

      <section
        v-else-if="phaseId === 15 && isMobile"
        class="phase phase-15-mobile"
        key="phase-15-mobile"
      >
        <div class="phase-content">
          <h3 class="section-label">Private Label by Dolopia</h3>

          <div class="row">
            <h2 id="main-heading" class="main-heading">
              Tradition, Expertise,
              <br />and Innovation in <br />Every Jar
            </h2>

            <div class="right">
              <p class="highlight-text">
                While the vision of making authentic
                <br />Greek flavours accessible to food lovers <br />around the globe
                comes to life through <br />Dolopia’s own product line, it extends far
                <br />beyond. The same dedication, expertise, <br />and craftsmanship are
                also offered to <br />selected partners through tailored <br />Private
                Label solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        v-else-if="phaseId === 16 && isMobile"
        class="phase phase-16-mobile"
        key="phase-16-mobile"
      >
        <div class="phase-content">
          <h3 class="section-label">Private Label by Dolopia</h3>

          <div class="row">
            <h2 id="main-heading" class="main-heading">
              Crafting flavour, empowering brands
            </h2>

            <div class="right">
              <p class="highlight-text">
                Dolopia provides full-service Private Label production for businesses
                looking to expand their offerings with high-quality,
                Mediterranean-inspired creations.
              </p>
            </div>
          </div>

          <p class="description">
            From adapting existing recipes to developing entirely new product lines, every
            item reflects Dolopia’s commitment to flavour, innovation, and authenticity.
            With a strong foundation in food technology and artisanal methods, Dolopia
            becomes a reliable partner for bringing Greek excellence to shelves around the
            world — under another brand, yet with the same soul.
          </p>
        </div>
        <router-link class="cta" to="/projects">
          <span>Explore</span>

          <svg
            class="chevron"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                d="M9 6L15 12L9 18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </router-link>
      </section>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.phase-container {
  min-height: 100vh;
  width: 100vw;
  // position: relative;
  overflow: hidden;
}
.phase {
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.phase-13 {
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;

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
      line-height: 1.1; /* 110% */
    }
  }
}

.phase-14 {
  position: absolute;
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    width: 100%;

    .content-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 70%;
      width: 80%;
      margin: auto;
      @media (max-width: 1600px) {
        width: 100%;
      }
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

@media (max-width: 450px) {
  .phase-13 {
    .hero-text-container {
      top: 50%;
      justify-content: space-around;
      height: 80%;
      h2 {
        color: #fff;
        text-align: center;
        text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        font-family: Belleza;
        font-size: 36px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 66.667% */
        letter-spacing: 1.44px;
      }
      p {
        color: #fff;
        text-align: center;
        text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        font-family: Kugile;
        font-size: 30px;
        font-style: normal;
        font-weight: 400;
        line-height: 40px; /* 133.333% */
      }
    }
  }

  .phase-14-mobile,
  .phase-15-mobile,
  .phase-16-mobile {
    .phase-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      padding-top: 10vh;
      padding-bottom: 10vh;
      justify-content: center;
      .section-label {
        margin-bottom: 30px;
      }
      h2 {
        color: #039ea2;
        text-align: center;
        font-family: Kugile;
        font-size: 36px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.25; /* 125% */
        @media (max-width: 390px) {
          font-size: 32px;
        }
        margin-bottom: 20px;
      }
      h3 {
        color: #039ea2;
        text-align: center;
        font-family: "Century Gothic";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.2; /* 118.75% */
        letter-spacing: 0.64px;
        text-transform: uppercase;
        @media (max-width: 390px) {
          font-size: 14px;
        }
      }
      p {
        color: #000;
        text-align: center;
        font-family: Raleway;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5; /* 150% */
        letter-spacing: 0.64px;
        margin-bottom: 15px;
        @media (max-width: 390px) {
          font-size: 12px;
        }
      }
    }
  }

  .cta {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 60px;
    position: absolute;
    bottom: 0;
    left: 0;

    // background-color: #039ea215;
    color: #039ea2;
    font-family: "Century Gothic";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 19px; /* 118.75% */
    letter-spacing: 0.64px;
    text-transform: uppercase;
    .chevron {
      height: 18px;
      path {
        stroke: #039ea2;
      }
    }
    transition: all 0.5s ease;
    &:active {
      opacity: 0;
      // transform: scale(1.1);
      letter-spacing: 4px;
    }
  }
}
</style>
