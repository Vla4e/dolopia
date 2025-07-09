<template>

  <!-- <img class="mobile-background" v-if="isMobile" src="@/assets/landing/landing-mobile-edited.png"/> -->
  <Transition name="slide-down">
    <header v-show="showNavbar" :class="floatingNavbar || !showNavbar ? 'floating-navbar' : ''">
      <div class="wrapper">
        <nav>
          <Navbar />
        </nav>
      </div>
    </header>
  </Transition>
    <!-- Uses emitter 'showErrorPopup' for v-if flag within ErrorPopup component -->
  <Transition name="fade">
    <ErrorPopup />
  </Transition>

  <Transition name="sidebar">
    <Sidebar v-if="showSidebar"/>
  </Transition>

  <Transition name="contact-form">
    <ContactForm v-if="showContactForm"/>
  </Transition>

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


<script setup>
import { ref, watch, computed, provide, onMounted, inject, onBeforeMount, onBeforeUnmount } from "vue";
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
  // console.log("COMPUTING", menuStore.showContactForm)
  return menuStore.showContactForm
})

import { useScreenSize } from './composables/useScreenSize'
const { isMobile, isTablet, isDesktop } = useScreenSize()
provide('screenSize', { isMobile, isTablet, isDesktop })

const emitter = inject('emitter')
let mountFinished = ref(false)
emitter.on('mountFinished', (e) => {
  // console.log("Mount finished")
  setTimeout(() => {
    mountFinished.value = true

  }, 700)
})
onMounted(() => {
  console.log("Window =================", window.innerWidth, window.innerHeight)
})
onBeforeUnmount(() => {
  emitter.off('mountFinished')
})
let route = useRoute();
let showFooter = ref(true);
let showNavbar = ref(true);
let floatingFooter = ref(true);
let floatingNavbar = ref(true);
let computedTransition = ref('');
watch(
  () => route.name,
  (newVal) => {
    // // console.log("VAL", route.meta);
    if(isMobile.value){
      showNavbar.value = route.meta.hasNavbarMobile;
      floatingNavbar.value = route.meta.floatingNavbarMobile;

    } else {
      showNavbar.value = route.meta.hasNavbar;
      floatingNavbar.value = route.meta.floatingNavbar;
    }
    showFooter.value = route.meta.hasFooter;
    floatingFooter.value = route.meta.floatingFooter;
    
    if(isMobile.value){
      floatingNavbar.value = true;
    }
    // console.log("Route name", route.name)
    if(route.name !== 'home'){
      computedTransition.value = 'slide'
    }
  }
);

</script>

<style lang="scss" scoped>
// .mobile-background{
//   height: 100%;
//   max-width: 100%;
//   position: absolute;
// }
.project-cards-container{
  @media(max-width:450px){
    margin-top: 20px;
  }
}
footer{
  z-index: 2;
}
header{
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
  height: 100%; /* Ensure the content fills the parent container */
  min-height: 100vh;
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

//Page Slide
.slide-enter-active,
.slide-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
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
