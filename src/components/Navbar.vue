
<script setup>
import BurgerIcon from './BurgerIcon.vue';

import {inject} from 'vue';
const { isMobile } = inject('screenSize')

import { useMenuStore } from '@/store/menu';
const menuStore = useMenuStore()
function toggleContactForm(){
  // console.log("clicked")
  menuStore.setContactFormFlag(true)
}
</script>

<template>
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
      <router-link to="/about" class="navbar-link disabled">
        About
      </router-link>
      <div @click="toggleContactForm()" class="navbar-link">
        Contact
      </div>
      <!-- <a href="mailto:info@dolopia.eu" target="_blank" class="navbar-link">
        contact: info@dolopia.eu
      </a> -->
    </div>
    <img v-if="!menuStore.showContactForm" src="@/assets/search-icon.png" style="opacity: 0.1;" class="search-icon"/>
  </div>
</template>


<style lang="scss" scoped>
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
      transition: transform ease 0.3s;
      &:hover{
        transform: scale(1.05);
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
</style>