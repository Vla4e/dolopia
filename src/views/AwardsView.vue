<script setup>
import AwardShowcase from "@/components/AwardsView/AwardShowcase.vue";

import { gta1, gta2, silver } from "@/assets/products/awardedProducts";
import { allProductMap } from "@/assets/products/allProductMap";

import { ref, watch, inject } from "vue";
const { isMobile } = inject("screenSize");

let awardsConfig = ref([
  {
    name: "gta2",
    heading: "two golden stars",
    subheading: "Guild of Fine Food | Great Taste",
    subheadingMobile: "Guild of Fine Food<br/>Great Taste",
    description: `The Great Taste Awards is the world's most trusted food and drink accreditation scheme, celebrating exceptional taste, quality, and craftsmanship. Each product is rigorously blind-tasted by a panel of experts, ensuring only the finest receive recognition. We're proud to showcase our numerous awards, a testament to our commitment to creating products that delight and inspire.`,
    image: new URL("@/assets/awards/gta2.svg", import.meta.url).href,
    index: 0,
    show: false,
  },
  {
    name: "gta1",
    heading: "golden star",
    subheading: "Guild of Fine Food | Great Taste awards",
    subheadingMobile: "Guild of Fine Food</br>Great Taste awards",
    description: `The Great Taste Awards is the world's most trusted food and drink accreditation scheme, celebrating exceptional taste, quality, and craftsmanship. Each product is rigorously blind-tasted by a panel of experts, ensuring only the finest receive recognition. We're proud to showcase our numerous awards, a testament to our commitment to creating products that delight and inspire.`,
    image: new URL("@/assets/awards/gta1.svg", import.meta.url).href,
    index: 1,
    show: false,
  },
  {
    name: "silver",
    heading: "silver dalemaine Award",
    subheading: "the Dalemain World Marmalade awards",
    subheadingMobile: "the Dalemain World</br>Marmalade awards",
    description:
      "This is the culmination of the annual Awards with the competition opening for entries in January each year,  marmalade jars spill out of every part of the house while on display. The new years winner is announced, we have a range of talks and Marmalade panels and tasting of marmalades from around the world. We are joined in our citrus endeavours to further the cause of marmalade everywhere by two sister festivals in Australia and Japan.",
    image: new URL("@/assets/awards/silver.svg", import.meta.url).href,
    index: 2,
    show: false,
  },
]);

let isAwardSelected = ref(false);
let selectedAward = ref({});
let slideDirection = ref("forward"); // value should be either "forward" or "backward"

function selectAward(award) {
  if (isMobile.value) return;
  if (
    selectedAward.value.index !== undefined &&
    selectedAward.value.name !== award.name
  ) {
    if (
      award.index > selectedAward.value.index ||
      (award.index === 0 && selectedAward.value.index === awardsConfig.value.length - 1)
    ) {
      slideDirection.value = "forward";
    } else {
      slideDirection.value = "backward";
    }
  } else if (!selectedAward.value.name) {
    slideDirection.value = "forward";
  }

  if (award.name !== selectedAward.value.name) {
    selectedAward.value = award;
    isAwardSelected.value = true;
  }
}

function cycleAward(direction) {
  let awardIndexIterator = selectedAward.value.index;
  if (direction === "back") {
    slideDirection.value = "backward";
    if (awardIndexIterator === 0) {
      awardIndexIterator = awardsConfig.value.length - 1; // Cycle to last award
    } else {
      awardIndexIterator--;
    }
  } else {
    // direction === "forward"
    slideDirection.value = "forward";
    if (awardIndexIterator === awardsConfig.value.length - 1) {
      awardIndexIterator = 0; // Cycle to first award
    } else {
      awardIndexIterator++;
    }
  }
  selectAward(awardsConfig.value[awardIndexIterator]);
}

function getAwardProducts(awardName) {
  const productArrays = {
    gta1: gta1,
    gta2: gta2,
    silver: silver,
  };
  const productList = productArrays[awardName].map((product) => {
    return allProductMap.get(product);
  });
  return productList;
}

function toggleAwardProducts(award) {
  if(isMobile.value){
    award.show = !award.show;
  }
}
</script>

<template>
  <div class="awards-page-container">
    <Transition name="slide-awards">
      <div v-if="!isAwardSelected" class="award-selection">
        <div class="text-section">
          <h2>
            Honored for <br />
            quality and flavor
          </h2>
          <p>Recognized by experts around the world</p>
        </div>
        <div class="select-section">
          <div
            v-for="award in awardsConfig"
            :key="award.name"
            class="award"
            :class="{ selected: selectedAward.name === award.name }"
            @click="selectAward(award)"
          >
            <img v-if="!isMobile" class="award-icon" :src="award.image" />
            <div v-else @click="toggleAwardProducts(award)" class="award-content">
              <img class="award-icon" :src="award.image" />
              <div v-if="isMobile" class="award-info">
                <div class="award-text">
                  <h3 class="award-name">{{ award.heading }}</h3>
                  <p class="awarding-body" v-html="award.subheadingMobile"></p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 9 9"
                  fill="none"
                  class="plus-icon"
                >
                  <rect x="4" width="1" height="9" fill="#231F20" />
                  <rect
                    x="9"
                    y="4"
                    width="1"
                    height="9"
                    transform="rotate(90 9 4)"
                    fill="#231F20"
                  />
                </svg>
              </div>
            </div>
            <Transition v-if="isMobile" name="accordion">
              <ul
                v-show="award.show"
                key="awarded-products"
                class="awarded-products list"
              >
                <router-link
                  class="product"
                  v-for="product in getAwardProducts(award.name)"
                  :key="product"
                  :to="`/projects/${product.keyToCategory}-project/${product.keyToSubcategory}/${product.pathSlug}`"
                >
                  <span class="product-name">{{ product["Product name EN"] }}</span>
                  <span class="product-award">{{ product["Award"] }}</span>
                  <span class="product-comments">{{ product["Judges Comments"] }}</span>
                </router-link>
              </ul>
            </Transition>
          </div>
        </div>
      </div>
      <div v-else class="award-selected-wrapper">
        <Transition
          :name="slideDirection === 'forward' ? 'slide-forward' : 'slide-backward'"
          tag="div"
          class="award-transition-container"
        >
          <div :key="selectedAward.name" class="award-showcase-content">
            <AwardShowcase :award="selectedAward" />
          </div>
        </Transition>
        <button @click="cycleAward('back')" class="nav-button prev-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#131313"
            class="bi bi-chevron-right chevron"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </button>
        <button @click="cycleAward('forward')" class="nav-button next-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#131313"
            class="bi bi-chevron-right chevron"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.awards-page-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  background-color: white;
  position: relative;

  .award-selection {
    width: 100%;
    height: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media (max-width: 450px) {
      justify-content: flex-start;
    }
    .text-section {
      background-color: #ceebec;
      height: 55%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 30px;
      @media (max-width: 450px) {
        height: 50vh;
      }
      h2 {
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
        @media (min-width: 1400px) and (max-height: 900px) {
          font-size: 64px;
          letter-spacing: 5.75px;
          margin-bottom: 20px;
        }
        @media (max-width: 450px) {
          color: #000;
          text-align: center;
          font-family: "Century Gothic";
          font-size: 36px;
          font-style: normal;
          font-weight: 400;
          line-height: 40px; /* 111.111% */
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }
      }
      p {
        color: #000;
        text-align: center;
        font-family: "Raleway";
        font-size: 32px;
        font-style: normal;
        font-weight: 400;
        line-height: 75%; /* 75% */
        @media (min-width: 1400px) and (max-height: 900px) {
          font-size: 28px;
        }
        @media (max-width: 450px) {
          color: #000;
          text-align: center;
          font-family: Raleway;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 18px; /* 112.5% */
        }
      }
    }
    .select-section {
      background-color: white;
      height: 45%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 4vh;
      @media (min-width: 1400px) and (max-height: 900px) {
        padding-top: 1vh;
      }
      @media (max-width: 450px) {
        flex-direction: column;
        align-items: center;
      }
      .award {
        @media(max-width: 450px){
          width: 90%;
        }
        @media(min-width: 450px){
          min-width: 190px;
          min-height: 190px;
        }
          &:not(:last-child) {
            margin-right: 5vw;
          }
        .award-content {
          display: flex;
          justify-content: center;
          min-width: 190px;
          min-height: 190px;
          @media (min-width: 1400px) and (max-height: 900px) {
            max-width: 240px;
            max-height: 240px;
          }
          &:not(:last-child) {
            margin-right: 5vw;
          }
          img {
            width: 80%;
            height: 80%;
            cursor: pointer;
            transition: transform ease 0.3s;
            &:hover {
              transform: scale(1.05);
            }
          }
          &.selected {
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
          @media (max-width: 450px) {
            justify-content: center;
            align-items: center;
            margin-right: 0 !important;
            width: 100%;
            height: auto;
            .award-icon {
              width: 40%;
              margin-right: 15px;
              max-width: 150px;
              max-height: 150px;
              // box-shadow: -4px 5px 2px 0 rgba(138, 195, 199, 0.5);
            }
            .award-info {
              display: flex;
              align-items: center;
              // flex-direction: column;
              width: 100%;
              height: 100%;
              min-height: 90px;
              .award-text {
                display: flex;
                flex-direction: column;
                width: 80%;
                height: 100%;
                gap: 10px;
                justify-content: space-around;
                .award-name {
                  color: #000;
                  font-family: "Century Gothic";
                  font-size: 15px;
                  font-style: normal;
                  font-weight: 700;
                  line-height: 1.6; /* 160% */
                  letter-spacing: 0.75px;
                  text-transform: uppercase;
                  @media (max-width: 390px) {
                    font-size: 13px;
                  }
                }

                .awarding-body {
                  color: #000;
                  font-family: "Century Gothic";
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 1.2;
                  letter-spacing: 1.26px;
                  text-transform: capitalize;
                  @media (max-width: 390px) {
                    font-size: 12px;
                  }
                }
              }
              .plus-icon {
                // width: 10px;
                width: 12px;
                height: 12px;
                margin-left: 15px;
              }
            }
          }
        }
        @media (max-width: 450px) {
          .awarded-products {
            padding-left: 5px;
            .product {
              display: flex;
              flex-direction: column;
              padding-bottom: 20px;
              margin-bottom: 30px;
              gap: 10px;
              border-bottom: 1px solid #8ac3c7;
              .product-name {
                color: #000;
                font-family: "Century Gothic";
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 1.2; /* 156.25% */
                letter-spacing: 0.8px;
                text-transform: capitalize;
              }
              .product-award {
                color: #000;
                font-family: "Century Gothic";
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 1.2; /* 156.25% */
                letter-spacing: 0.8px;
                text-transform: capitalize;
              }
              .product-comments {
                color: #000;
                font-family: Raleway;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 1.3; /* 133.333% */
              }
            }
          }
        }
      }
    }
  }

  .award-selected-wrapper {
    width: 100%;
    height: 100%;
    position: relative; // Establish a positioning context for absolute children
    overflow: hidden; // Hide parts of the sliding elements outside this container

    .award-transition-container {
      width: 100%;
      height: 100%;
      position: relative; // Important: this div acts as the container for the transitioning content
      // If you're using `tag="div"` on <Transition>, its generated element
      // needs to have position: relative to be the positioning context for its absolute children.
    }

    .award-showcase-content {
      // This is the element that actually transitions
      width: 100%;
      height: 100%;
      position: absolute; // Make it absolute so it can overlap
      top: 0;
      left: 0;
    }
  }
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  background-color: none;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  z-index: 10;
  .chevron {
    width: 30px;
    height: 30px;
    stroke: black;
    transition: transform 0.4s ease;
  }
  &.prev-button {
    left: 0;
    .chevron {
      transform: rotate(180deg);
      &:active {
        transform: translateX(15px), rotate(180deg);
      }
      &:hover {
        transform: translateX(15px), rotate(180deg);
      }
    }
  }
  &.next-button {
    right: 0;
    .chevron {
      &:active {
        transform: translateX(-15px);
      }
      &:hover {
        transform: translateX(-15px);
      }
    }
  }
}

/* Transitions for the initial display of award-selected */
.slide-awards-enter-active,
.slide-awards-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: transform 0.7s ease;
}

.slide-awards-enter-from {
  transform: translateX(100%);
}

.slide-awards-enter-to {
  transform: translateX(0%);
}

.slide-awards-leave-from {
  transform: translateX(0%);
}

.slide-awards-leave-to {
  transform: translateX(-100%);
}

/* Transitions for cycling through awards */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-backward-enter-active,
.slide-backward-leave-active {
  transition: transform 0.7s ease;
  // Crucial: These apply to the .award-showcase-content, which is already absolute
  // The transition class itself doesn't need to apply `position: absolute` here
  // because the element it's targeting (.award-showcase-content) already has it.
}

.slide-forward-enter-from {
  transform: translateX(100%);
}
.slide-forward-leave-to {
  transform: translateX(-100%);
}

.slide-backward-enter-from {
  transform: translateX(-100%);
}
.slide-backward-leave-to {
  transform: translateX(100%);
}
/* Accordion transition for awarded products */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.4s ease;
  transform-origin: top;
}

.accordion-enter-from {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}

.accordion-enter-to {
  opacity: 1;
  max-height: 500px; /* Adjust based on your content */
  transform: scaleY(1);
}

.accordion-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: scaleY(1);
}

.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}
</style>
