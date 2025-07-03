import { defineStore } from 'pinia';
import { ref, reactive, computed, watch, toRaw } from 'vue';


// console.log("subcategory")
export const useMenuStore = defineStore('menu', () => {

  const showSidebar = ref(null);
  const showContactForm = ref(null);

  function setSidebarFlag(value){
    showSidebar.value = value
  }
  function setContactFormFlag(value){
    showContactForm.value = value
    // console.log("value set to:", showContactForm.value)
  }
  return {
    showSidebar,
    showContactForm,
    setSidebarFlag,
    setContactFormFlag
  }
});
