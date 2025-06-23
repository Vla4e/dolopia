// composables/useCarousel.js
import {
  ref,
  computed,
  watch,
  watchEffect,
  onMounted,
  onBeforeUnmount,
  nextTick // Import nextTick for ensuring DOM updates
} from 'vue';

export function useCarousel(props, screenSize) {
  const { isMobile, isTablet } = screenSize;

  // Template refs
  const carouselAnimationContainer = ref(null);
  const carouselContent = ref(null);
  const carousel = ref(null);

  // Carousel state
  const translateValue = ref(0);
  const isDragging = ref(false);
  const startX = ref(0);
  const previousTranslate = ref(0);
  const lastTranslateValue = ref(0);
  const lastTime = ref(0);
  const velocity = ref(0);
  const itemWidth = ref(0);
  const moved = ref(false);

  // Item styles for fade effect
  const itemDynamicStyles = ref({});

  // Computed carousel direction
  const computedCarouselDirection = computed(() => {
    if (isMobile.value) return 'column';
    else return 'row';
  });

  // Calculate item width
  function calculateItemWidth() {
    requestAnimationFrame(() => {
      if (carouselContent.value) {
        const carouselItems = carouselContent.value.querySelectorAll('.carousel-item');
        if (carouselItems.length > 0) {
          itemWidth.value = carouselItems[0].clientWidth;
          updateTranslateBounds();
        }
      }
    });
  }

  // Update translate bounds
  function updateTranslateBounds() {
    // maxTranslate: When the first item (index 0) is at the left edge of the container.
    const maxTranslate = 0;

    // minTranslate: When the last visible item is aligned to the rightmost visible slot.
    // If you always show 3 items (0,1,2), then the last item shown is `props.awardedItems.length - 1`.
    // The offset to show `props.awardedItems.length - 3` at the leftmost position would be:
    // `-( (props.awardedItems.length - 3) * itemWidth.value )`.
    // Example: 5 items (0,1,2,3,4).
    // Max scroll left would show (2,3,4). Item 2 is at containerLeft.
    // So translateValue should be -(2 * itemWidth). This is (5-3) * itemWidth.
    let minTranslate = -(itemWidth.value * (props.awardedItems.length - 3));
    if (props.awardedItems.length <= 3) {
      minTranslate = 0; // No horizontal scroll needed if 3 or fewer items fit in 3 slots.
    }

    translateValue.value = Math.max(Math.min(translateValue.value, maxTranslate), minTranslate);
  }

  // Update item fade effect - This is the core change
  async function updateItemFadeEffect() {
    if (!carouselAnimationContainer.value || !carouselContent.value || itemWidth.value === 0) return;

    // Ensure the DOM has updated with the new translateValue before getting bounding rects
    await nextTick();

    const containerRect = carouselAnimationContainer.value.getBoundingClientRect();
    const containerLeft = containerRect.left;
    const containerRight = containerRect.right;
    const containerWidth = containerRect.width;

    // The fade zone is specifically when an item crosses the container boundary.
    // The fade should happen over a distance, for example, 50% of an item's width as it exits/enters.
    const fadeDistance = itemWidth.value * 0.5; // Fade over half an item's width

    const carouselItems = carouselContent.value.querySelectorAll('.carousel-item');

    // Initialize itemDynamicStyles for all items to ensure no stale values
    // before the loop potentially skips an item or calculates it differently.
    props.awardedItems.forEach((_, index) => {
        if (!itemDynamicStyles.value[index]) {
            itemDynamicStyles.value[index] = { opacity: '1', transform: 'scale(1)' };
        }
    });


    carouselItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemLeft = itemRect.left;
      const itemRight = itemRect.right;

      let opacity = 1;
      let scale = 1;

      // Logic for items moving off-screen to the LEFT
      // Fade out as item moves from `containerLeft` towards `containerLeft - fadeDistance`
      if (itemRight <= containerLeft) {
        // Item is completely off-screen to the left
        opacity = 0;
        scale = 0.8;
      } else if (itemLeft < containerLeft) {
        // Item is partially off-screen to the left (its left edge is beyond containerLeft)
        const distanceIntoLeftFade = containerLeft - itemLeft; // How much of the item is to the left of the container
        const fadeProgress = Math.min(1, distanceIntoLeftFade / fadeDistance); // Scale progress over fadeDistance
        opacity = Math.max(0, 1 - fadeProgress);
        scale = Math.max(0.8, 1 - fadeProgress * 0.2);
      }
      // Logic for items moving off-screen to the RIGHT
      // Fade out as item moves from `containerRight` towards `containerRight + fadeDistance`
      else if (itemLeft >= containerRight) {
        // Item is completely off-screen to the right
        opacity = 0;
        scale = 0.8;
      } else if (itemRight > containerRight) {
        // Item is partially off-screen to the right (its right edge is beyond containerRight)
        const distanceIntoRightFade = itemRight - containerRight; // How much of the item is to the right of the container
        const fadeProgress = Math.min(1, distanceIntoRightFade / fadeDistance); // Scale progress over fadeDistance
        opacity = Math.max(0, 1 - fadeProgress);
        scale = Math.max(0.8, 1 - fadeProgress * 0.2);
      }
      // Item is fully within the visible range of the container
      else {
        opacity = 1;
        scale = 1;
      }

      itemDynamicStyles.value[index] = {
        opacity: opacity.toFixed(3),
        transform: `scale(${scale.toFixed(3)})`,
      };
    });
  }

  // Drag functionality
  function startDrag(event, scrollEnabled) {
    console.log("Got event ====> ", scrollEnabled)
    if(!scrollEnabled) return;
    if (isMobile.value) return;
    event.preventDefault();
    isDragging.value = true;
    startX.value = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    previousTranslate.value = translateValue.value;
    moved.value = false;

    document.body.classList.add('dragging');
    if (carouselContent.value) { // Ensure ref is not null
      carouselContent.value.style.transition = 'none';
    }


    // Use passive: false for touchmove to allow preventDefault
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', onMouseMove, { passive: false });
    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchcancel', endDrag);

    lastTime.value = performance.now();
  }

  function onMouseMove(event) {
    if (!isDragging.value) return;

    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const deltaX = clientX - startX.value;
    translateValue.value = previousTranslate.value + deltaX;

    // Check if enough movement has occurred to consider it a "move" vs. a click
    if (Math.abs(deltaX) > 5) { // Threshold for "moved"
      moved.value = true;
    } else {
      moved.value = false; // Reset if movement falls below threshold
    }

    if (moved.value && event.cancelable) { // Only prevent default if it's a drag and cancelable
      event.preventDefault();
    }

    // Calculate the velocity (optional, for flicking)
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime.value;
    velocity.value = (translateValue.value - lastTranslateValue.value) / deltaTime;
    lastTranslateValue.value = translateValue.value;
    lastTime.value = currentTime;

    // Update fade effect during drag (it's essential it runs here)
    updateItemFadeEffect();
  }

  function endDrag(event) {
    if (!isDragging.value) return;
    isDragging.value = false;

    // Prevent default on mouseup/touchend only if it was a drag (moved)
    // This prevents accidental clicks on items that were dragged
    if (moved.value && event.cancelable) {
      event.preventDefault();
    }

    document.body.classList.remove('dragging');

    // Remove event listeners
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', onMouseMove); // passive: false no longer needed here
    document.removeEventListener('touchend', endDrag);
    document.removeEventListener('touchcancel', endDrag);

    snapToNearest();
  }

  function snapToNearest() {
    // The current item at the left edge of the container should be at translateValue = - (index * itemWidth)
    const currentItemIndex = Math.round(Math.abs(translateValue.value) / itemWidth.value);
    let targetTranslate = -currentItemIndex * itemWidth.value;

    // Apply bounds
    const maxTranslate = 0; // Item 0 aligned with containerLeft
    let minTranslate = -(itemWidth.value * (props.awardedItems.length - 3)); // For 3 items visible
    if (props.awardedItems.length <= 3) {
      minTranslate = 0;
    }

    // Ensure targetTranslate stays within bounds
    targetTranslate = Math.max(Math.min(targetTranslate, maxTranslate), minTranslate);

    // Apply the snapped value
    translateValue.value = targetTranslate;

    // Set transition back on for smooth snapping
    if (carouselContent.value) {
      carouselContent.value.style.transition = 'transform 0.3s ease';
    }
    // Explicitly call update fade effect AFTER the transition has potentially started
    // and the translateValue has updated. Using nextTick is good here.
    nextTick(() => {
        updateItemFadeEffect();
    });
  }

  // Resize handler
  function resizeTriggeredFunctions() {
    calculateItemWidth();
    // No need to explicitly call updateItemFadeEffect here,
    // calculateItemWidth will trigger watchEffect which calls it.
  }

  // Watchers
  watchEffect(() => {
    // This watches for changes to props.awardedItems.length or other dependencies
    // that might affect calculateItemWidth or updateTranslateBounds.
    // It will also trigger updateItemFadeEffect.
    calculateItemWidth(); // This will also call updateTranslateBounds inside
  });

  watch(translateValue, () => {
    // This watch fires whenever translateValue changes (during drag or after snap).
    // It's crucial for keeping the fade effect updated.
    updateItemFadeEffect();
  }, { flush: 'post' }); // Use 'post' to ensure DOM is updated before rect calculation

  // Lifecycle
  onMounted(() => {
    // Initial setup. `translateValue.value = 0` means item 0 is at the left edge.
    // `calculateItemWidth()` will set itemWidth, then `watchEffect` will run
    // which calls `updateTranslateBounds()` and `updateItemFadeEffect()`.
    // This sequence should correctly set the initial fade states.
    calculateItemWidth(); // Triggers first cascade of calculations and updates

    window.addEventListener('resize', resizeTriggeredFunctions);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeTriggeredFunctions);
  });

  return {
    // Template refs
    carouselAnimationContainer,
    carouselContent,
    carousel,

    // State
    translateValue,
    itemDynamicStyles,
    computedCarouselDirection,
    itemWidth,

    // Methods
    startDrag,
    onMouseMove,
    endDrag,
    calculateItemWidth,
    updateItemFadeEffect
  };
}