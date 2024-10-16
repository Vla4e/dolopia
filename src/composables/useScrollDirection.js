/* 
Accepts onScrollUp & onScrollDown callback functions as arguments which trigger based on
scroll direction.
*/
import { onMounted, onUnmounted } from 'vue';

export function useScrollDirection(onScrollUp, onScrollDown) {
  function onWheel(event) {
    if (event.deltaY < 0) { // Scrolling up
      if (typeof onScrollUp === 'function') {
        onScrollUp();
      }
    } else if (event.deltaY > 0) { // Scrolling Down
      if (typeof onScrollDown === 'function') {
        onScrollDown();
      }
    }
  }

  onMounted(() => {
    window.addEventListener('wheel', onWheel);
  });

  onUnmounted(() => {
    window.removeEventListener('wheel', onWheel);
  });
}
