<script setup>
import { ref } from 'vue';

import AwardShowcase from '@/components/AwardsPage/AwardShowcase.vue';

import silver from "@/assets/awards/silver.jpg"
import gta1 from "@/assets/awards/gta1.jpg"
import gta2 from "@/assets/awards/gta2.jpg"

let awardsConfig = [
  {
    name: 'gta2',
    image: gta2
  },
  {
    name: 'gta1',
    image: gta1
  },
  {
    name: 'silver',
    image: silver
  }
]
let selectedAwardFlag = ref(false)
let selectedAward = ref('')
function selectAward(award){
  console.log("Selecting:", award)
  if(award !== selectedAward.value){
    selectedAward.value = award
  } else selectedAward.value = ''
}

</script>

<template>
  <div class="awards-page-container">
  <Transition name="slide" mode="out-in">
    <div v-if="!selectedAwardFlag" class="award-selection">
      <div class="text-section">
        <h2>Honored for <br/> quality and flavor</h2>
        <p>Recognized by experts around the world</p>
      </div>
      <div class="select-section">
        <div 
          v-for="award in awardsConfig" 
          :key="award.name" 
          class="award" 
          :class="[ award.name, selectedAward === award.name ? 'selected' : 'no']"
          @click="selectAward(award.name)"
        >
          <img :src="award.image"/>
        </div> 
      </div>
    </div>
    <div v-else class="award-selected">
      <AwardShowcase :award="selectedAward"/>
    </div>
  </Transition>
  </div>
</template>


<style lang="scss" scoped>
.awards-page-container{
  width: 100%;
  height: 100%;
  background-color: white;
  .award-selection{
    width: 100%;
    height: 100%;
    .text-section{
      background-color: #CEEBEC;
      height: 55%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 30px;
      h2{
        color: #000;
        text-align: center;
        font-family: "Century Gothic";
        font-size: 75px;
        font-style: normal;
        font-weight: 400;
        line-height: 106%;
        letter-spacing: 6.75px;
        text-transform: uppercase;
        margin-bottom: 30px;
      }
      p{
        color: #000;
        text-align: center;
        font-family: "Raleway";
        font-size: 32px;
        font-style: normal;
        font-weight: 400;
        line-height: 75%; /* 75% */
      }
    }
    .select-section{
      background-color: white;
      height: 45%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 4vh;
      .award{
        display: flex;
        min-width: 190px;
        min-height: 190px;
        // transition: transform ease 0.2s;
        &:not(:last-child){
          margin-right: 5vw;
        }
        img{
          width: 100%;
          height: 100%;
        }
        &.selected{
          transform: scale(1.03);
          animation: pulse 0.2s 1;
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1.03);
            }
          }
        }
      }
    }
  }
  .award-selected{

  }
}

</style>