import { defineStore } from "pinia";
import { ref } from "vue";

export const useTransitionStore = defineStore("transition", () => {
  const isPageTransitioning = ref(false);

  function setTransitioning(status) {
    isPageTransitioning.value = status;
  }

  return { isPageTransitioning, setTransitioning };
});