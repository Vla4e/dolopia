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

  const handleScroll = (event) => {
    const element = event.target;
    
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + scrollThreshold;
    
    isAtTop.value = atTop;
    isAtBottom.value = atBottom;
    
    // Enable global scroll callbacks when at boundaries
    if (atTop || atBottom) {
      scrollStore.ignoreScrollCallbacks = false;
    } else {
      // Disable global scroll callbacks when scrolling within content
      scrollStore.ignoreScrollCallbacks = true;
    }
  };


  const handleWheel = (event) => {
    const element = event.currentTarget;
    
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + scrollThreshold;
    

    if (event.deltaY < 0 && atTop) {
      scrollStore.ignoreScrollCallbacks = false;
      return;
    }
    

    if (event.deltaY > 0 && atBottom) {
      scrollStore.ignoreScrollCallbacks = false;
      return;
    }
    
    // Scrolling within content
    scrollStore.ignoreScrollCallbacks = true;
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
    
    initializeScrollablePhase,
    initializeStaticPhase,
    cleanup
  };
}