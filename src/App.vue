<script setup>
import { ref, watch, computed, provide, onMounted, inject, onBeforeUnmount, nextTick } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import Sidebar from "./components/Sidebar/Sidebar.vue";
import ProjectCatalogMobile from "./components/ProjectCatalogMobile.vue";
import ContactForm from "./components/ContactForm/ContactForm.vue";
import ErrorPopup from "./components/ErrorPopup/ErrorPopup.vue";

import { useMenuStore } from "./store/menu";
const menuStore = useMenuStore()
let showSidebar = computed(() => {
  return menuStore.showSidebar
})
let showContactForm = computed(() => {
  return menuStore.showContactForm
})

import { useScreenSize } from './composables/useScreenSize'
const { isMobile, isTablet, isDesktop } = useScreenSize()
provide('screenSize', { isMobile, isTablet, isDesktop })

const emitter = inject('emitter')
let mountFinished = ref(false)
emitter.on('mountFinished', (e) => {
  setTimeout(() => {
    mountFinished.value = true
  }, 700)
})

onBeforeUnmount(() => {
  emitter.off('mountFinished')
})

let route = useRoute();

// Scroll position preservation
let savedScrollPosition = ref(0);
let viewContainer = ref(null);

const preserveScrollPosition = () => {
  if (viewContainer.value) {
    savedScrollPosition.value = viewContainer.value.scrollTop;
  }
};

const restoreScrollPosition = () => {
  if (viewContainer.value && savedScrollPosition.value > 0) {
    nextTick(() => {
      viewContainer.value.scrollTop = savedScrollPosition.value;
      savedScrollPosition.value = 0;
    });
  }
};

watch(
  () => route.name,
  (newRoute, oldRoute) => {
    // Preserve scroll position before route change
    if (oldRoute) {
      preserveScrollPosition();
    }
    
    // Restore scroll position after transition
    setTimeout(() => {
      restoreScrollPosition();
    }, 550); // Slightly after transition completes
  },
  { immediate: true }
);
</script>

<template>
  <Transition name="fade">
    <ErrorPopup />
  </Transition>

  <Transition name="sidebar">
    <Sidebar v-if="showSidebar"/>
  </Transition>

  <Transition name="contact-form">
    <ContactForm v-if="showContactForm"/>
  </Transition>

  <Navbar />

  <main class="view-container" ref="viewContainer"> 
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

  <ProjectCatalogMobile v-if="isMobile && route.name === 'home' && mountFinished"/>

  <Footer />

</template>

<style lang="scss" scoped>
.project-cards-container{
  @media(max-width:450px){
    margin-top: 20px;
  }
}
footer{
  z-index: 2;
}
.view-container {
  flex: 1;
  overflow: hidden;
  width: 100%;
  min-height: 100vh !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  @media(min-width: 451px){
    // position: absolute;
  }
  @media(max-width: 450px){
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
.page-container {
  height: 100%;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  transition: width 0.2s ease;
  &.full-width {
    width: 100%;
    margin: 0;
  }
}

.floating-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transform: translateY(0);
}

/* Transitions */
/* Page Slide */
.slide-enter-active {
  transition: transform 0.5s linear;
  position: relative;
  z-index: 2;
}

.slide-leave-active {
  transition: transform 0.5s linear;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
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


// Sidebar
.sidebar-enter-active, 
.sidebar-leave-active{
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.sidebar-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.sidebar-enter-to, 
.sidebar-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

// Contact Form
.contact-form-enter-active, .contact-form-leave-active{
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.contact-form-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.contact-form-enter-to, .contact-form-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.contact-form-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

//Modal animation
.fade-enter-active, .fade-leave-active{
  transition: opacity 0.3s ease-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}
</style>