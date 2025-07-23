<script setup>
import VideoShowcase from "@/components/AboutView/VideoShowcase.vue";
import howItStarted from "@/assets/about/beginning/how-it-all-started.png";
// import ScrollIndicator from "../ScrollIndicator.vue";
import { watch, ref, inject, onUnmounted, nextTick } from "vue";

import { useScrollStore } from "@/store/scroll.js";
const scroll = useScrollStore();

const animateInText = ref(false);
const isAtBottom = ref(false);

const props = defineProps({
  phaseId: {
    type: Number,
    required: true,
  },
});

const checkScrollEnd = (event) => {
  const element = event.target;
  // Check if scrolled to the bottom (with a small threshold for precision)
  if (element.scrollHeight - element.scrollTop <= element.clientHeight + 1) {
    isAtBottom.value = true;
    scroll.ignoreScrollCallbacks = false;
  } else {
    isAtBottom.value = false;
    scroll.ignoreScrollCallbacks = true;
  }
};

watch(
  () => props.phaseId,
  async (newPhaseId) => {
    console.log("Got phaseId BEGINNING", newPhaseId);

    // Reset text animation
    animateInText.value = false;


    if (newPhaseId === 7) {
      setTimeout(() => {
        animateInText.value = true;
      }, 300);
      scroll.ignoreScrollCallbacks = false;
    }

    if (newPhaseId === 8) {
      await nextTick();
      scroll.ignoreScrollCallbacks = true;
      const phase8Element = document.querySelector(".phase-8");
      if (phase8Element) {
        phase8Element.addEventListener("scroll", checkScrollEnd);
      }
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  const phase8Element = document.querySelector(".phase-8");
  if (phase8Element) {
    phase8Element.removeEventListener("scroll", checkScrollEnd);
  }
  scroll.ignoreScrollCallbacks = false;
});
</script>


<template>
  <div class="phase-container">
    <Transition name="slide-up-beginning">
      <section v-if="props.phaseId === 7" class="phase phase-7" key="phase-7">
        <div class="image-container">
          <img :src="howItStarted" class="background" alt="Background" />
        </div>
        <div :class="{ 'animate-in': animateInText }" class="how-it-started-container">
          <h2>How It All Started</h2>
          <p>bringing unique flavours to the world</p>
        </div>
      </section>

      <div v-else-if="props.phaseId === 8" class="phase phase-8" key="phase-8">
        <VideoShowcase :key="'passion'" side="left" sectionId="passion" />
        <VideoShowcase :key="'quality'" side="right" sectionId="quality" />
        <!-- <ScrollIndicator :phaseId="phaseId" :disappearAtPhaseId="9"/> -->
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
  padding-left: 2vw;
  padding-right: 2vw;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  .video-showcase:last-child {
    margin-top: 10vh;
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




/* slide-up-beginning transitions */
.slide-up-beginning-enter-active, .slide-up-beginning-leave-active {
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
