import { ref, onMounted, onUnmounted } from 'vue';

export function useScrollNavbar(initialVisibility = true, scrollThreshold = 10) {
    const isNavbarVisible = ref(initialVisibility);
    const isHoveringNavbar = ref(false);
    let lastScrollY = 0;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Always show navbar at the top of the page
        if (currentScrollY === 0) {
            isNavbarVisible.value = true;
            lastScrollY = currentScrollY;
            return;
        }

        // Calculate scroll difference
        const scrollDelta = currentScrollY - lastScrollY;

        if (scrollDelta > scrollThreshold && !isHoveringNavbar.value) {
            isNavbarVisible.value = false;
        }
        // If scrolling up beyond threshold, show navbar
        else if (scrollDelta < -scrollThreshold) {
            isNavbarVisible.value = true;
        }

        lastScrollY = currentScrollY;
    };

    const handleMouseEnter = () => {
        isHoveringNavbar.value = true;
        isNavbarVisible.value = true;
    };

    const handleMouseLeave = () => {
        isHoveringNavbar.value = false;
        // If not at the top and scrolling down, hide navbar
        if (window.scrollY > 0 && window.scrollY > lastScrollY) {
            isNavbarVisible.value = false;
        }
    };

    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
    });

    return {
        isNavbarVisible,
        handleMouseEnter,
        handleMouseLeave
    };
}