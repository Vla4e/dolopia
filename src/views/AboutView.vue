<script setup>
//AboutView.vue
import { ref, computed, defineAsyncComponent, inject, onUnmounted, watch } from "vue";
import { useScrollDirection } from "@/composables/useScrollDirection";

const { isMobile } = inject("screenSize");

const phaseId = ref(0);
const phaseCount = computed(() => {
  return isMobile.value ? 17 : 15;
});

// Cache the async components to avoid recreating them
const components = {
  Introduction: defineAsyncComponent(() =>
    import("@/components/AboutView/Phases/Introduction-1.vue")
  ),
  Projects: defineAsyncComponent(() =>
    import("@/components/AboutView/Phases/Projects-2.vue")
  ),
  Beginning: defineAsyncComponent(() =>
    import("@/components/AboutView/Phases/Beginning-3.vue")
  ),
  Advantage: defineAsyncComponent(() =>
    import("@/components/AboutView/Phases/Advantage-4.vue")
  ),
  Mission: defineAsyncComponent(() =>
    import("@/components/AboutView/Phases/Mission-5.vue")
  ),
  PrivateLabel: defineAsyncComponent(() =>
    import("@/components/AboutView/Phases/PrivateLabel-6.vue")
  ),
};

const phaseMappings = computed(() => {
  const mobile = isMobile.value;

  return [
    { name: "Introduction", range: [0, 2], component: components.Introduction },
    { name: "Projects", range: [3, 6], component: components.Projects },
    { name: "Beginning", range: [7, 8], component: components.Beginning },
    { name: "Advantage", range: [9, 10], component: components.Advantage },
    {
      name: "Mission",
      range: mobile ? [11, 13] : [11, 12],
      component: components.Mission,
    },
    {
      name: "PrivateLabel",
      range: mobile ? [14, 16] : [13, 14],
      component: components.PrivateLabel,
    },
  ];
});

const currentPhaseComponent = computed(() => {
  const currentPhase = phaseId.value;
  const mappings = phaseMappings.value;

  for (let i = 0; i < mappings.length; i++) {
    const mapping = mappings[i];
    if (currentPhase >= mapping.range[0] && currentPhase <= mapping.range[1]) {
      return mapping;
    }
  }

  //fallback
  return mappings[0];
});

let noPaddingPhases = [7, 9, 11, 13];
let noPaddingPhasesMobile = [7, 9, 11, 14];
let hasPadding = ref(true);
watch(
  () => phaseId.value,
  (newPhase) => {
    console.log("newPhase", newPhase, noPaddingPhases.includes(newPhase));
    if (isMobile.value) {
      if (noPaddingPhasesMobile.includes(newPhase)) {
        hasPadding.value = false;
      } else hasPadding.value = true;
    } else {
      if (noPaddingPhases.includes(newPhase)) {
        hasPadding.value = false;
      } else hasPadding.value = true;
    }
    console.log("Final value of padding:", hasPadding.value);
  }
);

let isCycling = false;
const forward = true;
const backward = false;

function cyclePhase(direction) {
  if (isCycling) return;
  if (phaseId.value === 14 && !isMobile.value && direction === forward) return;
  else if (phaseId.value === 16 && direction === forward) return;

  isCycling = true;
  const currentPhase = phaseId.value;
  const maxPhase = phaseCount.value - 1;

  if (direction === forward) {
    hasScrolledDown.value = true;
    phaseId.value = currentPhase < maxPhase ? currentPhase + 1 : 0;
  } else {
    phaseId.value = currentPhase > 0 ? currentPhase - 1 : maxPhase;
  }

  setTimeout(() => {
    isCycling = false;
  }, 800); // adjust to transition duration based on currentTransition styling
}

// Scroll override disabled within Advantage, Beginning.vue via useScrollStore to allow for native scrolling through component.
let hasScrolledDown = ref(false);
useScrollDirection(
  () => cyclePhase(backward), // onScrollUp
  () => cyclePhase(forward) // onScrollDown
);

// Since this always returns the same value, make it a constant or remove the computed
const currentTransition = { name: "fade-in-up", mode: "" };
</script>

<template>
  <div class="about-page-container" :class="`container-${phaseId}`">
    <Suspense>
      <Transition :name="currentTransition.name" :mode="currentTransition.mode">
        <component
          :is="currentPhaseComponent.component"
          :id="hasPadding"
          :key="currentPhaseComponent.name"
          :phaseId="phaseId"
          class="phase-component"
          :class="{ padding: hasPadding }"
        />
      </Transition>
    </Suspense>
  </div>

  <!-- <div class="controls">
    <button @click="cyclePhase(backward)">PREV</button>
    <span>{{ phaseId }}</span>
    <button @click="cyclePhase(forward)">NEXT</button>
  </div> -->
</template>

<style lang="scss" scoped>
.about-page-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &.container {
    &-3 {
      background-color: #8ac3c7;
      .phase-component {
        background-color: #8ac3c7;
      }
    }
    &-4 {
      background-color: #039ea2;
      .phase-component {
        background-color: #039ea2;
      }
    }
    &-5,
    &-6,
    &-7 {
      background-color: #039ea2;
      .phase-component {
        background-color: #039ea2;
      }
    }
    &-8,
    &-9,
    &-10,
    &-11 {
      background-color: #e6f6f6;
      .phase-component {
        background-color: #e6f6f6;
      }
    }
    &-12,
    &-13,
    &-14 {
      .phase-component {
        background-color: #e6f6f6;
      }
    }
    &-15,
    &-16{
      .phase-component {
        background-color: #e6f6f6;
      }
    }
  }
}

.phase-component {
  display: flex;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #8ac3c7;
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
.slide-up-about-enter-active,
.slide-up-about-leave-active {
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
