// stores/useProductViewStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useProductViewStore = defineStore('productView', () => {
  const PHASES = {
    overview: 'overview',
    productDescription: 'productDescription',
    informationWheel: 'informationWheel',
    nutritionalData: 'nutritionalData'
  };
  const ALL_PHASES_ARRAY = Object.values(PHASES);

  // State
  const currentPhaseName = ref(PHASES.overview);

  // Getters
  const isOverviewActive = computed(() => currentPhaseName.value === PHASES.overview);
  const currentPhaseIndex = computed(() => ALL_PHASES_ARRAY.indexOf(currentPhaseName.value));

  // Actions
  function setPhase(phaseName) {
    if (Object.values(PHASES).includes(phaseName)) {
      currentPhaseName.value = phaseName;
    } else {
      console.warn(`Invalid phase name: ${phaseName}`);
    }
  }

  function cyclePhase(direction) { // true for forward, false for backward
    const currentIndex = currentPhaseIndex.value;
    let newIndex;

    if (direction) { // Forward
      newIndex = (currentIndex + 1) % ALL_PHASES_ARRAY.length;
    } else { // Backward
      newIndex = (currentIndex - 1 + ALL_PHASES_ARRAY.length) % ALL_PHASES_ARRAY.length;
    }
    setPhase(ALL_PHASES_ARRAY[newIndex]);
  }

  function toggleOverview() {
    if (isOverviewActive.value) {
      setPhase(PHASES.productDescription);
    } else {
      setPhase(PHASES.overview);
    }
  }

  return {
    PHASES, // Expose phases for component use (e.g., v-if comparisons)
    ALL_PHASES_ARRAY, // Expose for carousel and indexing
    currentPhaseName,
    isOverviewActive,
    currentPhaseIndex,
    setPhase,
    cyclePhase,
    toggleOverview
  };
});