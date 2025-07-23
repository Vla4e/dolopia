<script setup>
import { ref, watch } from "vue";

import { allProductMap } from "@/assets/products/allProductMap";
import { getProductCodeToImageUrlMap } from "@/helpers/fetchProductListImages";


import { Carousel, Slide, Navigation, Pagination } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css"; // base styles for vue3-carousel

import {
  gta1 as gta1Awarded,
  gta2 as gta2Awarded,
  silver as silverAwarded,
} from "@/assets/products/awardedProducts";

let awardedProductMap = {
  gta1: gta1Awarded,
  gta2: gta2Awarded,
  silver: silverAwarded,
};
let awardTexts = {
  gta1: "One Golden Star",
  gta2: "Two Golden Stars",
  silver: "Silver Award",
};


const props = defineProps({
  award: {
    type: String,
    required: true,
  },
});

let scrollEnabled = ref(false);
let awardPropIdList = ref({});
/*
  tempArrayProps populated via push first, then
  awardProps.value is set to tempAwardProps after loop finishes, which triggers propagation to ProductCarousel.
  If awardProps was directly pushed to, it would trigger propagation at every push.
*/
let tempAwardProps = [];
let awardProps = ref([]);
watch(
  () => props.award,
  async (value) => {
    if (value.name == "gta1") {
      scrollEnabled.value = true;
    }

    tempAwardProps = [];
    awardPropIdList.value = awardedProductMap[value.name];
    let productImages = await getProductCodeToImageUrlMap(awardPropIdList.value, true); // 2nd argument is useCompressed images
    awardPropIdList.value.forEach((val) => {
      let item = allProductMap.get(val);
      tempAwardProps.push({
        award: item.Award,
        name: item["Product name EN"],
        imageUrl: productImages[val].mainImage,
        description: item["Short Description EN"],
        comments: item["consumers comments"],
        path: item.path,
        category: item.keyToCategory,
        subcategory: item.keyToSubcategory,
      });
    });

    if(tempAwardProps.length < 3){
      tempAwardProps.push({})
    }
    awardProps.value = tempAwardProps;
  },
  { immediate: true }
);

// Add carousel settings
const carouselSettings = ref({
  itemsToShow: 3, // can have float value (3.5 to show half an element to the right)
  snapAlign: 'start',
  wrapAround: props.award.name === 'gta1' ? true : false,
  clamp: true,
});

const breakpoints = {
  // 700px and up
  700: {
    itemsToShow: 3,
    snapAlign: 'start',
  },
  // 1024 and up
  1024: {
    itemsToShow: 3,
    snapAlign: 'start',
  },
};
</script>

<template>
  <div class="award-container">
    <div class="award-image-container">
      <img :src="award.image" class="award-image" alt="award" />
    </div>

    <section class="award-content">
      <div class="award-information">
        <div class="heading-container">
          <h2>{{ award.heading }}</h2>
          <span>{{ award.subheading }}</span>
          <p class="award-description">{{ award.description }}</p>
        </div>

        <Carousel
          v-bind="carouselSettings"
          :breakpoints="breakpoints"
          :i18n="{ ariaGallery: 'Gallery' }"
          class="carousel"
        >
          <Slide v-for="(item, index) in awardProps" :key="index">
            <router-link
              class="carousel__item"
              :to="`/projects/${item.category}-project/${item.subcategory}/${item.path}`"
            >
              <div class="image-wrapper">
                <img
                  :src="item.imageUrl"
                  class="product-image"
                  :draggable="false"
                />
              </div>

              <section class="product-information">
                <span class="name">{{ item.name }}</span>
                <span class="award">{{ item.award }}</span>
                <span class="description">{{ item.description }}</span>
              </section>
            </router-link>
          </Slide>
          <!-- <template #addons>
            <Pagination /> 
            <Navigation />
          </template> -->
        </Carousel>
      </div>
    </section>
    <div class="blue-background" />
    <div class="line" style="position: absolute; left: 50%; width: 1000px; height: 3px; background: red;"></div>
  </div>
</template>

<style lang="scss" scoped>
.award-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  .white-background {
    width: 100%;
    height: 70%;
    position: absolute;
    top: 0;
    z-index: 0;
  }
  .blue-background {
    background-color: #ceebec;
    position: absolute;
    height: 35%;
    width: 100%;
    bottom: 0;
    z-index: 0;
  }
  .award-image-container {
    width: 20%;
    padding-top: 15vh;
    .award-image {
      width: 100%;
    }
    @media (max-width: 1600px) and (max-height: 900px) {
      padding-top: 12vh;
    }
  }
  .award-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 60%;
    height: 100%;
    color: black;
    position: relative;
    z-index: 2;
    padding-top: 20vh;
    .award-information {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      .heading-container {
        height: 70%;
        padding-left: 10%;
        h2 {
          color: #000;
          font-family: "Century Gothic";
          font-size: 48px;
          font-style: normal;
          font-weight: 700;
          line-height: 48px;
          letter-spacing: 4.32px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        span {
          color: #000;
          font-family: "Century Gothic";
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px;
          letter-spacing: 2.16px;
          text-transform: uppercase;
        }
      }
      .award-description {
        width: 75%;
        color: #000;
        font-family: "Raleway";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        margin-top: 30px;
      }
    }

    @media (max-width: 1600px) and (max-height: 900px) {
      padding-top: 15vh;
      .heading-container {
        h2 {
          font-size: 36px;
          margin-bottom: 0px;
        }

        span {
          font-size: 14px;
        }

        .award-description {
          font-size: 12px;
          margin-top: 10px;
        }
      }
    }
  }
}

/* vue3-carousel library styling */
.carousel {
  width: 100%;
  padding-left: 10%;
  margin-top: 20px;
}

.carousel__viewport {
  overflow: visible !important;
}

.carousel__item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 500px;
  @media (max-width: 1024px) {
    min-height: 400px;
    .product-image {
    }
    .award {
      font-size: 14px;
    }
    .name {
      font-size: 16px;
    }
    .description {
      font-size: 10px;
    }
  }

  .product-image {
    max-width: 100%;
    width: auto !important;
    height: 350px !important;
    margin-left: -27.5%; // value equal to whitespace between actual product in image and its left edge - added to align image with text above.
    transition: transform 0.3s ease;
    display: block;
  }

  .product-information {
    display: flex;
    flex-direction: column;

    position: absolute;
    left: 0%;
    top: 350px;

    width: 120%;
    padding: 10px;
    text-align: left;
    color: black;
    z-index: 10;

    .award {
      color: #000;
      font-family: "Century Gothic";
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 10px;
      white-space: nowrap !important;
      @media (max-height: 900px) {
        font-size: 12px;
      }
    }
    .name {
      color: #000;
      font-family: "Century Gothic";
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: 1px;
      margin-bottom: 5px;
      text-transform: uppercase;
      white-space: nowrap !important;
      @media (max-height: 900px) {
        font-size: 14px;
      }
    }
    .description {
      color: #000;
      font-family: "Raleway";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.2;
      @media (max-height: 900px) {
        font-size: 12px;
      }
    }

    transform: translateX(100%);
    opacity: 0;
    transition: all 0.4s ease;
  }

  &:hover {
    .product-information {
      display: flex;
      transform: translateX(0%);
      opacity: 1;
    }
    .product-image {
      transform: scale(1.05);
    }
  }
}

.carousel__slide {
  overflow: visible;
}

:deep(.carousel__prev),
:deep(.carousel__next) {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  color: #131313;

  &:hover {
    color: #000;
  }
}
</style>
