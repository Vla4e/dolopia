<template>
  <div class="arrow-button">
    <Dropdown v-if="showDropdown" @selectionChange="switchText"/>
    <span class="text">{{buttonText}}</span>
    <img v-show="showArrow" @click="goToRoute(routePath)" src="@/assets/button-arrow.png" class="arrow"/>
  </div>
</template>

<script setup>
import Dropdown from './Dropdown.vue';
import { onMounted, ref } from 'vue';

let buttonText = ref('')
const switchText = (selected) => {
  console.log("selected", selected)
  buttonText.value = selected
}

const props = defineProps({
  buttonText: {
    type: String,
    required: false,
    default: ''
  },
  routePath: {
    type: String,
    required: true
  },
  showArrow: {
    type: Boolean,
    required: false,
    default: true
  },
  showDropdown: {
    type: Boolean,
    required: false,
    default: true
  }
})

import router from '@/router';
function goToRoute(routePath) {
  console.log("Trying to go to", routePath)
  router.push(routePath).catch((e) => {
    console.log("ERROR?", e)
    console.error(e)
  })
}


onMounted(()=>{
  console.log("PROPS:", props.buttonText)
  buttonText.value = props.buttonText
})
</script>

<style lang="scss" scoped>
.arrow-button{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text{
    font-size: 20px;
    color: black;
    margin-left: 5px;
    margin-right: 10px;
    min-width: 40%;
    text-align: center;
  }
  .arrow{
    align-self: flex-end;
    max-width: 50%;
    margin-bottom: 5px;
    cursor: pointer;
  }
}
</style>