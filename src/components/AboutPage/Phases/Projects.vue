<template>
    <!-- Phase 3 - 6 -->
      <div v-if="phaseId === 3" class="phase phase-3" key="phase-3">
        <AboutProjects :project="'pasta'"/>
      </div>
      <div v-else-if="phaseId === 4" class="phase phase-4" key="phase-4">
        <AboutProjects :project="'tomato'"/>
      </div>
      <div v-else-if="phaseId === 5" class="phase phase-5" key="phase-5">
        <AboutProjects :project="'vegetable'"/>
      </div>
      <div v-else-if="phaseId === 6" class="phase phase-6" key="phase-6">
        <AboutProjects :project="'fruit'"/>
      </div>
</template>

<script setup>
import AboutProjects from '../AboutProjects.vue';
import { onMounted } from 'vue';

const props = defineProps({
  phaseId: {
    type: Number,
    required: true
  }
})
onMounted(() => {
  console.log("PROJECTS")
})

</script>

<style lang="scss" scoped>
.phase{
  background-color: #039EA2 !important;
}
img{
}

</style>