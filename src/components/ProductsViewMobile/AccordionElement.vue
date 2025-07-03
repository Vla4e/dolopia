<script setup>
import chevron from "@/assets/dropdown/down-arrow.png";
import { ref } from "vue";
import ProductData from "@/components/ProductView/ProductInformation/ProductData/ProductData.vue";

const props = defineProps({
  heading: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  productDataAccordion: {
    type: Boolean,
    required: false,
    default: false,
  },
});

let toggled = ref(false);
function toggleAccordion() {
  toggled.value = !toggled.value;
}
</script>

<template>
  <div :key="heading" class="accordion-container">
    <h2 @click="toggleAccordion()" class="heading">
      <span>{{ heading }}</span>
      <img :class="toggled ? 'toggled' : ''" class="chevron" :src="chevron" />
    </h2>
    <div class="blue-line" />
    <Transition name="accordion">
      <div v-if="toggled" class="accordion-content">
        <p v-if="!productDataAccordion" class="text">
          {{ text }}
        </p>
        <ProductData v-else />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.accordion-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .heading {
    display: flex;
    width: 100%;
    align-items: center;
    color: #000;
    font-family: "Century Gothic", sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 25px;
    letter-spacing: 0.8px;
    text-transform: capitalize;
    cursor: pointer;

    .chevron {
      width: 15px;
      transition: transform 0.3s ease;
      &.toggled {
        transform: rotate(180deg);
      }
    }
  }

  .blue-line {
    width: 100%;
    height: 2px;
    background-color: #8ac3c7;
    margin-top: 15px;
    margin-bottom: 25px;
  }

  .accordion-content {
    overflow: hidden;
    width: 100%;
    .text {
      color: #000;
      font-family: "Raleway", sans-serif;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 25px;
    }
  }
}

// Improved accordion transition
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  max-height: 300px; // Adjust this value based on your maximum content height
  opacity: 1;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-leave-active {
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease 0.1s; // Delay opacity transition when closing
}
</style>
