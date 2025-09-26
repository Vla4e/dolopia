<script setup>
import VideoShowcase from "@/components/AboutView/VideoShowcase.vue";
import howItStarted from "@/assets/about/beginning/how-it-all-started.png";
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
  initializeScrollablePhase,
  initializeStaticPhase,
} = useWithinPhaseScroll({
  containerSelector: ".phase-8",
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
    console.log("Got phaseId BEGINNING", newPhaseId);

    // Reset text animation
    animateInText.value = false;

    if (newPhaseId === 7) {
      // Static phase - just enable normal phase cycling
      initializeStaticPhase();

      setTimeout(() => {
        animateInText.value = true;
      }, 300);
    }

    if (newPhaseId === 8) {
      // Scrollable phase - set up internal scrolling with boundary detection
      await initializeScrollablePhase();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="phase-container">
    <Transition name="slide-up-reusable">
      <section v-if="props.phaseId === 7" class="phase phase-7" key="phase-7">
        <div class="image-container">
          <img :src="howItStarted" class="background" alt="Background" />
        </div>
        <div :class="{ 'animate-in': animateInText }" class="how-it-started-container">
          <h2>How it all started</h2>
          <p>bringing unique flavours to the world</p>
        </div>
      </section>

      <div v-else-if="props.phaseId === 8" class="phase phase-8" key="phase-8">
        <VideoShowcase :key="'passion'" side="left" sectionId="passion" />
        <VideoShowcase :key="'quality'" side="right" sectionId="quality" />

      </div>
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
.phase-7 {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.phase-8 {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: #e6f6f6;
  flex-direction: column;
  padding-left: 3vw;
  padding-right: 3vw;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  .video-showcase:last-child {
    // margin-top: 10vh;
  }
  @media(max-width: 450px){
    // position: static;
    // padding-top: 30px;
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
    inset: 0; // Shorthand for top: 0; right: 0; bottom: 0; left: 0;
    background: linear-gradient(
      180deg,
      rgba(217, 217, 217, 0) -14.3%,
      rgba(39, 39, 39, 0.7) 50.14%
    );
    pointer-events: none; /* so it doesn't block clicks */
    z-index: 2; // Make sure the overlay is on top of the image
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.how-it-started-container {
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
    line-height: 1; /* 30% */
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

@media (max-width: 450px) {
  .phase-8 {
    height: 100vh !important; // Keep fixed height for scrolling
    position: fixed !important; // Use fixed instead of absolute
    overflow-y: auto !important; // Ensure scrolling is enabled
  }
  .how-it-started-container {
    // transform: none !important;
    // position: static;
    top: 50%;
    left: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 90%;
    h2 {
      color: #fff;
      text-align: center;
      text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      font-family: "Belleza";
      font-size: 36px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.1; /* 66.667% */
      letter-spacing: 1.44px;
    }
    p {
      color: #fff;
      text-align: center;
      text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      font-family: Kugile;
      font-size: 26px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.3; /* 133.333% */
    }
  }
}

/* slide-up-beginning transitions */
.slide-up-beginning-enter-active,
.slide-up-beginning-leave-active {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-beginning-enter-from {
  transform: translateY(100vh);
}
.slide-up-beginning-enter-to {
  transform: translateY(0);
}
.slide-up-beginning-leave-from {
  transform: translateY(0);
}
.slide-up-beginning-leave-to {
  transform: translateY(-100vh);
}
</style>
