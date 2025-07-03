<script setup>
import { ref, watch } from 'vue';
import passionVideo from '@/assets/about/passion.webm'
import qualityVideo from '@/assets/about/quality.webm'
import artisanalVideo from '@/assets/about/artisanal.webm'
import essenceImage from '@/assets/about/essence.jpg'

const dataObject = {
  passion:{
    heading: '',
    paragraph: `Dolopia Savour Creations began with our shared love for cooking and a passion for sharing authentic flavors. As a couple with roots outside of Greece, we spent countless hours experimenting with local ingredients and preparing meals for friends and family. When friends from abroad visited us, they expected to taste the typical Greek dishes like moussaka or gyros. Instead, they were delighted by lesser-known traditional recipes, such as Hilopites with octopus and tomato sauce.`,
    flavourText: 'Passion for sharing authentic flavors',
    videoSource: passionVideo
  },
  quality: {
    heading: 'Bringing unique tastes </br> to the world',
    paragraph: `Realizing that many unique flavors remained largely undiscovered outside of Greece, we decided to start a business that would bring these tastes to the world. What began with just a few sauces and candied fruits has grown into a diverse range of high-quality products, each crafted with care, using fresh ingredients and traditional methods.`,
    flavourText: 'High-quality products,crafted with care',
    videoSource: qualityVideo
  },
  artisanal: {
    heading: '',
    paragraph: 'At Dolopia Savour Creations, we take pride in our commitment to quality, authenticity, and flavor. Our products stand out for several reasons. First and foremost, we use only the freshest, locally sourced ingredients, ensuring that every bite reflects vibrant flavors. Our artisanal production methods involve small-batch crafting, allowing us to maintain a personal touch and a level of care that large manufacturers cannot replicate.',
    flavourText: 'Artisanal production methods',
    videoSource: artisanalVideo
  },
  essence: {
    heading: 'No artificial additives no preservatives',
    paragraph: 'We avoid artificial additives, preservatives, and shortcuts, opting instead for time-honored techniques that enhance the natural taste of our ingredients. This dedication to purity means that our pasta, sauces, and spreads not only taste better but are also healthier options for you and your family. With Dolopia, you can savor the essence of Mediterranean cuisine, bringing authentic flavors to your table with ease and confidence.',
    flavourText: 'Savor the essence of Mediterranean cuisine',
    videoSource: ''
  }
}
const props = defineProps({
  sectionId: {
    type: String,
    required: true,
    default: 'passion'
  },
  side: {
    type: String,
    required: true,
    default: 'left'
  },
  isPlaceholder: {
    type: Boolean,
    required: false,
    default: false
  }
})

let currentDataObject = ref({})
watch(() => props.sectionId, (newSectionId) => {
  // console.log("ID:", newSectionId)
  currentDataObject.value = dataObject[newSectionId]
}, {
  immediate: true
})
</script>

<template>
  <!-- Video is on left side -->
  <div v-if="side === 'left'" class="video-showcase left">
    <div class="video-section">
      <div class="video-container">
        <video 
          :src="currentDataObject.videoSource" 
          preload="metadata"
          playsinline
          autoplay
          loop
          muted
          disableremoteplayback="true"
        />
      </div>
    </div>
    <div class="text-container">
      <span class="flavour-text">{{ currentDataObject.flavourText }}</span>
      <h2 v-if="currentDataObject.heading !== ''" v-html="currentDataObject.heading"></h2>
      <p>{{ currentDataObject.paragraph }}</p>
    </div>
  </div>

  <!-- Video is on right side -->
  <div v-else class="video-showcase right">
    <div class="text-container">
      <h2 v-if="currentDataObject.heading !== ''" v-html="currentDataObject.heading"></h2>
      <p>{{ currentDataObject.paragraph }}</p>
    </div>
    <div class="video-section">
      <div class="video-container">
        <video
          v-if="!isPlaceholder"
          :src="currentDataObject.videoSource" 
          preload="metadata"
          playsinline
          autoplay
          loop
          muted
          disableremoteplayback="true"
        />
        <img v-else :src="essenceImage"/>
      </div>
      <span class="flavour-text" >{{ currentDataObject.flavourText }}</span>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.video-showcase{
  display: flex;
  justify-content: center;
  align-items: center;
  &.left{
    .video-section{
      width: 35%;
      margin-right: 5vw;
    }
    .text-container{
      width: 45%;
    }
  }
  &.right{
    .video-section{
      width: 45%;
    }
    .text-container{
      width: 35%;
      margin-right: 5vw;
    }
    .flavour-text{
      margin-top: 20px;
      text-align: right;
    }
    p{
      text-align: right;
    }
  }
  .video-section{
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .video-container{
      max-height: 80vh;
      width: 100%;
      overflow: hidden;
      video{
        object-fit: cover;
        object-position: center;
      }
    }
    span{
    }
  }
  .flavour-text{
    color: #8AC3C7;
    font-family: "Kugile";
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 100% */
  }
  .text-container{
    h2{
      color: #000;
      text-align: right;
      font-family: "Belleza";
      font-size: 40px;
      font-style: normal;
      font-weight: 400;
      line-height: 125%; /* 125% */
      margin-bottom: 20px;
    }
    p{
      color: #000;
      font-family: "Raleway";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 150% */
      letter-spacing: 0.64px;
    }
  }
  
}
</style>