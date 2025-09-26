<script setup>
//Mission-5
import missionHeroImage from "@/assets/about/mission/mission.png";
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
    if (newPhaseId === 11) {
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
  <div class="phase-container">
    <Transition name="slide-up-reusable">
      <section v-if="phaseId === 11" class="phase phase-11" key="phase-11">
        <div class="image-container">
          <img :src="missionHeroImage" class="background" alt="Background" />
        </div>
        <div :class="{ 'animate-in': animateInText }" class="hero-text-container">
          <h2>Our mission</h2>
          <p>
            To preserve and elevate Greek culinary <br />
            heritage to the world
          </p>
        </div>
      </section>

      <section
        v-else-if="phaseId === 12 && !isMobile"
        class="phase phase-12"
        key="phase-12"
      >
        <div class="phase-content">
          <h3 v-if="isMobile">Our mission</h3>
          <h2>To bring Greek & Mediterranean cuisine to your table</h2>
          <h2>
            Our goal is to not only preserve the<br />
            rich culinary heritage of Greece but to <br />
            elevate it, making it accessible to food<br />
            lovers around the globe
          </h2>
          <div class="paragraph-container">
            <p>
              At Dolopia Savour Creations, we believe in the power of continuous
              improvement. Our passion for high-quality, authentic flavors drives
              <br />us to refine our methods and enhance our products constantly. We are
              dedicated to sourcing the finest ingredients and <br />employing innovative
              techniques to ensure that every product we create meets our high standards
              for taste and quality.
            </p>
            <p>
              Our team is already hard at work experimenting with new flavors and
              ingredients, ensuring that we remain at the forefront of the artisanal
              <br />food movement. As we continue to grow, our mission remains the same:
              to bring the best of Greek and Mediterranean cuisine to your <br />table,
              enriching your culinary experiences with every product we offer.
            </p>
          </div>
        </div>
      </section>

      <section
        v-else-if="phaseId === 12 && isMobile"
        class="phase phase-12-mobile"
        key="phase-12-mobile"
      >
        <div class="phase-content">
          <h3 v-if="isMobile">Our mission</h3>
          <h2>To bring Greek & Mediterranean cuisine to your table</h2>
          <div class="paragraph-container">
            <p>
              Our goal is to not only preserve the rich culinary heritage of Greece but to
              elevate it, making it accessible to food lovers around the globe
            </p>
            <p>
              As we continue to grow, our mission remains the same: to bring the best of
              Greek and Mediterranean cuisine to your table, enriching your culinary
              experiences with every product we offer.
            </p>
          </div>
        </div>
      </section>

      <section
        v-else-if="phaseId === 13 && isMobile"
        class="phase phase-13-mobile"
        key="phase-13-mobile"
      >
        <div class="phase-content">
          <h3>new flavors and ingredients</h3>
          <h2>At Dolopia, we believe in the power of continuous improvement.</h2>
          <div class="paragraph-container">
            <p>
              Our passion for high-quality, authentic flavors drives us to refine our
              methods and enhance our products constantly. We are dedicated to sourcing
              the finest ingredients and employing innovative techniques to ensure that
              every product we create meets our high standards for taste and quality.
            </p>
            <p>
              Our team is already hard at work experimenting with new flavors and
              ingredients, ensuring that we remain at the forefront of the artisanal food
              movement.
            </p>
          </div>
        </div>
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
.phase{
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.phase-11 {
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
    @media (max-width: 450px) {
      top: 50%;
      height: 100%;
      width: 95%;
      justify-content: space-around;
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
      @media (max-width: 450px) {
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
      @media (max-width: 450px) {
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
}

.phase-12 {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  background-color: #e6f6f6 !important;
  .phase-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    height: 65%;
    margin: auto;
    @media (min-width: 1920px) {
      height: 50%;
    }
  }
  h2 {
    height: 60%;
    color: #039ea2;
    text-align: center;
    font-family: "Kugile";
    font-size: 60px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.2; /* 116.667% */
    letter-spacing: 2.4px;
    margin-bottom: 2vh;
    @media (max-width: 1920px) {
      font-size: 56px;
    }
    @media (max-width: 1600px) and (max-height: 900px) {
      font-size: 48px;
    }
  }
  .paragraph-container {
    height: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    p {
      color: #000;
      text-align: center;
      font-family: "Raleway";
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.5; /* 150% */
      letter-spacing: 0.64px;
      @media (max-width: 1600px) and (max-height: 900px) {
        font-size: 14px;
      }
      margin-bottom: 2vh;
    }
  }
}

@media(max-width: 450px){
  .phase-12-mobile,
  .phase-13-mobile {
    .phase-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      padding-top: 10vh;
      padding-bottom: 10vh;
      justify-content: space-around;
      h2 {
        color: #039ea2;
        text-align: center;
        font-family: Kugile;
        font-size: 36px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.25; /* 125% */
        @media(max-width: 390px){
          font-size: 32px;
        }
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
        @media(max-width: 390px){
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
        @media(max-width: 390px){
          font-size: 12px;
        }
      }
    }
  }
}
/* slide-up-mission transitions */
.slide-up-mission-enter-active,
.slide-up-mission-leave-active {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-mission-enter-from {
  transform: translateY(100vh);
}
.slide-up-mission-enter-to {
  transform: translateY(0);
}
.slide-up-mission-leave-from {
  transform: translateY(0);
}
.slide-up-mission-leave-to {
  transform: translateY(-100vh);
}
</style>
