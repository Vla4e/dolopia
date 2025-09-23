// composables/useWithinPhaseScroll.js
import { ref, nextTick, onUnmounted } from 'vue';
import { useScrollStore } from '@/store/scroll.js';

/**
 * Composable for handling scroll behavior within scrollable phases
 * Manages the transition between phase scrolling and internal content scrolling
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
  
  // Track if user has touched boundaries
  const hasTouchedTop = ref(false);
  const hasTouchedBottom = ref(false);

  const handleScroll = (event) => {
    const element = event.target;
    
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + scrollThreshold;
    
    isAtTop.value = atTop;
    isAtBottom.value = atBottom;
    
    // Mark boundaries as touched when reached
    if (atTop) {
      hasTouchedTop.value = true;
    }
    if (atBottom) {
      hasTouchedBottom.value = true;
    }
    
    // Always disable callbacks when not at boundaries
    if (!atTop && !atBottom) {
      scrollStore.ignoreScrollCallbacks = true;
    }
  };

  const handleWheel = (event) => {
    const element = event.currentTarget;
    
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + scrollThreshold;
    
    // Handle upward scroll at top boundary
    console.log("scrolling", event.deltaY, atTop, scrollStore.ignoreScrollCallbacks)
    if (event.deltaY < 0 && atTop) {
      // Only allow callbacks if user has previously touched the top
      if (hasTouchedTop.value) {
        scrollStore.ignoreScrollCallbacks = false;
      }
      return;
    }
    
    // Handle downward scroll at bottom boundary  
    if (event.deltaY > 0 && atBottom) {
      // Only allow callbacks if user has previously touched the bottom
      if (hasTouchedBottom.value) {
        scrollStore.ignoreScrollCallbacks = false;
      }
      return;
    }
    
    // Scrolling within content
    scrollStore.ignoreScrollCallbacks = true;
  };

  const initializeScrollablePhase = async (customSelector = null) => {
    await nextTick();
    
    const selector = customSelector || containerSelector;
    console.log("SCROLLABLE INITIATED")
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
    
    scrollStore.ignoreScrollCallbacks = true;

    element.addEventListener('scroll', handleScroll);
    element.addEventListener('wheel', handleWheel, { passive: true });

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
      containerElement.value = null;
    }

    // Reset boundary tracking
    hasTouchedTop.value = false;
    hasTouchedBottom.value = false;
    
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
    
    initializeScrollablePhase,
    initializeStaticPhase,
    cleanup
  };
}