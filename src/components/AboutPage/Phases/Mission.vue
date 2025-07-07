<template>
  <section v-if="phaseId === 11" class="phase phase-10" key="phase-10">
    <div class="image-container"> <img :src="missionHeroImage" class="background" alt="Background"/>
    </div>
    <div :class="{'animate-in': animateInText}" class="how-it-started-container">
      <h2>Our mission</h2>
      <p>To preserve and elevate Greek culinary <br/> heritage to the world</p>
    </div>
  </section>
  <section v-else-if="phaseId === 12" class="phase phase-12" key="phase-12">
    <div class="image-container"> <img :src="howItStarted" class="background" alt="Background"/>
    </div>
    <div :class="{'animate-in': animateInText}" class="how-it-started-container">
      <h2>Private label</h2>
      <p>Mediterranean products for your brand, <br/> blending innovation and tradition</p>
    </div>
  </section>
  <section v-else-if="phaseId = 13" class="phase phase-13" key="phase-13">
    <h3 class=""> Our goal is to not only preserve the rich culinary heritage of Greece but to elevate it, making it accessible to food lovers around the globe</h3>
    <p>At Dolopia Savour Creations, we believe in the power of continuous improvement. Our passion for high-quality, authentic flavors drives us to refine our methods and enhance our products constantly. We are dedicated to sourcing the finest ingredients and employing innovative techniques to ensure that every product we create meets our high standards for taste and quality.</p>
    <p>Our team is already hard at work experimenting with new flavors and ingredients, ensuring that we remain at the forefront of the artisanal food movement. As we continue to grow, our mission remains the same: to bring the best of Greek and Mediterranean cuisine to your table, enriching your culinary experiences with every product we offer.</p>
  </section>
</template>

<script setup>
import missionHeroImage from "@/assets/about/mission/mission.png"
import privateLabelHeroImage from "@/assets/about/mission/private-label.png"
import dolopiaLogo from "@/assets/about/dolopia.png"
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  phaseId: {
    type: Number,
    required: true,
    default: 0
  }
})

const phases = [
  { label: 'Logo' },
  { label: 'Introduction' },
  { label: 'Selections' }
]

const animateInText = ref(false)


watch(() => props.phaseId, (newPhaseId) => {
  console.log("Got phaseId INTRO", newPhaseId)
  
  // Reset text animation
  animateInText.value = false
  
  // Handle phase-specific animations
  if (newPhaseId === 1) {
    setTimeout(() => {
      animateInText.value = true
    }, 300)
  }
}, { immediate: true })

onMounted(() => {
  console.log("onmounted intro")
})

onUnmounted(() => {
})
</script>

<style lang="scss" scoped>

</style>