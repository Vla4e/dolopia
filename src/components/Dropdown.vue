<script setup>
import { ref, onMounted, onBeforeUnmount, useTemplateRef, computed } from 'vue';

const props = defineProps({
  dropdownAlignment: {
    type: String,
    required: false,
    default: 'none' //left, center, right of leftmost edge of dropdown
  }
})
const isOpen = ref(false);
const openUpwards = ref(false);
const dropdownRef = useTemplateRef('dropdownRef')
const menuRef = useTemplateRef('menuRef')
let items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    calculatePosition();
  }
};

const calculatePosition = () => {
  if (!dropdownRef.value || !menuRef.value) return;
  const dropdownRect = dropdownRef.value.getBoundingClientRect();
  const menuHeight = menuRef.value.offsetHeight;
  const spaceBelow = window.innerHeight - dropdownRect.bottom;
  const spaceAbove = dropdownRect.top;
  openUpwards.value = spaceBelow < spaceAbove;
};

const handleResize = () => {
  if (isOpen.value) {
    calculatePosition();
  }
};
const computedArrowClasses = computed(() => {
  let returnStr = ''
  if(isOpen.value){
    returnStr += ' opened'
  }
  if(openUpwards.value){
    returnStr += ' open-upwards'
  }
  return returnStr
})

const emit = defineEmits(['selectionChange'])
const emitChange = (selectedItem) => {
  emit('selectionChange', selectedItem)
  isOpen.value = false;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleResize);
  calculatePosition()
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleResize);
});
</script>

<template>
  <div class="dropdown" ref="dropdownRef">
    <button class="dropdown-toggle"  @click="toggleDropdown">
      <img class="dropdown-icon" :class="computedArrowClasses" src="@/assets/dropdown/down-arrow.png"/>
    </button>
    <Transition :name="openUpwards? 'open-up' : 'open-down'">
      <div
        v-show="isOpen"
        :class="['dropdown-menu', { 'open-upwards': openUpwards }, dropdownAlignment]"
        ref="menuRef"
      >
        <!-- Dropdown menu content here -->
        <ul>
          <li v-for="item in items" @click="emitChange(item)" :key="item">
            {{ item }}
          </li>
          <!-- <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li> -->
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: flex;  
  .dropdown-toggle{
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .dropdown-icon{
      width: 100%;
      transition: transform 0.3s ease;
      &:not(.open-upwards){
        &.opened{
          transform: rotate(180deg);
        }
      }
      &.open-upwards{
        transform: rotate(180deg);
        &.opened{
          border: red;
          transform: rotate(360deg);
        }
      }
      
    }
  }
  .dropdown-menu {
    position: absolute;
    // left: 0;
    // right: 0;
    background: rgba(255, 255, 255, 0.8); // Transparent background
    backdrop-filter: blur(5px);
    border: 1px solid #ccc;
    padding: 10px;
    min-width: 150px;
    &.open-upwards {
      bottom: 100%;
      margin-bottom: 5px;
    }
    &:not(.open-upwards) {
      top: 100%;
      margin-top: 5px;
    }
    ul{
      li{
        color: black;
        cursor: pointer;
      }
    }
    
    &.left{
      transform: translateX(-100%);
    }
    &.center{
      transform: translateX(-35%);
    }
    &.right{
      transform: translateX(100%);
    }
  }
}
// OPEN UPWARDS
.open-up-enter-from, .open-up-leave-to {
  clip-path: inset(100% 0 0 0); /* Hidden */
  // transform: scaleY(0); /* Start with scale 0 */
}

/* End state */
.open-up-enter-to, .open-up-leave-from {
  clip-path: inset(0 0 0 0); /* Fully visible */
  // transform: scaleY(1); /* Scale to normal size */
}

/* Transition duration and delay */
.open-up-enter-active, .open-up-leave-active {
  transition: clip-path 0.3s ease, transform 0.5s ease;
}

// OPEN DOWNWARDS
.open-down-enter-from, .open-down-leave-to {
  clip-path: inset(0 0 100% 0); /* Hidden */
  // transform: scaleY(0); /* Start with scale 0 */
}

/* End state */
.open-down-enter-to, .open-down-leave-from {
  clip-path: inset(0 0 0 0); /* Fully visible */
  // transform: scaleY(1); /* Scale to normal size */
}

/* Transition duration and delay */
.open-down-enter-active, .open-down-leave-active {
  transition: clip-path 0.3s ease, transform 0.5s ease;
}
</style>
