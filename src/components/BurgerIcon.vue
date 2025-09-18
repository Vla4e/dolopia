<template>
  <div @click="toggleMenu()" :class="{ 'active': menuOpened, [props.navbarTheme]: true}" class="menu-icon">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue';

defineOptions({
  name: 'BurgerMenuIcon'
})
const props = defineProps({
  navbarTheme: {
    type: String,
    required: false,
    default: 'dark'
  }
})

import { useMenuStore } from '@/store/menu';
const menuStore = useMenuStore();
watch(() => menuStore.showSidebar, (val) => {
  // console.log("VAL", val)
  menuOpened.value = val
})
watch(() => props.navbarTheme, (val) => {
  console.log("Received theme val ->", val)
}, { immediate: true })

let menuOpened = ref(false)
function toggleMenu() {
  // console.log("TOGGLING")
  menuOpened.value = !menuOpened.value
  menuStore.setSidebarFlag(menuOpened.value)
}
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 50px !important;
  height: 50px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 20000;
  margin-top: -5px !important; // adjust for bars being offcenter towards the bottom
  transition: transform 0.4s ease;
  gap: 7px;
}

.bar {
  height: 2px;
  width: 80%;
  background-color: black;
  transition: transform 0.4s ease, opacity 0.4s ease, width 0.4s ease;
  // margin-bottom: 7px;
  &:nth-child(1), &:nth-child(3){
    width: 60%;
  }
  &:nth-child(3){
    margin-bottom: 0px;
  }
}
.menu-icon.active{
  transform: translateY(-12px);
}
.menu-icon.active .bar:nth-child(1) {
  transform:  translateY(18px) rotate(45deg);
  // width: 100% !important;
  margin: 0 !important;
}

.menu-icon.active .bar:nth-child(2) {
  opacity: 0;
  transform: translate(-100%, 8px);
}

.menu-icon.active .bar:nth-child(3) {
  transform: rotate(-45deg);
  // width: 100% !important;
  margin: 0 !important;
}

.menu-icon.light{
  .bar{
    background-color: white;
  }
}

</style>