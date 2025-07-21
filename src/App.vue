<script setup>
import { ref, watch, computed, provide, onMounted, inject, onBeforeUnmount } from "vue";
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
let showFooter = ref(true);
let floatingFooter = ref(true);
let computedTransition = ref('');

watch(
  () => route.name,
  () => {
    // Update footer visibility and floating status based on route meta
    showFooter.value = route.meta.hasFooter;
    floatingFooter.value = route.meta.floatingFooter;

    computedTransition.value = 'slide';
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

  <main class="view-container"> 
    <RouterView v-slot="{ Component, route }">
      <Transition :name="computedTransition">
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

  <Transition name="slide-up">
    <footer v-show="showFooter && !isMobile" :class="floatingFooter || !showFooter ? 'floating-footer' : ''">
      <Footer />
    </footer>
  </Transition>
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
  height: 100vh !important;
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
  // margin: auto;
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
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: transform 0.5s linear;
}
.slide-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: transform 0.5s linear;
}

.slide-enter-from {
  transform: translateX(100%);
  z-index: 2;
}

.slide-enter-to {
  transform: translateX(0%);
  z-index: 2;
}

.slide-leave-from {
  transform: translateX(0%);
  z-index: 1;
}

.slide-leave-to {
  transform: translateX(0%);
  z-index: 1;
}


// FOOTER slide up
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