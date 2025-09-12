<script setup>
import ArrowButton from "@/components/ArrowButton.vue";
import Dropdown from "./Dropdown/Dropdown.vue";
import { computed, ref, watch, inject } from "vue";
import { useRoute } from "vue-router";
import { useScrollFooter } from "@/composables/useScrollFooter.js";

const route = useRoute();
const { isMobile } = inject("screenSize");

const { isFooterVisible, handleMouseEnter, handleMouseLeave } = useScrollFooter(true);

let showFooterRouteMeta = ref(true);
let floatingFooter = ref(true);
let pinnedFooter = ref(false);

watch(
  () => route.name,
  () => {
    const footerMeta = isMobile.value ? route.meta.footer?.mobile : route.meta.footer?.desktop;
    
    if (footerMeta) {
      showFooterRouteMeta.value = footerMeta.show;
      floatingFooter.value = footerMeta.floating;
      pinnedFooter.value = footerMeta.pinned || false;
    } else {
      // Fallback to default values
      showFooterRouteMeta.value = true;
      floatingFooter.value = true;
      pinnedFooter.value = false;
    }
  },
  { immediate: true }
);

const finalShowFooter = computed(() => {
  if (isMobile.value) return false;
  return showFooterRouteMeta.value && isFooterVisible.value;
});

const finalFloatingFooter = computed(() => {
  return floatingFooter.value || !isFooterVisible.value;
});

const footerClasses = computed(() => {
  const classes = [];
  
  if (finalFloatingFooter.value) {
    classes.push('floating-footer');
    
    if (pinnedFooter.value) {
      classes.push('pinned');
    }
  }
  
  return classes.join(' ');
});

let computeShowArrow = computed(() => {
  if (route.meta?.showRouterArrow) {
    return true;
  } else return false;
});

</script>

<template>
  <Transition name="slide-up">
    <footer
      v-show="finalShowFooter"
      :class="footerClasses"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="footer">
        <router-link to="/awards">
          <img src="@/assets/awards-icon.png" class="awards" />
        </router-link>
        <div class="socials-container">
          <a href="https://www.facebook.com/Dolopia/" target="_blank">
            <img src="@/assets/facebook-icon.png" class="social facebook" />
          </a>
          <a href="https://www.instagram.com/dolopia/" target="_blank">
            <img src="@/assets/instagram-icon.png" class="social instagram" />
          </a>
          <a href="https://www.linkedin.com/company/dolopia" target="_blank">
            <img src="@/assets/linkedin-icon.png" class="social linkedin" />
          </a>
        </div>
        <ArrowButton
          v-if="computeShowArrow"
          class="footer-arrow"
          :routePath="'/catalog'"
          :buttonText="'Explore projects'"
        />
      </div>
    </footer>
  </Transition>
</template>

<style lang="scss" scoped>
footer {
  z-index: 2;
  
  &.floating-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    
    &.pinned {
      position: absolute !important;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      background: linear-gradient(
        to top,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.9) 100%
      );
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
  }
}

.footer {
  display: flex;
  justify-content: flex-start;
  padding: 0vw 5% 0vw 5%;
  min-height: 130px;
  background: none;
  align-items: center;
  width: 100%;

  z-index: 2;
  @media (min-width: 451px) {
    position: fixed;
    bottom: 1vh;
    width: 100%;
    min-height: 100px;
  }
  .awards {
    max-height: 100px;
    @media (max-width: 1600px) and (max-height: 900px) {
      max-height: 65px;
    }
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
    &:hover {
      transform: scale(1.05);
      transform: rotate(45deg);
    }
  }
  .socials-container {
    display: flex;
    justify-content: space-between;
    min-width: 15%;
    margin-left: 5%;
    margin-top: 30px;
    .social {
      max-height: 16px;
      transition: transform 0.3s ease;
      &:hover {
        transform: scale(110%);
      }
    }
  }

  .mail-link {
    color: #000;
    text-align: center;
    font-family: "Raleway";
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 1.28;
    letter-spacing: 1.26px;
    margin-left: 25px;
  }
  .arrow-button {
    margin-left: auto;
  }
}

.product-dropdown {
  position: absolute;
  bottom: 5vh;
  right: 5%;
  z-index: 10000;
  isolation: isolate;
}

//FOOTER slide up
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s ease-out, opacity 0.2s ease; // Same as navbar
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