<template>
  <div class="footer">
    <img src="@/assets/awards-icon.png" class="awards"/>
    <div class="socials-container">
      <img src="@/assets/facebook-icon.png" class="social facebook"/>
      <img src="@/assets/instagram-icon.png" class="social instagram"/>
      <img src="@/assets/linkedin-icon.png" class="social linkedin"/>
    </div>
    <ArrowButton :routePath="'catalog'" :showDropdown="computeShowDropdown" :buttonText="'Explore'"/>
  </div>
</template>

<script setup>
import ArrowButton from '@/components/ArrowButton.vue'
import { computed } from 'vue';

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

let computeShowDropdown = computed(() => {
  console.log("computing?", route.meta)
  if(route.meta?.showDropdownRouter){
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
</style>