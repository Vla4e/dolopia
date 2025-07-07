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
    paragraph: `Dolopia Savour Creations began with our shared love for cooking and a passion for sharing authentic flavors. As a couple with roots outside of Greece, we spent countless hours experimenting with local ingredients and preparing meals for friends and family. When friends from abroad visited us, they expected to taste the typical Greek dishes like moussaka or gyros. Instead, they were delighted by lesser-known traditional recipes, such as Hilopites with octopus and tomato sauce.`,
    flavourText: "Passion for sharing <br/> authentic flavors",
    videoSource: passionVideo,
  },
  quality: {
    heading: "Bringing unique tastes </br> to the world",
    paragraph: `Realizing that many unique flavors remained largely undiscovered outside of Greece, we decided to start a business that would bring these tastes to the world. What began with just a few sauces and candied fruits has grown into a diverse range of high-quality products, each crafted with care, using fresh ingredients and traditional methods.`,
    flavourText: "High-quality products,crafted with care",
    videoSource: qualityVideo,
  },
  artisanal: {
    heading: "",
    paragraph:
      "At Dolopia Savour Creations, we take pride in our commitment to quality, authenticity, and flavor. Our products stand out for several reasons. First and foremost, we use only the freshest, locally sourced ingredients, ensuring that every bite reflects vibrant flavors. Our artisanal production methods involve small-batch crafting, allowing us to maintain a personal touch and a level of care that large manufacturers cannot replicate.",
    flavourText: "Artisanal production methods",
    videoSource: artisanalVideo,
  },
  essence: {
    heading: "No artificial additives no preservatives",
    paragraph:
      "We avoid artificial additives, preservatives, and shortcuts, opting instead for time-honored techniques that enhance the natural taste of our ingredients. This dedication to purity means that our pasta, sauces, and spreads not only taste better but are also healthier options for you and your family. With Dolopia, you can savor the essence of Mediterranean cuisine, bringing authentic flavors to your table with ease and confidence.",
    flavourText: "Savor the essence of Mediterranean cuisine",
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
      <span
        v-if="side === 'left'"
        class="flavour-text"
        v-html="currentDataObject.flavourText"
      ></span>
      <h2 v-if="currentDataObject.heading" v-html="currentDataObject.heading"></h2>
      <p v-if="currentDataObject.paragraph">{{ currentDataObject.paragraph }}</p>
      <p v-if="currentDataObject.paragraph2">{{ currentDataObject.paragraph2 }}</p>
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
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5vw;
    box-sizing: border-box;
  }

  // == LAYOUT VARIANTS ==

  // LEFT: Media | Text
  &.left {
    .media-wrapper {
      align-items: center; // Center video in its column
    }
    .text-container {
      align-items: flex-start; // Align text content to the left
    }
  }

  // RIGHT: Text | Media
  &.right {
    flex-direction: row-reverse; // Swap visual order
    .media-wrapper {
      align-items: center; // Center video and its text below
    }
    .text-container {
      align-items: flex-end; // Align text content to the right
      h2,
      p {
        text-align: right;
      }
    }
  }

  // == ELEMENT STYLES ==

  .video-container {
    video,
    img {
      display: block;
      object-fit: cover;
    }
  }

  .text-container {
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
    }
  }

  .flavour-text {
    color: #8ac3c7;
    font-family: "Kugile";
    font-size: 2.5rem;
    line-height: 1.1;
    margin-top: 25px;
  }

  // == PRE-CALCULATED VIDEO SIZES (PLACEHOLDERS) ==
  // Define fixed width/height for videos in each section here

  &.passion .video-container .video {
    width: 41vw;
    height: 85vh;
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
