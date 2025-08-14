<script setup>
import { ref, watch } from "vue";
import passionVideo from "@/assets/about/beginning/passion-for-sharing.mp4";
import qualityVideo from "@/assets/about/beginning/savor-the-essence.mp4";
import artisanalVideo from "@/assets/about/advantage/artisanal-products.mp4";
import highQualityProductsVideo from "@/assets/about/advantage/high-quality-products.mp4";
import essenceImage from "@/assets/about/essence.jpg";

const dataObject = {
  passion: {
    heading: "",
    paragraph: `Dolopia Savour Creations began with our shared love for cooking and a <br/>
    passion for sharing authentic flavors. As a couple with roots outside of<br/>
    Greece, we spent countless hours experimenting with local ingredients<br/>
    and preparing meals for friends and family. When friends from abroad<br/>
    visited us, they expected to taste the typical Greek dishes like<br/>
    moussaka or gyros. Instead, they were delighted by lesser-known<br/>
    traditional recipes, such as Hilopites with octopus and tomato sauce.`,
    flavourText: "Passion for sharing <br/> authentic flavors",
    videoSource: passionVideo,
  },
  quality: {
    heading: "Bringing unique tastes </br> to the world",
    paragraph: `Realizing that many unique flavors remained largely<br/>
    undiscovered outside of Greece, we decided to start a business<br/>
    that would bring these tastes to the world. What began with<br/>
    just a few sauces and candied fruits has grown into a diverse<br/>
    range of high-quality products, each crafted with care, using<br/>
    fresh ingredients and traditional methods.`,
    flavourText: "Savor the essence of <br/> Mediterranean cuisine",
    videoSource: qualityVideo,
  },
  artisanal: {
    heading: "",
    paragraph:
      `At Dolopia Savour Creations, we take pride in our commitment<br/>
      to quality, authenticity, and flavor. Our products stand out for<br/>
      several reasons. First and foremost, we use only the freshest,<br/>
      locally sourced ingredients, ensuring that every bite reflects<br/>
      vibrant flavors. Our artisanal production methods involve<br/>
      small-batch crafting, allowing us to maintain a personal touch<br/>
      and a level of care that large manufacturers cannot replicate.",
    flavourText: "Artisanal production methods`,
    videoSource: artisanalVideo,
  },
  essence: {
    heading: "No artificial additives no preservatives",
    paragraph:
      `We avoid artificial additives, preservatives, and shortcuts, opting<br/>
      instead for time-honored techniques that enhance the natural taste<br/>
      of our ingredients. This dedication to purity means that our pasta,<br/>
      sauces, and spreads not only taste better but are also healthier<br/>
      options for you and your family. With Dolopia, you can savor the<br/>
      essence of Mediterranean cuisine, bringing authentic flavors to your<br/>
      table with ease and confidence.",
    flavourText: "Savor the essence of Mediterranean cuisine`,
    videoSource: highQualityProductsVideo,
  },
  distribution: {
    heading: "Crafted for Culinary Professionals",
    paragraph:
      "Whether it’s a local deli looking to provide unique, flavorful options or a restaurant wanting to elevate their menu with genuine Mediterranean tastes, we partner with those who share our commitment to excellence in every bite.",
    paragraph2:
      "With a dedicated deli section, focusing on businesses that prioritize quality over price. Our products are designed for establishments seeking to offer their customers authentic, artisanal flavors, enhancing their culinary offerings with high-quality, handcrafted ingredients.",
    flavourText: "Serving delis & restaurants with quality",
    videoSource: "",
  },
};


const props = defineProps({
  sectionId: {
    type: String,
    required: true,
    default: "passion",
  },
  side: {
    type: String,
    required: true,
    default: "left",
  },
  isPlaceholder: {
    type: Boolean,
    required: false,
    default: false,
  },
  isTextOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
});

let currentDataObject = ref({});
watch(
  () => props.sectionId,
  (newSectionId) => {
    currentDataObject.value = dataObject[newSectionId];
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="video-showcase" :class="[side, sectionId]">
    <div class="media-wrapper">
      <div class="video-container">
        <div v-if="isTextOnly"></div>
        <video
          v-else-if="!isPlaceholder && currentDataObject.videoSource"
          :src="currentDataObject.videoSource"
          preload="metadata"
          playsinline
          autoplay
          loop
          muted
          disableremoteplayback="true"
          class="video"
        />
        <img v-else :src="essenceImage" alt="The essence of Dolopia ingredients" />
      </div>
      <span
        v-if="side === 'right'"
        class="flavour-text"
        v-html="currentDataObject.flavourText"
      ></span>
    </div>

    <div class="text-container">
      <div class="text-wrapper">
        <span
          v-if="side === 'left'"
          class="flavour-text"
          v-html="currentDataObject.flavourText"
        ></span>
        <h2 v-if="currentDataObject.heading" v-html="currentDataObject.heading"></h2>
        <p v-if="currentDataObject.paragraph" v-html="currentDataObject.paragraph"></p>
        <p v-if="currentDataObject.paragraph2" v-html="currentDataObject.paragraph2"></p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-showcase {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  box-sizing: border-box;

  // Children containers: 50% width, full height, flex column
  .media-wrapper,
  .text-container {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
  }

  // == LAYOUT VARIANTS ==

  // LEFT: Media | Text
  &.left {
    .media-wrapper {
      align-items: center; // Center video in its column
    }
    .text-container {
      align-items: center; // Align text content to the left
      
      margin-top: 10vh;
      margin-right: 10vw;
    }
    .flavour-text{
      position: absolute;
      transform: translateY(-100%);  
      right: -50px;
      word-break: keep-all;
      white-space: nowrap;
      padding: 50px;
    }
  }

  // RIGHT: Text | Media
  &.right {
    flex-direction: row-reverse; // Swap visual order
    .media-wrapper {
      align-items: center; // Center video and its text below
      position: relative;
      margin-top: -10vh;
    }
    .text-container {
      align-items: center; // Align text content to the right
      
      // margin-top: 10vh;
      margin-right: 10vw;
      h2,
      p {
        text-align: right;
      }
    }
    .flavour-text{
      position:absolute;
      bottom: 0;
      right: 0;
      transform: translateY(115%);
      font-size: 90px;
      text-align: right;
      word-break: keep-all;
      white-space: nowrap;
    }
  }

  // == ELEMENT STYLES ==

  .video-container {
    object-fit: contain;
    video,
    img {
    object-fit: cover !important;
      display: block;
      object-fit: cover;
    }
  }

  .text-container {
    .text-wrapper{
      position: relative;
    }
    h2 {
      color: #000;
      font-family: "Belleza";
      font-size: 40px;
      font-weight: 400;
      line-height: 1.25;
      margin-bottom: 20px;
    }
    p {
      color: #000;
      font-family: "Raleway";
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      letter-spacing: 0.64px;
      &:not(:last-child) {
        margin-bottom: 1em;
      }
      @media(min-width: 1920px){
        font-size: 18px;
      }
    }
  }

  .flavour-text {
    color: #039EA2;
    font-family: "Kugile";
    font-size: 90px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.1; /* 100% */
    background-color: rgba(230, 246, 246, 0.70);
  }
  // == PRE-CALCULATED VIDEO SIZES (PLACEHOLDERS) ==
  // Define fixed width/height for videos in each section here

  &.passion .video-container .video {
    width: 41vw;
    height: 75vh;
  }
  &.essence .video-container .video {
    width: 46vw;
    height: 57.5vh;
  }
  &.artisanal .video-container .video {
    width: 37vw;
    height: 79vh;
  }
  &.quality .video-container .video {
    width: 46vw;
    height: 57.5vh;
  }
  &.distribution .video-container .video {
    // width: auto;
    // height: auto;
  }
  // 1st vid = 41% width, 85h

  // 2nd 46 57.5h

  // 3rd 37 79 h

  // 4th 46 57.5h
}
</style>
