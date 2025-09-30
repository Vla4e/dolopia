<script setup>
import { ref, watch, inject } from "vue";
const { isMobile } = inject("screenSize");

import passionVideo from "@/assets/about/beginning/passion-for-sharing.mp4";
import qualityVideo from "@/assets/about/beginning/savor-the-essence.mp4";
import artisanalVideo from "@/assets/about/advantage/artisanal-products.mp4";
import highQualityProductsVideo from "@/assets/about/advantage/high-quality-products.mp4";
import essenceImage from "@/assets/about/essence.jpg";

const dataObject = {
  passion: {
    heading: "",
    mobileHeading: "Dolopia Savour Creations began with our shared love for cooking ",
    paragraph: `Dolopia Savour Creations began with our shared love for cooking and a <br/>
    passion for sharing authentic flavors. As a couple with roots outside of<br/>
    Greece, we spent countless hours experimenting with local ingredients<br/>
    and preparing meals for friends and family. When friends from abroad<br/>
    visited us, they expected to taste the typical Greek dishes like<br/>
    moussaka or gyros. Instead, they were delighted by lesser-known<br/>
    traditional recipes, such as Hilopites with octopus and tomato sauce.`,
    paragraphMobile: `Dolopia Savour Creations began with our shared love for cooking and a 
    passion for sharing authentic flavors. As a couple with roots outside of 
    Greece, we spent countless hours experimenting with local ingredients 
    and preparing meals for friends and family. When friends from abroad 
    visited us, they expected to taste the typical Greek dishes like 
    moussaka or gyros. Instead, they were delighted by lesser-known 
    traditional recipes, such as Hilopites with octopus and tomato sauce.`,
    flavourText: "Passion for sharing <br/> authentic flavors",
    videoSource: passionVideo,
  },
  quality: {
    heading: "Bringing unique tastes </br> to the world",
    mobileHeading: "Bringing unique tastes </br> to the world",
    paragraph: `Realizing that many unique flavors remained largely<br/>
    undiscovered outside of Greece, we decided to start a business<br/>
    that would bring these tastes to the world. What began with<br/>
    just a few sauces and candied fruits has grown into a diverse<br/>
    range of high-quality products, each crafted with care, using<br/>
    fresh ingredients and traditional methods.`,
    paragraphMobile: `Realizing that many unique flavors remained largely undiscovered outside of Greece, we decided to start a business that would bring these tastes to the world. What began with just a few sauces and candied fruits has grown into a diverse range of high-quality products, each crafted with care, using fresh ingredients and traditional methods.`,
    flavourText: "Savor the essence of <br/> Mediterranean cuisine",
    videoSource: qualityVideo,
  },
  artisanal: {
    heading: "",
    mobileHeading:
      "At Dolopia Savour Creations, we take pride in our commitment to quality, authenticity, and flavor.",
    paragraph: `At Dolopia Savour Creations, we take pride in our commitment<br/>
      to quality, authenticity, and flavor. Our products stand out for<br/>
      several reasons. First and foremost, we use only the freshest,<br/>
      locally sourced ingredients, ensuring that every bite reflects<br/>
      vibrant flavors. Our artisanal production methods involve<br/>
      small-batch crafting, allowing us to maintain a personal touch<br/>
      and a level of care that large manufacturers cannot replicate."`,
    paragraphMobile: `At Dolopia Savour Creations, we take pride in our commitment to quality, authenticity, and flavor. Our products stand out for several reasons. First and foremost, we use only the freshest, locally sourced ingredients, ensuring that every bite reflects vibrant flavors. Our artisanal production methods involve small-batch crafting, allowing us to maintain a personal touch and a level of care that large manufacturers cannot replicate.`,
    flavourText: "Artisanal <br/> production methods",
    videoSource: artisanalVideo,
  },
  essence: {
    heading: "No artificial additives<br/>no preservatives",
    mobileHeading: "No artificial additives no preservatives",
    paragraph: `We avoid artificial additives, preservatives, and shortcuts, opting<br/>
      instead for time-honored techniques that enhance the natural taste<br/>
      of our ingredients. This dedication to purity means that our pasta,<br/>
      sauces, and spreads not only taste better but are also healthier<br/>
      options for you and your family. With Dolopia, you can savor the<br/>
      essence of Mediterranean cuisine, bringing authentic flavors to your<br/>
      table with ease and confidence.`,
    paragraphMobile: `We avoid artificial additives, preservatives, and shortcuts, opting instead for time-honored techniques that enhance the natural taste of our ingredients. This dedication to purity means that our pasta, sauces, and spreads not only taste better but are also healthier options for you and your family. With Dolopia, you can savor the essence of Mediterranean cuisine, bringing authentic flavors to your table with ease and confidence.`,
    flavourText: "High-quality products,</br>crafted with care",
    videoSource: highQualityProductsVideo,
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
    console.log("For SectionId ---->", newSectionId);
    currentDataObject.value = dataObject[newSectionId];
    console.log("Current data object ->", currentDataObject.value);
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
        <div v-if="isMobile" class="mobile-text-container">
          <div class="mobile-heading" v-html="currentDataObject.mobileHeading"></div>
          <span class="flavour-text" v-html="currentDataObject.flavourText"></span>
        </div>

        <video
          v-if="!isPlaceholder && currentDataObject.videoSource"
          :src="currentDataObject.videoSource"
          preload="metadata"
          playsinline
          autoplay
          loop
          muted
          disableremoteplayback="true"
          class="video"
        />

        <img
          v-else
          class="image"
          :src="essenceImage"
          alt="The essence of Dolopia ingredients"
        />
      </div>

      <span
        v-if="side === 'right' && !isMobile"
        class="flavour-text"
        v-html="currentDataObject.flavourText"
      ></span>
    </div>

    <div class="text-container">
      <div class="text-wrapper">
        <span
          v-if="side === 'left' && !isMobile"
          class="flavour-text"
          v-html="currentDataObject.flavourText"
        ></span>
        <h2
          v-if="currentDataObject.heading && !isMobile"
          v-html="currentDataObject.heading"
        ></h2>
        <p
          v-if="currentDataObject.paragraph"
          v-html="
            isMobile ? currentDataObject.paragraphMobile : currentDataObject.paragraph
          "
        ></p>
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
  @media (max-width: 450px) {
    margin-bottom: 25px;
  }

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
    .flavour-text {
      position: absolute;
      transform: translateY(-100%);
      right: -50px;
      word-break: keep-all;
      white-space: nowrap;
      padding: 50px;
      @media (max-width: 1920px) {
        font-size: 65px !important;
      }
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
    .flavour-text {
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translateY(115%);
      font-size: 90px;
      text-align: right;
      word-break: keep-all;
      white-space: nowrap;
      @media (max-width: 1920px) {
        font-size: 65px;
      }
    }
  }

  // == ELEMENT STYLES ==

  .video-container {
    object-fit: contain;
    video {
      object-fit: cover !important;
      display: block;
    }
    img {
      object-fit: contain !important;
      display: block;
      // width: 40vw;
      // height: auto;
    }
  }

  .text-container {
    .text-wrapper {
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
      @media (min-width: 1920px) {
        font-size: 18px;
      }
    }
  }

  .flavour-text {
    color: #039ea2;
    font-family: "Kugile";
    font-size: 90px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.1; /* 100% */
    background-color: rgba(230, 246, 246, 0.7);
  }

  // == PRE-CALCULATED VIDEO SIZING ==
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
  &.distribution .video-container .image {
    width: 46vw;
    height: 57.5vh;
  }
  // 1st vid = 41% width, 85h

  // 2nd 46 57.5h

  // 3rd 37 79 h

  // 4th 46 57.5h

  @media (max-width: 450px) {
    flex-direction: column !important;
    align-items: center;
    min-height: 100vh !important;
    max-height: 200vh !important;
    height: auto !important;
    padding-top: 60px;
    &.left {
    }
    &.right {
    }
    .mobile-text-container {
      display: flex;
      width: 100%;
      flex-direction: column;
      .mobile-heading {
        color: #039ea2;
        text-align: center;
        font-family: Belleza;
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: 26px; /* 104% */
        letter-spacing: 0.5px;
        margin-bottom: 60px;
      }
      .flavour-text {
        position: static !important;
        transform: none !important;
        color: #039ea2;
        text-align: center;
        font-family: Kugile;
        font-size: 35px !important;
        font-style: normal;
        font-weight: 400;
        line-height: 1.15; /* 114.286% */
        padding: 0px;
        margin-bottom: 30px;
      }
    }
    .media-wrapper {
      width: 100%;
      // order: 2;
      .video-container {
        width: 100%;
        .video {
          width: 100%;
          height: auto;
          border-radius: 12px;
        }
      }
    }
    .text-container {
      width: 100%;
      padding: 0;
      margin: 0 !important;
      // order: 1;
      .text-wrapper {
      }
      .flavour-text {
        position: static;
        color: #039ea2;
        text-align: center;
        font-family: Kugile;
        font-size: 35px !important;
        font-style: normal;
        font-weight: 400;
        line-height: 1.15; /* 114.286% */
        padding: 0px;
      }
      p {
        color: #000;
        text-align: center;
        font-family: "Raleway";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.4; /* 142.857% */
        letter-spacing: 0.56px;
        width: 90%;
        margin: auto;
        margin-top: 30px;
      }
    }
  } /* Move these after the 450px query */
  @media (max-width: 400px) {
    .mobile-text-container {
      .flavour-text {
        font-size: 30px !important;
      }
      .mobile-heading {
        font-size: 26px;
      }
    }
  }

  @media (max-width: 360px) {
    .mobile-text-container {
      .flavour-text {
        font-size: 28px !important;
      }
    }
  }
}
</style>
