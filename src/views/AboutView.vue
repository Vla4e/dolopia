<script setup>
import { ref, computed, defineAsyncComponent, onMounted} from "vue";

onMounted(() => {
})

const phaseId = ref(0);
const phaseCount = 18; // Total number of phases (0-18)

// lazy-load, improves initial page load performance.
const phaseComponents = [
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Introduction.vue')),
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Projects.vue')),
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Beginning.vue')),
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Advantage.vue')),
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Mission.vue')),
];

// WIP - rework - I don't like this
const currentPhaseComponent = computed(() => {
  if (phaseId.value >= 0 && phaseId.value <= 2) { // Introduction phases 0-2
    return phaseComponents[0]
  } else if (phaseId.value >= 3 && phaseId.value <= 6) { // Projects phases 3-6
    return phaseComponents[1]
  } else if (phaseId.value >= 7 && phaseId.value <= 8) { // Beginning phases 7-10
    return phaseComponents[2]
  } else if (phaseId.value >= 9 && phaseId.value <= 10) { // Advantage phases 11-14
    return phaseComponents[3]
  } else if (phaseId.value >= 11 && phaseId.value <= 14) { // Mission phases 15-18
    return phaseComponents[4]
  }
  return phaseComponents[0]; //fallback to first phase.
});


function cyclePhase(direction) {
  if (direction) {
    if (phaseId.value < phaseCount - 1) {
      phaseId.value++;
    } else {
      phaseId.value = 0;
    }
  } else {
    if (phaseId.value > 0) {
      phaseId.value--;
    } else {
      phaseId.value = phaseCount - 1;
    }
  }
}

const currentTransition = computed(() => {
  if (phaseId.value === 1) return 'fade-in-up';
  if (phaseId.value >= 2) return 'slide-up-about';
  return 'fade-in-up'; // Default for phase 0 or others
});
</script>

<template>
  <div class="about-container">
    <TransitionGroup :name="currentTransition">
      <component :is="currentPhaseComponent" :key="phaseId" :phaseId="phaseId" class="phase" />
    </TransitionGroup>
  </div>

  <!--comment in for testing during development-->
  <div class="controls">
    <button @click="cyclePhase(0)">PREV</button>
    <span>{{ phaseId }}</span>
    <button @click="cyclePhase(1)">NEXT</button>
  </div>
</template>

<style lang="scss" scoped>
.about-container {
  min-width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.phase {
  display: flex;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #8AC3C7;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 20000;
  bottom: 5%;
  left: 50%;
  width: 150px;
  height: 50px;
  background-color: #13131350;
  transform: translateX(-50%);
  color: white;
  border-radius: 10px;
  font-family: monospace;

  button {
    background: #fff;
    color: #131313;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
}

// --- TRANSITION STYLES ---

/* fade-in-up */
.fade-in-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-in-up-enter-active {
  transition: all 0.5s ease;
}
.fade-in-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-in-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-in-up-leave-active {
  transition: all 0.5s ease;
}
.fade-in-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* slide-up-about transitions */
.slide-up-about-enter-active, .slide-up-about-leave-active {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-about-enter-from {
  transform: translateY(100vh);
}
.slide-up-about-enter-to {
  transform: translateY(0);
}
.slide-up-about-leave-from {
  transform: translateY(0);
}
.slide-up-about-leave-to {
  transform: translateY(-100vh);
}
</style>
