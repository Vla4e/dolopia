import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import { useProductStoreCleanup } from './store/productCleanup'

import { initializeProductImages } from './helpers/preFetchProductImageUrls'

// Initialize the product map with image URLs before creating the Vue app,
initializeProductImages(true); // useCompressed = true

import './assets/main.scss'

import mitt from 'mitt'
const emitter = mitt();

//remove console logs from prod
console.log = () => {};

const app = createApp(App)
const pinia = createPinia();
app.use(pinia);
app.use(router);


// Initializes/Pre-warms the store and parses imported data
useProductStoreCleanup(); 
// ==========================

app.provide('emitter', emitter)

app.mount('#app')
