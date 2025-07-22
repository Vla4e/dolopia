import { ref, onMounted, onUnmounted } from 'vue';

export function useScrollFooter(initialVisibility = true, scrollThreshold = 10) {
    const isFooterVisible = ref(initialVisibility);
    const isHoveringFooter = ref(false);
    let lastScrollY = 0;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;

        // Always show footer at the top or bottom of the page
        if (currentScrollY === 0 || windowHeight + currentScrollY >= pageHeight - 50) {
            isFooterVisible.value = true;
            lastScrollY = currentScrollY;
            return;
        }

        // Calculate scroll difference
        const scrollDelta = currentScrollY - lastScrollY;

        if (scrollDelta > scrollThreshold && !isHoveringFooter.value) {
            isFooterVisible.value = false;
        }
        
        // If scrolling up beyond threshold, show footer
        else if (scrollDelta < -scrollThreshold) {
            isFooterVisible.value = true;
        }

        lastScrollY = currentScrollY;
    };

    const handleMouseEnter = () => {
        isHoveringFooter.value = true;
        isFooterVisible.value = true;
    };

    const handleMouseLeave = () => {
        isHoveringFooter.value = false;
        // If not at the top or bottom and scrolling down, hide footer
        if (window.scrollY > 0 && window.scrollY > lastScrollY) {
            isFooterVisible.value = false;
        }
    };

    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
    });

    return {
        isFooterVisible,
        handleMouseEnter,
        handleMouseLeave
    };
}