
<script setup>
import { ref } from 'vue';
import Waterfall from './Waterfall.vue';

let currentProjectHeading = ref('Test Heading')
let currentProjectParagraph = ref('This will be text about a project which we are viewing')

</script>

<template>
  <div class="about-project">
    <div class="text-container">
      <h2>{{ currentProjectHeading }}</h2>
      <p>{{ currentProjectParagraph }}</p>
    </div>
    <Waterfall/>
  </div>
</template>


<style lang="scss" scoped>

</style>