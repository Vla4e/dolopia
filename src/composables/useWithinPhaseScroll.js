// composables/useWithinPhaseScroll.js
import { ref, nextTick, onUnmounted } from 'vue';
import { useScrollStore } from '@/store/scroll.js';

/**
 * Composable manages transition between phase scrolling and internal content scrolling
 */
export function useWithinPhaseScroll(options = {}) {
  const {
    containerSelector = null,
    scrollThreshold = 5,
    onPhaseEnter = null,
    onPhaseExit = null
  } = options;

  const scrollStore = useScrollStore();
  const isAtTop = ref(true);
  const isAtBottom = ref(false);
  const containerElement = ref(null);
  
  // Track if touched boundaries
  const hasTouchedTop = ref(false);
  const hasTouchedBottom = ref(false);
  
  const touchStartY = ref(0);
  const isTouchScrolling = ref(false);

  const handleScroll = (event) => {
    // Skip scroll handling if currently touch scrolling to avoid duplicates
    if (isTouchScrolling.value) {
      return;
    }
    
    console.log("handleScroll")
    const element = event.target;
    
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + scrollThreshold;
    
    isAtTop.value = atTop;
    isAtBottom.value = atBottom;
    
    if (atTop) {
      hasTouchedTop.value = true;
    }
    if (atBottom) {
      hasTouchedBottom.value = true;
    }
    
    // disable phase transition callbacks when not at top/bottom
    if (!atTop && !atBottom) {
      scrollStore.ignoreScrollCallbacks = true;
    }
  };

  const handleWheel = (event) => {
    // console.log("handleWheel")
    const element = event.currentTarget;
    
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + scrollThreshold;
    
    // upward scroll at top boundary
    // console.log("event.deltaY:", event.deltaY,"atTop:", atTop,"ignoreCallbacks", scrollStore.ignoreScrollCallbacks,"hasTouched", hasTouchedTop.value)
    if (event.deltaY < 0 && atTop) {
      if (hasTouchedTop.value) {
        scrollStore.ignoreScrollCallbacks = false;
      }
      return;
    }
    
    // downward scroll at bottom boundary
    if (event.deltaY > 0 && atBottom) {
      if (hasTouchedBottom.value) {
        scrollStore.ignoreScrollCallbacks = false;
      }
      return;
    }
    
    scrollStore.ignoreScrollCallbacks = true;
  };

  const handleTouchStart = (event) => {
    console.log("handleTouchStart")
    touchStartY.value = event.touches[0].clientY;
    isTouchScrolling.value = false;
  };

  const handleTouchMove = (event) => {
    // console.log("handleTouchMove")
    const element = event.currentTarget;
    const currentY = event.touches[0].clientY;
    const deltaY = touchStartY.value - currentY; // Positive = scrolling down, negative = scrolling up
    
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + scrollThreshold;
    
    // duplicate scroll event handling
    isTouchScrolling.value = true;
    
    isAtTop.value = atTop;
    isAtBottom.value = atBottom;
    
    if (atTop) {
      hasTouchedTop.value = true;
    }
    if (atBottom) {
      hasTouchedBottom.value = true;
    }
    
    // upward scroll at top boundary
    // console.log("deltaY:", deltaY, "atTop:", atTop, "ignoreCallbacks", scrollStore.ignoreScrollCallbacks, "hasTouched", hasTouchedTop.value)
    if (deltaY < 0 && atTop) {
      if (hasTouchedTop.value) {
        scrollStore.ignoreScrollCallbacks = false;
      }
      return;
    }
    
    // downward scroll at bottom boundary
    if (deltaY > 0 && atBottom) {
      if (hasTouchedBottom.value) {
        scrollStore.ignoreScrollCallbacks = false;
      }
      return;
    }
    
    scrollStore.ignoreScrollCallbacks = true;
  };

  const handleTouchEnd = (event) => {
    console.log("handleTouchEnd")
    // Reset touch scrolling flag after a short delay to ensure scroll events are properly ignored
    setTimeout(() => {
      isTouchScrolling.value = false;
    }, 100);
  };

  const initializeScrollablePhase = async (customSelector = null) => {
    await nextTick();
    
    const selector = customSelector || containerSelector;
    if (!selector) {
      console.warn('useWithinPhaseScroll: No container selector provided');
      return;
    }

    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`useWithinPhaseScroll: Container not found with selector: ${selector}`);
      return;
    }

    containerElement.value = element;
    
    // Reset scroll position and state
    element.scrollTop = 0;
    isAtTop.value = true;
    isAtBottom.value = false;
    
    // Reset boundary touch tracking
    hasTouchedTop.value = false;
    hasTouchedBottom.value = false;
    
    isTouchScrolling.value = false;
    
    scrollStore.ignoreScrollCallbacks = true;

    element.addEventListener('scroll', handleScroll);
    element.addEventListener('wheel', handleWheel, { passive: true });
    
    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    if (onPhaseEnter) {
      onPhaseEnter({ element, isAtTop, isAtBottom });
    }
  };

  // Initialize non-scrollable phase
  const initializeStaticPhase = () => {
    // Enable global scroll callbacks for normal phase cycling
    scrollStore.ignoreScrollCallbacks = false;

    if (onPhaseEnter) {
      onPhaseEnter({ isAtTop, isAtBottom });
    }
  };

  const cleanup = () => {
    if (containerElement.value) {
      containerElement.value.removeEventListener('scroll', handleScroll);
      containerElement.value.removeEventListener('wheel', handleWheel);
      
      containerElement.value.removeEventListener('touchstart', handleTouchStart);
      containerElement.value.removeEventListener('touchmove', handleTouchMove);
      containerElement.value.removeEventListener('touchend', handleTouchEnd);
      
      containerElement.value = null;
    }

    // Reset boundary tracking
    hasTouchedTop.value = false;
    hasTouchedBottom.value = false;
    
    // Reset touch state
    isTouchScrolling.value = false;
    
    scrollStore.ignoreScrollCallbacks = false;
    
    // Call exit callback if provided
    if (onPhaseExit) {
      onPhaseExit();
    }
  };

  onUnmounted(() => {
    cleanup();
  });

  return {
    isAtTop,
    isAtBottom,
    containerElement,
    hasTouchedTop,
    hasTouchedBottom,
    isTouchScrolling,
    
    initializeScrollablePhase,
    initializeStaticPhase,
    cleanup
  };
}