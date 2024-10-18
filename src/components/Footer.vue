<template>
  <div class="footer">
    <img src="@/assets/awards-icon.png" class="awards"/>
    <div class="socials-container">
      <a href="https://www.facebook.com/Dolopia/" target="_blank">
        <img  src="@/assets/facebook-icon.png" class="social facebook"/>
      </a>
      <a href="https://www.instagram.com/dolopia/" target="_blank">
        <img  src="@/assets/instagram-icon.png" class="social instagram"/>
      </a>
      <a href="https://www.linkedin.com/company/dolopia" target="_blank">
        <img src="@/assets/linkedin-icon.png" class="social linkedin"/>
      </a>
    </div>
    <!-- <a href="mailto:info@dolopia.eu" target="_blank" class="mail-link">
      info@dolopia.eu
    </a> -->
    <ArrowButton v-if="computeShowArrow" class="footer-arrow" :routePath="'/catalog'" :showDropdown="false" :buttonText="'Explore'"/>
    <Dropdown v-if="computeShowDropdown" :forType="'product'" :dropdownAlignment="'left'" class="product-dropdown" />
  </div>
</template>

<script setup>
import ArrowButton from '@/components/ArrowButton.vue'
import Dropdown from './Dropdown/Dropdown.vue';
import { computed } from 'vue';

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

function logsomething(){
  console.log("something")
}
let computeShowArrow = computed(() => {
  // console.log("computing?", route.meta)
  if(route.meta?.showRouterArrow){
    return true
  } else return false
})
let computeShowDropdown = computed(() => {
  if(route.meta?.showDropdown){
    return true
  } else return false
})
</script>

<style lang="scss" scoped>
.footer{
  display: flex;
  justify-content: flex-start;
  padding: 0vw 5% 0vw 5%;
  min-height: 150px;
  background: none;
  align-items: center;
  z-index: 2;
  @media(min-width: 451px){
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .awards{
    max-height: 115px;
  }
  .socials-container{
    display: flex;
    justify-content: space-between;
    min-width: 15%;
    margin-left: 10%;
    .social{ 
      max-height: 22px;
      transition: transform 0.3s ease;
      &:hover{
        transform: scale(110%);
      }
    }
  }
  
  .mail-link{
    color: #000;
    text-align: center;
    font-family: "Raleway";
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px; /* 128.571% */
    letter-spacing: 1.26px;
    margin-left: 25px;
  }
  .arrow-button{
    margin-left: auto;
  }
}

.product-dropdown{
  position: absolute;
  bottom: 5vh;
  right: 5%;
  z-index: 10000;
  isolation: isolate;
}
</style>