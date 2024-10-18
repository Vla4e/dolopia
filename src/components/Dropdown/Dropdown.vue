<script setup>
import { ref, onMounted, onBeforeUnmount, useTemplateRef, computed, watch } from 'vue';
const props = defineProps({
  forType: {
    type: String,
    required: true
  },
  dropdownAlignment: {
    type: String,
    required: false,
    default: 'none' //left, center, right of leftmost edge of dropdown
  },
  changeByType: {
    type: Object,
    required: false,
    default: () => {
      return {
        flag: false,
        type: ''
      }
    }
  },
  toggleOnHover: {
    type: Boolean,
    required: false,
    default: true
  }
})

import { useProductStore } from '@/store/product';
const productStore = useProductStore();

// console.log("FORTYPE", props.forType)

let selectedIdArray = computed(() => { // returns array with values
  if(props.forType === 'category'){
    return productStore.categoriesByIdentifier
  } else if (props.forType === 'subcategory'){
    return productStore.categoryData.subcategories
  } else if (props.forType === 'product'){
    return productStore.subcategoryData.productIdentifiers
  }
})
let selectedNameArray = computed(() => { // returns array names
  if(props.forType === 'category'){
    return productStore.categoriesByFullnames
  } else if(props.forType === 'subcategory'){
    return productStore.categoryData.subcategoryNames
  } else if (props.forType === 'product'){
    return productStore.subcategoryData.productNames
  }
})

let selectedTypeData = computed(() => {
  console.log("Computing type data", props.forType)
  if(props.forType === 'category'){
    return productStore.categoryData
  } else if(props.forType === 'subcategory'){
    return productStore.subcategoryData
  } else if(props.forType === 'product'){
    console.log("Returning product:", productStore.productData)
    return productStore.productData
  }
})
watch(() => selectedTypeData.value.name, (newValue) => {
  console.log("New value for selectedTypeData", newValue)
})

const removeAsterisks = (text) => {
  return text.replace(/\*/g, '');
};

let isSelecting = false
// Select default item
const selectItem = (itemIdentifier) => {
  isSelecting = true
  console.log("newItem", itemIdentifier)
  productStore.selectItemFromDropdown(props.forType, itemIdentifier)
  isOpen.value = !isOpen.value;
  setTimeout(() => {
    isSelecting = false
  }, 1000)
}

//Visual functionalities
const isOpen = ref(false);
const openUpwards = ref(true);
const dropdownRef = useTemplateRef('dropdownRef')
const menuRef = useTemplateRef('menuRef')

const toggleDropdown = () => {
  if(!isSelecting){
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      calculatePosition();
    }
  }
};

const calculatePosition = () => {
  if (!dropdownRef.value || !menuRef.value) return;
  const dropdownRect = dropdownRef.value.getBoundingClientRect();
  const menuHeight = menuRef.value.offsetHeight;
  const spaceBelow = window.innerHeight - dropdownRect.bottom;
  const spaceAbove = dropdownRect.top;
  openUpwards.value = spaceBelow < spaceAbove;
  openUpwards.value = true;
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
  <div @mouseenter="toggleDropdown" @mouseleave="toggleDropdown" class="dropdown" ref="dropdownRef">
    <Transition name="push">
      <button class="dropdown-toggle">
        <span class="toggle-text">{{ forType === 'product' ? removeAsterisks(selectedTypeData.name) : selectedTypeData.fullName }}</span>
        <img class="dropdown-icon" :class="computedArrowClasses" src="@/assets/dropdown/down-arrow.png"/>
      </button>
    </Transition>

    <Transition :name="openUpwards? 'open-up' : 'open-down'">
      <div
        v-show="isOpen"
        :class="['dropdown-menu', { 'open-upwards': openUpwards }]"
        ref="menuRef"
      >
        <ul class="dropdown-list">
          <li v-for="(item, idx) in selectedIdArray" @click="selectItem(item)" :key="item.name" class="dropdown-item">
            {{ removeAsterisks(selectedNameArray[idx]) }}
          </li>
          <!-- <ListItem 
            v-for="(item, idx) in selectedIdArray" 
            :key="item.name" 
            :text="selectedNameArray[idx]"
            class="dropdown-item"
            @click="selectItem(item)" 
          /> -->
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-block;  // Changed to inline-block
  min-width: 100px;
  
  .dropdown-toggle {
    width: 100%;
    display: flex;
    // justify-content: center;
    align-items: center;
    cursor: pointer;
    padding-bottom: 5px;
    // border-bottom: 2px solid #131313;
    .toggle-text{
      color: #000;
      font-family: "Century Gothic";
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px; /* 120% */
      letter-spacing: 1.8px;
      text-transform: capitalize;
    }
    .dropdown-icon {
      width: 20px;
      transition: transform 0.3s ease;
      &:not(.open-upwards) {
        &.opened {
          transform: rotate(180deg);
        }
      }
      &.open-upwards {
        transform: rotate(180deg);
        &.opened {
          transform: rotate(360deg);
        }
      }
    }
  }
  
  .dropdown-menu {
    position: absolute;
    left: 0;  // Aligns the left edge with the button
    // background: rgba(0, 0, 0, 0.2);  // Low opacity black background
    backdrop-filter: blur(5px);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border: none;  // Removed border
    padding: 10px 10px 10px 5px;
    min-width: 150px;
    color: white;  // Added for better visibility on dark background
    
    &.open-upwards {
      bottom: 100%;
      margin-bottom: 5px;
    }
    &:not(.open-upwards) {
      top: 100%;
      margin-top: 5px;
    }
    
    ul {
      li {
        cursor: pointer;
        color: #000;
        font-family: "Raleway";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        text-transform: capitalize;
        padding-bottom: 5px;
        border-bottom: 1px solid black;
        &:hover{
          font-weight: 700;
        }
      }
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
