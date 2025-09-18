<script setup>
// App.vue
//Vue
import { ref, computed, provide, inject, onBeforeUnmount, nextTick, watch } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";

let route = useRoute();
let router = useRouter();
let isRoutingToAboutView = ref(false);
router.beforeResolve((to, from) => {
  console.log("TO META", to.meta)
  if (to.name === "about") {
    isRoutingToAboutView.value = true;
  }
});
//Components
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import Sidebar from "./components/Sidebar/Sidebar.vue";
import ProjectCatalogMobile from "./components/ProjectCatalogMobile.vue";
import ContactForm from "./components/ContactForm/ContactForm.vue";
import ErrorPopup from "./components/ErrorPopup/ErrorPopup.vue";

//Stores
import { useMenuStore } from "./store/menu";
const menuStore = useMenuStore();
let showSidebar = computed(() => {
  return menuStore.showSidebar;
});
let showContactForm = computed(() => {
  return menuStore.showContactForm;
});

//Composables
import { useScreenSize } from "./composables/useScreenSize";
const { isMobile, isTablet, isDesktop } = useScreenSize();
provide("screenSize", { isMobile, isTablet, isDesktop });

//Eventbus
const emitter = inject("emitter");
let mountFinished = ref(false);
emitter.on("mountFinished", (e) => {
  setTimeout(() => {
    mountFinished.value = true;
  }, 700);
});
onBeforeUnmount(() => {
  emitter.off("mountFinished");
});

//Transition optimization and smoothness
import { useTransitionStore } from "./store/transition";
const transitionStore = useTransitionStore();
const routerWrapper = ref(null);

const onBeforeLeave = (el) => {
  // window.scrollTo({
  //   top: 0,
  //   // behavior: "smooth",
  // });
  if (isRoutingToAboutView.value) return;
  console.log("OnBeforeLeave, route ->", route.name);
  if (routerWrapper.value && el) {
    const rect = el.getBoundingClientRect();

    el.style.position = "absolute";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "100%";
    console.log("I set the height -> ", routerWrapper.value.style.minHeight);
  }
};

const onBeforeEnter = (el) => {
  console.log("onBeforeEnter, route ->", route.name);

  if (route.name !== "about") {
    transitionStore.setTransitioning(false);
  }
  transitionStore.setTransitioning(true);
  if (el && routerWrapper.value) {
    el.style.position = "absolute";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "100%";
  }
};

const onAfterEnter = (el) => {
  console.log("onAfterEnter, route ->", route.name);
  transitionStore.setTransitioning(false);

  if (routerWrapper.value) {
    routerWrapper.value.style.minHeight = "";
    console.log("Should've set minHeight -> ", routerWrapper.value.style.minHeight);
  }

  if (el) {
    el.style.position = "";
    el.style.top = "";
    el.style.left = "";
    el.style.width = "";
  }
};
</script>

<template>
  <Transition name="fade">
    <ErrorPopup />
  </Transition>

  <Transition name="sidebar">
    <Sidebar v-if="showSidebar" />
  </Transition>

  <Transition name="contact-form">
    <ContactForm v-if="showContactForm" />
  </Transition>

  <Navbar />

  <main class="view-container" ref="viewContainer">
    <div class="router-wrapper" ref="routerWrapper">
      <RouterView v-slot="{ Component, route }">
        <Transition
          name="slide"
          @before-leave="onBeforeLeave"
          @before-enter="onBeforeEnter"
          @after-enter="onAfterEnter"
        >
          <component :is="Component" :key="route.path" class="page-container" />
        </Transition>
      </RouterView>
    </div>
  </main>

  <!-- <ProjectCatalogMobile v-if="isMobile && route.name === 'home' && mountFinished" /> -->

  <Footer />
</template>

<style lang="scss" scoped>
.project-cards-container {
  @media (max-width: 450px) {
    margin-top: 20px;
  }
}
footer {
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

  @media (max-width: 450px) {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.router-wrapper {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.page-container {
  height: 100%;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  @media(max-width: 450px){
    height: auto !important;
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

//Transitions
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
.sidebar-leave-active {
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
.contact-form-enter-active,
.contact-form-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.contact-form-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.contact-form-enter-to,
.contact-form-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.contact-form-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

//Modal animation
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}
</style>
