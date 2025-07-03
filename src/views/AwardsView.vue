<script setup>
import { ref, watch } from 'vue';

import AwardShowcase from '@/components/AwardsPage/AwardShowcase.vue';

import silver from "@/assets/awards/silver.svg"
import gta1 from "@/assets/awards/gta1.svg"
import gta2 from "@/assets/awards/gta2.svg"

let awardsConfig = [
  {
    name: 'gta2',
    heading: 'two golden stars',
    subheading: 'Guild of Fine Food | Great Taste',
    description: `The Great Taste Awards is the world's most trusted food and drink accreditation scheme, celebrating exceptional taste, quality, and craftsmanship. Each product is rigorously blind-tasted by a panel of experts, ensuring only the finest receive recognition. We're proud to showcase our numerous awards, a testament to our commitment to creating products that delight and inspire.`,
    image: gta2
  },
  {
    name: 'gta1',
    heading: 'golden star',
    subheading: 'Guild of Fine Food | Great Taste awards',
    description: `The Great Taste Awards is the world's most trusted food and drink accreditation scheme, celebrating exceptional taste, quality, and craftsmanship. Each product is rigorously blind-tasted by a panel of experts, ensuring only the finest receive recognition. We're proud to showcase our numerous awards, a testament to our commitment to creating products that delight and inspire.`,
    image: gta1
  },
  {
    name: 'silver',
    heading: 'silver dalemaine Award',
    subheading: 'the Dalemain World Marmalade awards',
    description: 'This is the culmination of the annual Awards with the competition opening for entries in January each year,  marmalade jars spill out of every part of the house while on display. The new years winner is announced, we have a range of talks and Marmalade panels and tasting of marmalades from around the world. We are joined in our citrus endeavours to further the cause of marmalade everywhere by two sister festivals in Australia and Japan.',
    image: silver
  }
]
let selectedAwardFlag = ref(false)
let selectedAward = ref({
  name: null,
})
function selectAward(award){
  // console.log("Selecting:", award, selectedAward.value)
  if(award.name !== selectedAward.value.name){
    selectedAward.value = award
    selectedAwardFlag.value = true;
  } else selectedAward.value = ''
}

watch(() => selectedAward.value, (value) => {
  // console.log("selected award value", value)
}, { immediate: true })
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
          @click="selectAward(award)"
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
  height: 100vh;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow:1;
  background-color: white;
  .award-selection{
    width: 100%;
    height: 100%;
    flex-grow:1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
        @media(min-width: 1400px) and (max-height: 900px){
          font-size: 64px;
          letter-spacing: 5.75px;
          margin-bottom: 20px;
        }
      }
      p{
        color: #000;
        text-align: center;
        font-family: "Raleway";
        font-size: 32px;
        font-style: normal;
        font-weight: 400;
        line-height: 75%; /* 75% */
        @media(min-width: 1400px) and (max-height: 900px){
          font-size: 28px;
        }
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
      @media(min-width: 1400px) and (max-height: 900px){
        padding-top: 1vh;
      }
      .award{
        display: flex;
        justify-content: center;
        min-width: 190px;
        min-height: 190px;
        @media(min-width: 1400px) and (max-height: 900px){
          // min-width: 140px;
          // min-height: 140px;
          max-width: 240px;
          max-height: 240px;
        }
        // transition: transform ease 0.2s;
        &:not(:last-child){
          margin-right: 5vw;
        }
        img{
          width: 80%;
          height: 80%;
          cursor: pointer;
          transition: transform ease 0.3s;
          &:hover{
            transform: scale(1.05);
          }
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
    width:100%;
    height: 100%;
  }
}

</style>