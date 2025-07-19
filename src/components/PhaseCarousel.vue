<script setup>
import { ref, watch } from 'vue';
import { useProductViewStore } from "@/store/productView.js"; // Import the store

const productViewStore = useProductViewStore(); // Initialize the store

// No props needed for currentPhaseName, currentPhaseIndex, phasesShownOnCarousel
// as they are accessed directly from the store.

let emit = defineEmits('selectedPhaseFromCarousel') // Keep this for clarity, though we'll directly call store action now.

function selectPhase(phaseIndex){
  productViewStore.setPhase(productViewStore.ALL_PHASES_ARRAY[phaseIndex]);
  emit('selectedPhaseFromCarousel', phaseIndex) // Still emit if other components are listening for this specific event.
}
</script>

<template>
  <ul class="phase-carousel">
    <li
      v-for="(item, idx) in productViewStore.ALL_PHASES_ARRAY"
      :key="item"
      :class="productViewStore.currentPhaseName === item ? 'selected':''"
      class="phase-item"
      @click.stop="selectPhase(idx)"
    >
      <div class="inner-circle"/>
    </li>
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
      border: 1px solid #2B565D;
    }
    &.selected{
      .inner-circle{
        transform: scale(130%);
        border: 2px solid transparent;
        background-color: #2B565D;
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