<script setup>

import { ref, computed, defineAsyncComponent, inject, onUnmounted, watch } from "vue";
import { useScrollDirection } from "@/composables/useScrollDirection";

const phaseId = ref(0);
const phaseCount = 15;

const phaseMappings = [
  { name: 'Introduction', range: [0, 2], component: defineAsyncComponent(() => import('@/components/AboutPage/Phases/Introduction.vue')) },
  { name: 'Projects', range: [3, 6], component: defineAsyncComponent(() => import('@/components/AboutPage/Phases/Projects.vue')) },
  { name: 'Beginning', range: [7, 8], component: defineAsyncComponent(() => import('@/components/AboutPage/Phases/Beginning.vue')) },
  { name: 'Advantage', range: [9, 10], component: defineAsyncComponent(() => import('@/components/AboutPage/Phases/Advantage.vue')) },
  { name: 'Mission', range: [11, 14], component: defineAsyncComponent(() => import('@/components/AboutPage/Phases/Mission.vue')) },
];

const currentPhaseComponent = computed(() => {
  const mapping = phaseMappings.find(m => 
    phaseId.value >= m.range[0] && phaseId.value <= m.range[1]
  );
  // Fallback to the first component if no match is found
  return mapping ? mapping : phaseMappings[0];
});

let isCycling = false;
const forward = true;
const backward = false;

function cyclePhase(direction) {
  if(isCycling){
    return
  }
  isCycling = true;
  if (direction === forward) {
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
  setTimeout(() => {
    isCycling = false
  }, 500) //adjust to transition duration based on currentTransition
}


useScrollDirection(
  () => cyclePhase(backward), // onScrollUp
  () => cyclePhase(forward),  // onScrollDown
);


const currentTransition = computed(() => {
  // if (phaseId.value === 1) return 'fade-in-up';
  // if (phaseId.value >= 2) return 'slide-up-about';
  return {name: 'fade-in-up', mode:''}; // Default for phase 0 or others
});
</script>

<template>
  <div class="about-container" :class="`container-${phaseId}`">
    <Suspense>
      <Transition :name="currentTransition.name" :mode="currentTransition.mode">
        <component
          :is="currentPhaseComponent.component"
          :key="currentPhaseComponent.name"
          :phaseId="phaseId"
          class="phase"
        />
      </Transition>
    </Suspense>
  </div>

  <!--comment in for testing during development-->
  <div class="controls">
    <button @click="cyclePhase(backward)">PREV</button>
    <span>{{ phaseId }}</span>
    <button @click="cyclePhase(forward)">NEXT</button>
  </div>
</template>

<style lang="scss" scoped>
.about-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &.container{
    &-3{
      background-color: #8AC3C7;
      .phase{
        background-color: #8AC3C7;
      }
    }
    &-4{
        background-color: #039EA2;
      .phase{
        background-color: #039EA2;
      }
    }
     &-5, &-6, &-7{
      background-color: #039EA2;
      .phase{
        background-color: #039EA2;
      }
    }
    &-8, &-9, &-10, &-11{
      background-color: #e6f6f6;
      .phase{
        background-color: #e6f6f6;
      }
    }
    &-12, &-13, &-14{
      .phase{
        background-color: #039EA2;
      }
    }
  }
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
  transform: translateY(100%);
}
.fade-in-up-enter-active {
  transition: transform 1s ease, opacity 1s ease;
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
  transition: transform 1s ease, opacity 2s ease;
}
.fade-in-up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
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
