<template>
  <div class="footer">
    <img src="@/assets/awards-icon.png" class="awards"/>
    <button style="color: black;" @click="logsomething()">OKAY</button>

    <div class="socials-container">
      <img src="@/assets/facebook-icon.png" class="social facebook"/>
      <img src="@/assets/instagram-icon.png" class="social instagram"/>
      <img src="@/assets/linkedin-icon.png" class="social linkedin"/>
    </div>
    <ArrowButton v-if="computeShowArrow" class="footer-arrow" :routePath="'catalog'" :showDropdown="false" :buttonText="'Explore'"/>
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
    }
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