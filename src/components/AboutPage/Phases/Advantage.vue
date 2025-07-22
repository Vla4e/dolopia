<script setup>
import VideoShowcase from "../VideoShowcase.vue";
import advantageImage from "@/assets/about/advantage.jpg"
import { onMounted, watch, ref, inject, onUnmounted, nextTick } from 'vue';

import { useScrollStore } from "@/store/scroll.js";
const scroll = useScrollStore();


const animateInText = ref(false);
const isAtBottom = ref(false);
const phase10Ref = ref(null);

const props = defineProps({
  phaseId: {
    type: Number,
    required: true
  }
});


let hasScrolledDown = ref(false)
const checkScrollEnd = (event) => {
  const element = event.target;
  if (!element) return;
  // Check if scrolled to the bottom (with a small threshold for precision)
  hasScrolledDown.value = true;
  if (element.scrollHeight - element.scrollTop <= element.clientHeight + 1) {
    isAtBottom.value = true;
    scroll.ignoreScrollCallbacks = false;
  } else {
    isAtBottom.value = false;
    scroll.ignoreScrollCallbacks = true;
  }
};

watch(() => props.phaseId, async (newPhaseId) => {
  console.log("Got phaseId ADVANTAGE", newPhaseId);
  
  // Reset text animation
  animateInText.value = false;
  isAtBottom.value = false;
  
  if (newPhaseId === 9) {
    setTimeout(() => {
      animateInText.value = true;
    }, 300);
  }

  if (newPhaseId === 10) {
    await nextTick()
    scroll.ignoreScrollCallbacks = true;
    if (phase10Ref.value) {
      phase10Ref.value.scrollTop = 0;
      phase10Ref.value.addEventListener("scroll", checkScrollEnd);
    }
  }
}, { immediate: true });

onMounted(() => {
  console.log("ADVANTAGE mounted");
});

onUnmounted(() => {
  if (phase10Ref.value) {
    phase10Ref.value.removeEventListener("scroll", checkScrollEnd);
  }
});
</script>

<template>
  <!-- Phase 9 -->
  <Transition name="slide-up-advantage">
    <section v-if="phaseId === 9" class="phase phase-9" key="phase-9">
      <div class="image-container">
        <img :src="advantageImage" class="logo" alt="Logo"/>
      </div>
      <div :class="{'animate-in': animateInText}" class="dolopia-advantage-container">
        <h2>The Dolopia Advantage</h2>
        <p>commitment to quality, authenticity and flavor</p>
      </div>
    </section>

    <!-- Phase 10 -->
    <div v-else-if="phaseId === 10" ref="phase10Ref" class="phase phase-10" key="phase-10">
      <VideoShowcase :key="'artisanal'" side="left" sectionId="artisanal"/>
      <VideoShowcase :key="'essence'" side="right" sectionId="essence"/>
      <div :class="hasScrolledDown ? 'scrolled' : ''" class="scroll-indicator" v-if="!isAtBottom">
        <span>Scroll down to continue</span>
        <div class="arrow"></div>
      </div>
      <VideoShowcase :key="'text-only'" side="right" sectionId="distribution"/>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
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
}

.scroll-indicator {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #039EA2;
  font-family: "Kugile";
  z-index: 10;
  
  .arrow {
    width: 20px;
    height: 20px;
    border: 2px solid #039EA2;
    border-left: 0;
    border-top: 0;
    transform: rotate(45deg);
    margin-top: 10px;
    animation: bounce 1.5s infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: rotate(45deg) translateY(0); }
    50% { transform: rotate(45deg) translateY(-10px); }
  }
  transition: opacity 0.5s ease;
  &.scrolled{
    opacity: 0;
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
    background: linear-gradient(180deg, rgba(217, 217, 217, 0.00) -14.3%, rgba(39, 39, 39, 0.70) 50.14%);
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

.dolopia-advantage-container{
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
  &.animate-in{
    opacity: 1;
    transform: translate(-50%, -50%);
  }

  h2{
    color: #FFF;
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
  p{
    color: #FFF;
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
.slide-up-advantage-enter-active, .slide-up-advantage-leave-active {
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