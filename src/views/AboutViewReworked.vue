<script setup>
import { ref, computed, defineAsyncComponent, onMounted} from "vue";

onMounted(() => {
})

// --- STATE MANAGEMENT ---
const phaseId = ref(0);
const phaseCount = 18; // Total number of phases (0-18)

// --- DYNAMIC COMPONENTS ---
// An array holds all our phase components.
// defineAsyncComponent lazy-loads them, which improves initial page load performance.
const phaseComponents = [
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Introduction.vue')),
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Projects.vue')),
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Beginning.vue')),
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Advantage.vue')),
  defineAsyncComponent(() => import('@/components/AboutPage/Phases/Mission.vue')),
];

const phaseComponentsInfo =  {
  "Introduction": {
    phases: 3,
    beginsAtPhase: 0
  },
  "Projects": {
    phases: 4,
    beginsAtPhase: 3
  },
  "Beginning": {
    phases: 4,
    beginsAtPhase: 7
  },
  "Advantage": {
    phases: 4,
    beginsAtPhase: 10
  },
  "Mission": {
    phases: 4,
    beginsAtPhase: 14
  },
}


const currentPhaseComponent = computed(() => {
  if (phaseId.value >= 0 && phaseId.value <= 2) { // Introduction handles phases 0-2
    return phaseComponents[0]
  } else if (phaseId.value >= 3 && phaseId.value <= 6) { // Projects handles phases 3-6
    return phaseComponents[1]
  } else if (phaseId.value >= 7 && phaseId.value <= 8) { // Beginning handles phases 7-10
    return phaseComponents[2]
  } else if (phaseId.value >= 9 && phaseId.value <= 10) { // Advantage handles phases 11-14
    return phaseComponents[3]
  } else if (phaseId.value >= 11 && phaseId.value <= 14) { // Mission handles phases 15-18
    return phaseComponents[4]
  }
  return phaseComponents[0]; // fallback
});

// --- NAVIGATION ---
function cyclePhase(direction) {
  if (direction) { // "NEXT"
    if (phaseId.value < phaseCount - 1) {
      phaseId.value++;
    } else {
      phaseId.value = 0; // Loop back to the start
    }
  } else { // "PREV"
    if (phaseId.value > 0) {
      phaseId.value--;
    } else {
      phaseId.value = phaseCount - 1; // Loop back to the end
    }
  }
}

// --- TRANSITIONS ---
// The logic for choosing a transition is now simpler and stays in the parent.
const currentTransition = computed(() => {
  if (phaseId.value === 1) return 'fade-in-up';
  if (phaseId.value >= 2) return 'slide-up';
  return 'fade-in-up'; // Default for phase 0 or others
});
</script>

<template>
  <div class="about-container">
    <TransitionGroup :name="currentTransition">
      <!-- The 'key' is crucial for Vue's transition system to track elements -->
      <component :is="currentPhaseComponent" :key="phaseId" :phaseId="phaseId" class="phase" />
    </TransitionGroup>
  </div>

  <!-- Controls remain here as they are part of the parent view -->
  <div class="controls">
    <button @click="cyclePhase(0)">PREV</button>
    <span>{{ phaseId }}</span>
    <button @click="cyclePhase(1)">NEXT</button>
  </div>
</template>

<style lang="scss" scoped>
// --- GLOBAL LAYOUT & CONTROLS STYLES ---
.about-container {
  // width: 100%;
  min-width: 100vw;
  height: 100vh; // Ensure it takes full viewport height
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden; // This is key for the slide transitions
}

.phase {
  // Common styles for all phases, ensuring they fill the container
  display: flex;
  width: 100%;
  // height: 100%;
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
// These styles are global to the view and control how components enter and leave.

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

/* Slide-up transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  transform: translateY(100vh);
}
.slide-up-enter-to {
  transform: translateY(0);
}
.slide-up-leave-from {
  transform: translateY(0);
}
.slide-up-leave-to {
  transform: translateY(-100vh);
}
</style>
