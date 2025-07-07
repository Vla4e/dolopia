<template>
  <section v-if="phaseId === 7" class="phase phase-7" key="phase-7">
    <div class="image-container"> <img :src="howItStarted" class="background" alt="Background"/>
    </div>
    <div :class="{'animate-in': animateInText}" class="how-it-started-container">
      <h2>How It All Started</h2>
      <p>bringing unique flavours to the world</p>
    </div>
  </section>

  <div v-else-if="phaseId === 8" class="phase phase-8" key="phase-8">
    <VideoShowcase :key="'passion'" side="left" sectionId="passion"/>
    <VideoShowcase :key="'quality'" side="right" sectionId="quality"/>
  </div>
</template>

<script setup>
import VideoShowcase from "@/components/AboutPage/VideoShowcase.vue";
import howItStarted from "@/assets/about/beginning/how-it-all-started.png"
import { onMounted, watch, ref } from 'vue';

const animateInText = ref(false)

const props = defineProps({
  phaseId: {
    type: Number,
    required: true
  }
})


watch(() => props.phaseId, (newPhaseId) => {
  console.log("Got phaseId INTRO", newPhaseId)
  
  // Reset text animation
  animateInText.value = false
  
  // Handle phase-specific animations
  if (newPhaseId === 7) {
    setTimeout(() => {
      animateInText.value = true
    }, 300)
  }
}, { immediate: true })

onMounted(() => {
  console.log("BEGINNING")
})

</script>

<style lang="scss" scoped>
.phase-7 {
  position: relative; // Ensure the pseudo-element can be absolutely positioned relative to this.
  // Add width/height for the phase-7 if it doesn't already have it
  width: 100%;
  height: 100vh; // Example, adjust as needed
  overflow: hidden; // Important for containing the absolutely positioned image
}
.phase-8{
  background-color: #E6F6F6;
  flex-direction: column;
  overflow: scroll;
  padding-left: 2vw;
  padding-right: 2vw;
  .video-showcase:last-child{
    margin-top: 10vh;
  }
}
.image-container {
  position: absolute; // Position the container to cover the phase-7 area
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; // Put it below the text container
  &::after {
    content: "";
    position: absolute;
    inset: 0; // Shorthand for top: 0; right: 0; bottom: 0; left: 0;
    background: linear-gradient(180deg, rgba(217, 217, 217, 0.00) -14.3%, rgba(39, 39, 39, 0.70) 50.14%);
    pointer-events: none; /* so it doesn't block clicks */
    z-index: 2; // Make sure the overlay is on top of the image
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; // Ensures the image covers the container without distortion
    display: block; // Removes extra space below image
  }
}

.how-it-started-container{
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  top: 70%;
  left: 50%;
  opacity: 0;
  transform: translate(-50%, -100%);
  transition: opacity 3s 0.2s ease, transform 0.5s ease;
  z-index: 3; // Ensure text is above the image and overlay
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
    line-height: 1; /* 30% */
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
</style>