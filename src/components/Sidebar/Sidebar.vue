<template>
  <div class="sidebar-container">
    <div class="background-cover" />

    <div class="links-container">
      <router-link @click="handleClick()" class="sidebar-link" to="/">
        <span class="link-heading">Home</span>
      </router-link>

      <router-link @click="handleClick()" class="sidebar-link" to="/catalog">
        <span class="link-heading">Projects</span>
      </router-link>

      <router-link @click="handleClick()" class="sidebar-link" to="/all-products">
        <span class="link-heading">Products</span>
      </router-link>

      <router-link @click="handleClick()" class="sidebar-link" to="/about">
        <span class="link-heading">About</span>
      </router-link>

      <router-link
        @click="toggleContactForm()"
        class="sidebar-link"
        disabled
        to="/contact"
      >
        <span class="link-heading">Contact</span>
      </router-link>

      <router-link @click="handleClick()" class="icon-link" to="/awards">
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
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from "vue";

const { isMobile } = inject("screenSize");
const emitter = inject("emitter");

import { useMenuStore } from "@/store/menu";
const menuStore = useMenuStore();

function handleClick() {
  menuStore.setSidebarFlag(false);
}

function toggleContactForm() {
  menuStore.setContactFormFlag(true);
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 40px;
  z-index: 9;
  @media (max-width: 450px) {
    padding-top: 40px;
  }
  .background-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #ceeaec;
    z-index: 11;
  }
  .links-container {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 12;
  }
  .sidebar-link {
    display: flex;
    flex-direction: column;

    &.contact-info {
      a {
        color: black;
        text-decoration: underline;
        @media (max-width: 768px) {
          color: white;
        }
      }
    }
    &.disabled {
      pointer-events: none !important;
      color: #13131370 !important;
    }
    &:not(:last-child) {
      margin-bottom: 40px;
      @media (max-width: 390px) {
        margin-bottom: 10px;
      }
    }
    .link-heading {
      color: #000;
      font-family: "Century Gothic";
      font-size: 32px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 75% */
      letter-spacing: 1.28px;
      text-transform: capitalize;
      text-align: center;
      margin-bottom: 15px;
      &:hover {
        &:not(.disabled) {
          // transform: scale(1.01);
          font-weight: 700;
          // transition: all ease-in 0.3s;
        }
        .okt,
        .omega {
          font-weight: 700;
        }
      }
      &.contact {
        &:hover {
          font-weight: 400;
        }
      }
      @media (max-width: 390px) {
        font-size: 24px;
      }
    }
  }
}
.awards {
  width: 120px;
  height: 120px;
  margin-top: 50px;
  margin-bottom: 45px;
  @media (max-width: 450px) {
    margin: 0px 0px 20px 0px;
  }
  @media (max-width: 390px) {
    width: 90px;
    height: 90px;
  }
}
.socials-container {
  display: flex;
  justify-content: space-between;
  width: 60%;
  .social {
    max-height: 22px;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(110%);
    }
  }
}
</style>
