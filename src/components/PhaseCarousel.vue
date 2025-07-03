
<script setup>
import { ref } from 'vue';
import downChevron from '@/assets/dropdown/down-arrow-white.png'

let currentPhase = ref(1)
let props = defineProps({
  phases: {
    type: Array,
    required: false,
    default: [1, 2, 3, 4]
  },
  currentPhaseName: {
    type: String,
    required: true
  },
  currentPhaseIndex: {
    type: Number,
    required: true
  },
  phasesShownOnCarousel: {
    type: Array,
    required: true
  }
})

const Backward = false; //scrollUp
const Forward = true; //scrollDown
let emit = defineEmits('selectedPhaseFromCarousel', 'cyclePhase')
function selectPhase(phase){ //ProductInformation.vue localPhases.length = 4, phasesShownOnCarousel.length = 3 ("none" is not passed), thus +1 to val
  emit('selectedPhaseFromCarousel', phase + 1)
}
function emitCyclePhase(direction){
  emit('cyclePhase', direction)
}
</script>

<template>
  <ul class="phase-carousel">
    <!-- <img @click="emitCyclePhase(Backward)" class="up-chevron" :src="downChevron"/> -->
    <li 
      v-for="(item, idx) in phasesShownOnCarousel"
      :class="currentPhaseName === item ? 'selected':''"
      class="phase-item"
      @click="selectPhase(idx)"
    >
      <div class="inner-circle"/>
      <!-- <span style="position: absolute; left: 10px;">{{item}}</span> -->
    </li>
    <!-- <img @click="emitCyclePhase(Forward)" class="down-chevron" :src="downChevron"/> -->
  </ul>
</template>


<style lang="scss" scoped>
.phase-carousel{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
  cursor: pointer;
  @media (max-width: 450px){
    flex-direction: row;
    .phase-item{
      margin-right: 30px;
    }
  }
  .phase-item{
    width: 50px;
    height: 50px;
    margin-bottom: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .inner-circle{
      border-radius: 200%;
      width: 15px;
      height: 15px;
      transition: all ease 0.5s;
      background-color: transparent;
      border: 1px solid white;
    }
    &.selected{
      .inner-circle{
        transform: scale(130%);
        border: 2px solid transparent;
        background-color: white;
      }
    }
  }
}

.up-chevron, .down-chevron{
  width: 15px;
  // height: 15px;
  transition: transform 0.2s ease;
}
.up-chevron{
  transform: rotate(180deg);
  margin-bottom: -10px;
  &:hover{
    transform: translateY(-5px) rotate(180deg);
  }
}
.down-chevron{
  margin-top: -10px;
  &:hover{
    transform: translateY(5px)
  }
}
</style>