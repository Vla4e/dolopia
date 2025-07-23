<template>
  <div class="phase-container">
    <!-- Phase 3 - 6 | transition handled within AboutProjects-->
      <AboutProjects :project="currentProject"/>
  </div>
</template>

<script setup>
import AboutProjects from '../AboutProjects.vue';
import { onMounted, watch, ref } from 'vue';

const props = defineProps({
  phaseId: {
    type: Number,
    required: true
  }
})

let currentProject = ref('vegetable')
let projects = ['vegetable', 'tomato', 'pasta', 'fruit']
let count = 0;

//Scroll through project array based on phaseId difference to previous int value
watch(() => props.phaseId, (newPhase, oldPhase) => {
  if(!oldPhase && newPhase !== 6){
    count = 0;
  } 
  if (newPhase > oldPhase) {
    count++
  } else if (newPhase < oldPhase) {
    count--
  }
  currentProject.value = projects[count]
}, { immediate: true })

onMounted(() => {
  if (props.phaseId === 6) {
    count = 3 // Set count to 3 on mount if phaseId is 6
    currentProject.value = projects[count]
  }
})
</script>

<style lang="scss" scoped>
.phase-container {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.phase{
  background-color: #039EA2 !important;
  height: 100%;
}
</style>