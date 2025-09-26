/* 
Used to Scroll through phases on About page, overriding default scrolling.
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

  let initialTouch;
  function onTouchStart(event) {
    console.log("TouchStarted -> ", event)
    initialTouch = event.touches[0].clientY;

  }
  function onTouchMove (event) {
    // console.log("TouchMove -> ", event.touches[0].clientY, initialTouch, event.touches[0].clientY > initialTouch)
    let clientY = event.touches[0].clientY;
    if(!scrollStore.ignoreScrollCallbacks){
      if(clientY < initialTouch){
        onScrollDown();
      } else if(clientY > initialTouch){
        onScrollUp();
      }
    }
  }

  watch(() => scrollStore.ignoreScrollCallbacks, (val) => {
    if(val){
      window.removeEventListener('wheel', onWheel)
      // window.removeEventListener('touchmove', onTouchMove)
    } else {
      window.addEventListener('wheel', onWheel)
      // window.addEventListener('touchmove', onTouchMove)
    }
  }, { immediate: true })


  onMounted(() => {
    window.addEventListener('wheel', onWheel);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
  });

  onUnmounted(() => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
  });
}
