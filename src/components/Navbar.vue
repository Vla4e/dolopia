<script setup>
import dolopiaLogo from "@/assets/dolopia.png";
import dolopiaLogoBlack from "@/assets/dolopia-logo-black.png";

import BurgerIcon from "./BurgerIcon.vue";
import Search from "./Search.vue";

import { inject, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

import { useMenuStore } from "@/store/menu";
import { useScrollNavbar } from "@/composables/useScrollNavbar.js";

const menuStore = useMenuStore();
function toggleContactForm() {
  menuStore.setContactFormFlag(true);
}

const { isMobile } = inject("screenSize");
const route = useRoute();

//handleMouseEnter shows navbar, handleMouseLeave fades it
const { isNavbarVisible, handleMouseEnter, handleMouseLeave } = useScrollNavbar(true);

let showNavbarRouteMeta = ref(true);
let floatingNavbar = ref(true);
let pinnedNavbar = ref(false);
let navbarBlur = ref(true);

watch(
  () => route.name,
  (newVal) => {
    const navbarMeta = isMobile.value
      ? route.meta.navbar?.mobile
      : route.meta.navbar?.desktop;


    if (navbarMeta) {
      showNavbarRouteMeta.value = navbarMeta.show;
      floatingNavbar.value = navbarMeta.floating;
      pinnedNavbar.value = navbarMeta.pinned;
    } else {
      // Fallback to default values
      showNavbarRouteMeta.value = true;
      floatingNavbar.value = true;
      pinnedNavbar.value = false;
    }

    // Mobile navbar is always floating
    if (isMobile.value) {
      floatingNavbar.value = true;
    }
    if (newVal === "about") {
      navbarBlur.value = false;
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

const navbarClasses = computed(() => {
  const classes = [];

  if (finalFloatingNavbar.value) {
    classes.push("floating-navbar");
  }
  if (pinnedNavbar.value) {
    classes.push("pinned");
  }

  if (!navbarBlur.value) {
    classes.push("no-blur");
  }

  return classes.join(" ");
});

let navbarStyle = ref("dark"); //light - dark

</script>

<template>
  <Transition name="slide-down">
    <header
      v-show="finalShowNavbar"
      :class="navbarClasses"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="nav-wrapper">
        <nav>
          <div class="navbar">
            <BurgerIcon v-if="isMobile" />
            <router-link to="/">
              <img
                :src="navbarStyle === 'light' ? dolopiaLogo : dolopiaLogoBlack"
                alt="Dolopia logo"
                class="navbar-logo"
              />
            </router-link>
            <div v-if="!isMobile" class="link-container">
              <router-link to="/" class="navbar-link"> Home </router-link>
              <router-link to="/catalog" class="navbar-link"> Projects </router-link>
              <router-link to="/all-products" class="navbar-link"> Products </router-link>
              <router-link to="/about" class="navbar-link"> About </router-link>
              <div @click="toggleContactForm()" class="navbar-link">Contact</div>
            </div>
            <!-- <img v-if="!menuStore.showContactForm" src="@/assets/search-icon.png" style="opacity: 0.1;" class="search-icon"/> -->
            <Search v-if="!menuStore.showContactForm && !isMobile"></Search>
          </div>
        </nav>
      </div>
    </header>
  </Transition>
</template>

<style lang="scss" scoped>
header {
  z-index: 2;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 80%,
    rgba(255, 255, 255, 0.01) 100% // Changed to 0.01 opacity
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  &.no-blur {
    background: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

.navbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin: auto;
  padding-top: 2vh;
  padding-bottom: 2vh;
  padding-right: 2vw;
  z-index: 2;
  .navbar-logo {
    max-height: 62px;
    margin-right: 20px;
  }
  .link-container {
    display: flex;
    .navbar-link {
      font-family: "Century Gothic";
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      color: #000000;
      margin-right: 30px;
      padding: 0px;
      cursor: pointer;
      transition: transform 0.1s ease-out;
      &:hover {
        transform: scale(1.25);
      }
      &.disabled {
        pointer-events: none;
      }
    }
  }
  .search-icon {
    justify-self: flex-end;
    margin-left: auto;
    max-height: 30px;
    opacity: 0.1;
  }
  &.light {
    .link-container {
      .navbar-link {
        color: white;
      }
    }
  }
}

.floating-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  &.pinned {
    position: absolute !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.9) 100%
    );
  }
}
.pinned {
}

@media (max-width: 450px) {
  .navbar {
    justify-content: space-between;
    padding: 10px;
    .navbar-logo {
      margin-right: 0;
    }
    .search-icon {
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
</style>
