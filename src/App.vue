<template>
  <Transition name="slide-down">
    <header v-show="showNavbar" :class="floatingNavbar || !showNavbar ? 'floating-navbar' : ''">
      <div class="wrapper">
        <nav>
          <Navbar />
        </nav>
      </div>
    </header>
  </Transition>

  <main class="view-container"> 
    <RouterView v-slot="{ Component, route }">
      <Transition name="slide">
        <component
          :is="Component"
          :key="route.path"
          class="page-container"
          :class="{ 'full-width': $route.meta.fullWidthPage }"
        />
      </Transition>
    </RouterView>
  </main>

  <Transition name="slide-up">
    <footer v-show="showFooter" :class="floatingFooter || !showFooter ? 'floating-footer' : ''">
      <Footer />
    </footer>
  </Transition>
</template>


<script setup>
import { ref, watch, computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

let route = useRoute();

let showFooter = ref(true);
let showNavbar = ref(true);
let floatingFooter = ref(true);
let floatingNavbar = ref(true);
watch(
  () => route.name,
  (newVal) => {
    // console.log("VAL", route.meta);
    showFooter.value = route.meta.hasFooter;
    showNavbar.value = route.meta.hasNavbar;
    floatingFooter.value = route.meta.floatingFooter;
    floatingNavbar.value = route.meta.floatingNavbar;
  }
);
// const mainContentStyle = computed(() => {
//   return {
//     paddingTop: showNavbar.value && floatingNavbar.value ? '60px' : '0',
//     paddingBottom: showFooter.value && floatingFooter.value ? '60px' : '0',
//   };
// });
console.log("RouterView", route);
</script>

<style lang="scss" scoped>
footer{
  z-index: 2;
}
header{
  z-index: 2;
}
.view-container {
  flex: 1;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100vh !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.page-container {
  height: 100%; /* Ensure the content fills the parent container */
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  // width: 90%;
  margin: auto;
  transition: width 0.2s ease;
  &.full-width {
    width: 100%;
    margin: 0;
  }
}

.floating-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transform: translateY(0);
}

.floating-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transform: translateY(0);
  /* Adjust padding-bottom on .view-container when footer is floating */
}
/* Transition styles */
.slide-enter-active,
.slide-leave-active {
  position: absolute;
  width: 100%;
  height: 100%; /* Fill the height of the .view-container */
  top: 0;
  left: 0;
  transition: transform 0.7s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-enter-to {
  transform: translateX(0%);
}

.slide-leave-from {
  transform: translateX(0%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
// HEADER
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 1s 0.2s ease, opacity 1s 0.2s ease;
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

// FOOTER
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 1s 0.2s ease, opacity 1s 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
