<template>
  <Transition name="slide-up-mission">
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

    <section v-else-if="phaseId === 12" class="phase phase-12" key="phase-12">
      <div class="phase-content">
        <h2>
          Our goal is to not only preserve the
          <br/>rich culinary heritage of Greece but to
          <br/>elevate it, making it accessible to food 
          <br/>lovers around the globe
        </h2>
        <div class="paragraph-container">
          <p>
            At Dolopia Savour Creations, we believe in the power of continuous
            improvement. Our passion for high-quality, authentic flavors drives
            <br/>us to refine our methods and enhance our products constantly. We are dedicated to
            sourcing the finest ingredients and
            <br/>employing innovative techniques to ensure
            that every product we create meets our high standards for taste and quality.
          </p>
          <p>
            Our team is already hard at work experimenting with new flavors and
            ingredients, ensuring that we remain at the forefront of the artisanal
            <br/>foodn movement. As we continue to grow, our mission remains the same: to bring the
            best of Greek and Mediterranean cuisine to your
            <br/>table, enriching your culinary
            experiences with every product we offer.
          </p>
        </div>
      </div>
    </section>
  </Transition>
</template>

<script setup>
import missionHeroImage from "@/assets/about/mission/mission.png";
import { ref, watch, onMounted, onUnmounted } from "vue";

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

<style lang="scss" scoped>
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
  .phase-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 70%;
    height: 60%;
    margin: auto;
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
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.5; /* 150% */
      letter-spacing: 0.64px;
      @media (max-width: 1600px) and (max-height: 900px) {
        font-size: 14px;
      }
    }
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
