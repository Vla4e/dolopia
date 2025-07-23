<script setup>
import { ref, watch } from "vue";

import AwardShowcase from "@/components/AwardsView/AwardShowcase.vue";

import silver from "@/assets/awards/silver.svg";
import gta1 from "@/assets/awards/gta1.svg";
import gta2 from "@/assets/awards/gta2.svg";

let awardsConfig = [
  {
    name: "gta2",
    heading: "two golden stars",
    subheading: "Guild of Fine Food | Great Taste",
    description: `The Great Taste Awards is the world's most trusted food and drink accreditation scheme, celebrating exceptional taste, quality, and craftsmanship. Each product is rigorously blind-tasted by a panel of experts, ensuring only the finest receive recognition. We're proud to showcase our numerous awards, a testament to our commitment to creating products that delight and inspire.`,
    image: gta2,
    index: 0,
  },
  {
    name: "gta1",
    heading: "golden star",
    subheading: "Guild of Fine Food | Great Taste awards",
    description: `The Great Taste Awards is the world's most trusted food and drink accreditation scheme, celebrating exceptional taste, quality, and craftsmanship. Each product is rigorously blind-tasted by a panel of experts, ensuring only the finest receive recognition. We're proud to showcase our numerous awards, a testament to our commitment to creating products that delight and inspire.`,
    image: gta1,
    index: 1,
  },
  {
    name: "silver",
    heading: "silver dalemaine Award",
    subheading: "the Dalemain World Marmalade awards",
    description:
      "This is the culmination of the annual Awards with the competition opening for entries in January each year,  marmalade jars spill out of every part of the house while on display. The new years winner is announced, we have a range of talks and Marmalade panels and tasting of marmalades from around the world. We are joined in our citrus endeavours to further the cause of marmalade everywhere by two sister festivals in Australia and Japan.",
    image: silver,
    index: 2,
  },
];

let isAwardSelected = ref(false);
let selectedAward = ref({});
let slideDirection = ref('forward'); // value should be either "forward" or "backward"


function selectAward(award) {
  if (selectedAward.value.index !== undefined && selectedAward.value.name !== award.name) {
    if (award.index > selectedAward.value.index || (award.index === 0 && selectedAward.value.index === awardsConfig.length - 1)) {
      slideDirection.value = 'forward';
    } else {
      slideDirection.value = 'backward';
    }
  } else if (!selectedAward.value.name) {
    slideDirection.value = 'forward';
  }

  if (award.name !== selectedAward.value.name) {
    selectedAward.value = award;
    isAwardSelected.value = true;
  }
}

function cycleAward(direction) {
  let awardIndexIterator = selectedAward.value.index;
  if (direction === "back") {
    slideDirection.value = 'backward';
    if (awardIndexIterator === 0) {
      awardIndexIterator = awardsConfig.length - 1; // Cycle to last award
    } else {
      awardIndexIterator--;
    }
  } else { // direction === "forward"
    slideDirection.value = 'forward';
    if (awardIndexIterator === awardsConfig.length - 1) {
      awardIndexIterator = 0; // Cycle to first award
    } else {
      awardIndexIterator++;
    }
  }
  selectAward(awardsConfig[awardIndexIterator]);
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
            <img :src="award.image" />
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
        <button
          @click="cycleAward('back')"
          class="nav-button prev-button"
        >
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
        <button
          @click="cycleAward('forward')"
          class="nav-button next-button"
        >
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
  position: relative; // Crucial for absolute positioning of children transitions

  .award-selection {
    width: 100%;
    height: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // ... (rest of .award-selection styles remain the same)
    .text-section {
      background-color: #ceebec;
      height: 55%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 30px;
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
      .award {
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

/* Styling for navigation buttons */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  // background: rgba(255, 0, 0, 0.7); // Example styling
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  z-index: 10; // Ensure buttons are on top
  .chevron{
    width: 30px;
    height: 30px;
    stroke: black;
    transition: transform 0.4s ease;
  }
  &.prev-button {
    left: 0;
    .chevron{
      transform: rotate(180deg);
      &:active{
        transform: translateX(15px), rotate(180deg);
      }
      &:hover{
        transform: translateX(15px), rotate(180deg);

      }
    }
  }
  &.next-button {
    right: 0;
    .chevron{
      &:active{
        transform: translateX(-15px);
        
      }
      &:hover{
        transform: translateX(-15px);

      }
    }
  }
}
</style>