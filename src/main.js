import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { initializeProductImages } from './helpers/preFetchProductImageUrls'

// Initialize the product map with image URLs before creating the Vue app,
initializeProductImages(true); // useCompressed = true

import './assets/main.scss'

import mitt from 'mitt'
const emitter = mitt();
//remove console logs from prod
console.log = () => {};

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide('emitter', emitter)

app.mount('#app')
