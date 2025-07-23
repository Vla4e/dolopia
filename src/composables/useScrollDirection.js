/* 
Accepts onScrollUp & onScrollDown callback functions as arguments which trigger based on
scroll direction.
*/
import { onMounted, onUnmounted, watch } from 'vue';
import { useScrollStore } from '@/store/scroll.js';

export function useScrollDirection(onScrollUp, onScrollDown) {
  let scrollStore = useScrollStore();

  function onWheel(event) {
    // console.count('scrolling')
    if (!scrollStore.ignoreScrollCallbacks) {
      if (event.deltaY < 0) { // Scrolling up
        if (typeof onScrollUp === 'function') {
          onScrollUp();
        }
      } else if (event.deltaY > 0) { // Scrolling down
        if (typeof onScrollDown === 'function') {
          onScrollDown();
        }
      }
    }
  }


  watch(() => scrollStore.ignoreScrollCallbacks, (val) => {
    if(val){
      window.removeEventListener('wheel', onWheel)
    } else {
      window.addEventListener('wheel', onWheel)
    }
  }, { immediate: true })


  onMounted(() => {
    window.addEventListener('wheel', onWheel);
  });

  onUnmounted(() => {
    window.removeEventListener('wheel', onWheel);
  });
}
