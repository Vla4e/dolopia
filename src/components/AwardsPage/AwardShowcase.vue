
<script setup>
import { ref, watch, onMounted, toRaw } from 'vue';
import ProductCarousel from './ProductCarousel.vue';

import { allProductMap } from '@/assets/products/allProductMap';

import { 
  gta1 as gta1Awarded, 
  gta2 as gta2Awarded, 
  silver as silverAwarded 
} from '@/assets/products/awardedProducts';

let awardedProductMap = {
  'gta1': gta1Awarded,
  'gta2': gta2Awarded,
  'silver': silverAwarded
}
let awardTexts = {
  'gta1': 'One Golden Star',
  'gta2' : 'Two Golden Stars',
  'silver' : 'Silver Award'
}
const props = defineProps({
  award: {
    type: String,
    required: true
  }
})

let awardPropIdList = ref({})
let awardProps = ref([])
watch(() => props.award, (value) => {
  console.log("Watcher triggered => ", value)
  awardProps.value = [];
  awardPropIdList.value = awardedProductMap[value.name]
  console.log("Set award props to", value)
  console.log("Award props: ", awardProps.value)
  awardPropIdList.value.forEach((val) => {
    let item = allProductMap.get(val);
    awardProps.value.push({      
      award: item.Award,
      name: item["Product name EN"],
      imageUrl: new URL('@/assets/products/product-images/projects/vegetable-project/vegetable-in-oil/250-MMML200.png', import.meta.url).href,
      description: item["Short Description EN"],
      comments: item["consumers comments"]
    });
  })
  console.log("AwardPropsVal", toRaw(awardProps.value))
}, { immediate: true })

let testProps = ref([
  {
    award: "Two Golden Stars 2018",
    name: 'Marinated mushrooms with herbs in oil',
    imageUrl: new URL('@/assets/products/product-images/projects/vegetable-project/vegetable-in-oil/250-MMML200.png', import.meta.url).href,
    description: "Enjoy our Marinated Mushrooms with Herbs in Oil - a savory blend perfect as a meze, side dish, or to elevate your favorite recipes.",
    comments: ""
  },
  {
    award: "Two Golden Stars 2023",
    name: 'Tomato sauce with Feta cheese and savory',
    imageUrl: new URL('@/assets/products/product-images/projects/tomato-project/pasta-sauces/250-STF8250.png', import.meta.url).href,
    description: "A vibrant tomato sauce enriched with Feta cheese and savory, ideal for pasta or Mediterranean dishes."
  }
])

</script>

<template>
  <div class="award-container">
    <section class="award-content">
      <div class="award-information">
        <img src="@/assets/awards/gta1.svg" alt="award"/>
        <div class="heading-container">
          <h2>{{award.heading}}</h2>
          <span>{{award.subheading}}</span>
          <p class="award-description">{{ award.description }}</p>
        </div> 
      </div>
      <ProductCarousel class="carousel" :awardedItems="awardProps"/>
    </section>
    <div class="blue-bg"/>
  </div>
</template>

<style lang="scss" scoped>
.award-container{
  width: 100%;
  height: 100%;
  position: relative;
  .white-bg{
    width: 100%;
    height: 70%;
    position: absolute;
    top: 0;
    z-index:0;
  }
  .blue-bg{
    background-color: #CEEBEC;
    position: absolute;
    height: 35%;
    width: 100%;
    bottom: 0;
    z-index:0;
  }
  .award-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 10vh;
    width: 80%;
    height: 100%;
    margin-right: auto;
    margin-left: auto;
    color: black;
    position: relative;
    z-index:2;
    .award-information{
      display:flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40%;
      img{
        // max-height: 100%;
        width: 20%;
      }
      .heading-container{
        height: 70%;
        h2{
          color: #000;
          font-family: "Century Gothic";
          font-size: 48px;
          font-style: normal;
          font-weight: 700;
          line-height: 48px; /* 50% */
          letter-spacing: 4.32px;
          text-transform: uppercase;
          margin-bottom: 10px;
          @media(max-width: 1600px) and (max-height: 900px){
            font-size: 36px;
          }
        }
        span{
          color: #000;
          font-family: "Century Gothic";
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px; /* 100% */
          letter-spacing: 2.16px;
          text-transform: uppercase;
          @media(max-width: 1600px) and (max-height: 900px){
            font-size: 18px;
          }
        }
      }
      .award-description{
        color: #000;
        font-family: "Raleway";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
        margin-top: 20px;
        @media(max-width: 1600px) and (max-height: 900px){
          font-size: 12px;
        }

      }
    }
    .carousel{
      width: 80%;
      // height: 40%;
      margin-left: auto;
      margin-top: -8%;
    }
  }
}
</style>