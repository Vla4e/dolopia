<script setup>
import BurgerIcon from './BurgerIcon.vue';
import { inject, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useMenuStore } from '@/store/menu';
import { useScrollNavbar } from '@/composables/useScrollNavbar.js';

const menuStore = useMenuStore()
function toggleContactForm(){
  menuStore.setContactFormFlag(true)
}

const { isMobile } = inject('screenSize');
const route = useRoute();

const { isNavbarVisible, handleMouseEnter, handleMouseLeave } = useScrollNavbar(true);

let showNavbarRouteMeta = ref(true);
let floatingNavbar = ref(true);

watch(
  () => route.name,
  () => {
    console.log("alrighty is navbar scrollable and floating:", route.meta.floatingNavbar)
    if (isMobile.value) {
      showNavbarRouteMeta.value = route.meta.hasNavbarMobile;
      floatingNavbar.value = route.meta.floatingNavbarMobile;
    } else {
      showNavbarRouteMeta.value = route.meta.hasNavbar;
      floatingNavbar.value = route.meta.floatingNavbar;
    }

    if (isMobile.value) {
      floatingNavbar.value = true;
    }
  },
  { immediate: true }
);

const finalShowNavbar = computed(() => {
    return showNavbarRouteMeta.value && isNavbarVisible.value;
});

const finalFloatingNavbar = computed(() => {
  if (isMobile.value) {
    return true; // Mobile navbar is always floating
  } else {
    return floatingNavbar.value || !isNavbarVisible.value;
  }
});

</script>

<template>
  <Transition name="slide-down">
    <header
      v-show="finalShowNavbar"
      :class="finalFloatingNavbar ? 'floating-navbar' : ''"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="nav-wrapper">
        <nav>
          <div class="navbar">
            <BurgerIcon v-if="isMobile" />
            <router-link to="/">
              <img src="@/assets/dolopia-logo-black.png" alt="Dolopia logo" class="navbar-logo" />
            </router-link>
            <div v-if="!isMobile" class="link-container">
              <router-link to="/" class="navbar-link">
                Home
              </router-link>
              <router-link to="/catalog" class="navbar-link">
                Projects
              </router-link>
              <router-link to="/about" class="navbar-link">
                About
              </router-link>
              <div @click="toggleContactForm()" class="navbar-link">
                Contact
              </div>
            </div>
            <img v-if="!menuStore.showContactForm" src="@/assets/search-icon.png" style="opacity: 0.1;" class="search-icon"/>
          </div>
        </nav>
      </div>
    </header>
  </Transition>
</template>

<style lang="scss" scoped>
header{
  z-index: 2;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 80%,
    rgba(255, 255, 255, 0.01) 100% // Changed to 0.01 opacity
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.navbar{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin: auto;
  padding-top: 2vh;
  padding-bottom: 2vh;
  padding-right: 2vw;
  z-index: 2;
  .navbar-logo{
    max-height: 62px;
    margin-right: 20px;
  }
  .link-container{
    display: flex;
    .navbar-link{
      font-family: 'Century Gothic';
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      color: #000000;
      margin-right: 30px;
      padding: 0px;
      cursor:pointer;
      transition: transform 0.1s ease-out;
      &:hover{
        transform: scale(1.25);
      }
      &.disabled{
        pointer-events: none;
      }
    }
  }
  .search-icon{
    justify-self: flex-end;
    margin-left: auto;
    max-height: 30px;
    opacity: 0.1;
  }
}

@media(max-width: 450px){
  .navbar{
    justify-content: space-between;
    padding: 10px;
    .navbar-logo{
      margin-right: 0;
    }
    .search-icon{
      margin-left: 0;
    }
  }
}

/* Transitions */
// Navbar slide down
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.4s ease-out, opacity 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.floating-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  // transform: translateY(0);
}
</style>