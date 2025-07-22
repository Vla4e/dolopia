//Sidebar menu store

import { defineStore } from 'pinia';
import { ref, reactive, computed, watch, toRaw } from 'vue';


// console.log("subcategory")
export const useScrollStore = defineStore('scroll', () => {

  const scrollCallbacksFlag = ref(null);
  function setScrollCallbacksFlag(val){
    scrollCallbacksFlag.value = val
  }
  const ignoreScrollCallbacks = computed({
    get: () => scrollCallbacksFlag.value,
    set: (val) => setScrollCallbacksFlag(val)
  })
  return {
    ignoreScrollCallbacks
  }
});
