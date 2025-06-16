import { 
  ref, 
  computed,
  watch,
  watchEffect,
  onMounted,
  onBeforeUnmount
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
    const maxTranslate = 0;
    const minTranslate = -(itemWidth.value * (props.awardedItems.length - 1));
    translateValue.value = Math.max(Math.min(translateValue.value, maxTranslate), minTranslate);
  }

  // Update item fade effect
  function updateItemFadeEffect() {
    if (!carouselAnimationContainer.value || !carouselContent.value) return;

    const containerRect = carouselAnimationContainer.value.getBoundingClientRect();
    const containerLeft = containerRect.left;
    const containerRight = containerRect.right;
    const containerWidth = containerRect.width;

    const fadeThreshold = containerWidth * 0.05; // 5% of container width for fade effect

    const carouselItems = carouselContent.value.querySelectorAll('.carousel-item');
    carouselItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemLeft = itemRect.left;
      const itemRight = itemRect.right;

      let opacity = 1;
      let scale = 1;

      // Calculate fade for left side
      if (itemLeft < containerLeft + fadeThreshold) {
        const overlap = (containerLeft + fadeThreshold) - itemLeft;
        opacity = Math.max(0, 1 - (overlap / fadeThreshold));
        scale = Math.max(0.8, 1 - (overlap / fadeThreshold) * 0.05);
      }
      // Calculate fade for right side
      else if (itemRight > containerRight - fadeThreshold) {
        const overlap = itemRight - (containerRight - fadeThreshold);
        opacity = Math.max(0, 1 - (overlap / fadeThreshold));
        scale = Math.max(0.8, 1 - (overlap / fadeThreshold) * 0.05);
      }

      itemDynamicStyles.value[index] = {
        opacity: opacity.toFixed(3),
        transform: `scale(${scale.toFixed(3)})`,
      };
    });
  }

  // Drag functionality
  function startDrag(event) {
    if (isMobile.value) return;
    event.preventDefault();
    isDragging.value = true;
    startX.value = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    previousTranslate.value = translateValue.value;
    moved.value = false;

    document.body.classList.add('dragging');
    carouselContent.value.style.transition = 'none';

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
    
    if (Math.abs(deltaX) > 5) {
      moved.value = true;
    } else {
      moved.value = false;
    }
    
    if (moved.value) {
      event.preventDefault();
    }

    // Calculate the velocity
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime.value;
    velocity.value = (translateValue.value - lastTranslateValue.value) / deltaTime;
    lastTranslateValue.value = translateValue.value;
    lastTime.value = currentTime;
  }

  function endDrag(event) {
    if (!isDragging.value) return;
    isDragging.value = false;

    console.log("Moved enddrag", moved.value);
    if (moved.value) {
      event.preventDefault();
    }

    document.body.classList.remove('dragging');

    // Remove event listeners
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', onMouseMove, { passive: false });
    document.removeEventListener('touchend', endDrag);

    snapToNearest();
  }

  function snapToNearest() {
    const maxTranslate = 0;
    const minTranslate = -(itemWidth.value * (props.awardedItems.length - 1));

    const snapPosition = Math.round(translateValue.value / itemWidth.value) * itemWidth.value;
    translateValue.value = Math.max(Math.min(snapPosition, maxTranslate), minTranslate);

    carouselContent.value.style.transition = 'transform 0.3s ease';
  }

  // Resize handler
  function resizeTriggeredFunctions(event) {
    calculateItemWidth(event);
    updateItemFadeEffect(event);
  }

  // Watchers
  watchEffect(() => {
    calculateItemWidth();
    updateTranslateBounds();
  });

  watch(translateValue, () => {
    requestAnimationFrame(updateItemFadeEffect);
  });

  // Lifecycle
  onMounted(() => {
    calculateItemWidth();
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
    
    // Methods
    startDrag,
    onMouseMove,
    endDrag,
    calculateItemWidth,
    updateItemFadeEffect
  };
}