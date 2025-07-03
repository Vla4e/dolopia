<script setup>
import chevron from "@/assets/dropdown/down-arrow.png";
import ProductData from "@/components/ProductView/ProductInformation/ProductData/ProductData.vue";
import AccordionElement from "./AccordionElement.vue";
import { ref, watch, onMounted, reactive, computed } from "vue";

import { useProductStore } from "@/store/product";
const productStore = useProductStore();
let localProductData = computed(() => {
  return productStore.productData;
});

let isBroughtUp = ref(false);
function toggleMenu() {
  // console.log("toggling");
  isBroughtUp.value = !isBroughtUp.value;
}
</script>

<template>
  <div :class="isBroughtUp ? 'brought-up' : ''" class="data-container">
    <img
      :class="isBroughtUp ? 'brought-up' : ''"
      class="chevron"
      @click="toggleMenu()"
      :src="chevron"
    />
    <div class="data-list">
      <AccordionElement
        :heading="'Serving Suggestion'"
        :text="localProductData.properties['Serving suggestion EN']"
      />
      <AccordionElement
        v-if="localProductData.properties['Award']"
        :heading="'Awards'"
        :text="localProductData.properties['Award']"
      />
      <AccordionElement
        v-if="localProductData.properties['consumers comments']"
        :heading="'User Reviews'"
        :text="localProductData.properties['consumers comments']"
      />
      <AccordionElement
        :heading="'Tags'"
        :text="localProductData.properties['Tags Eng']"
      />
      <AccordionElement
        :heading="'Allergens'"
        :text="localProductData.properties['Allergens EN']"
      />
      <AccordionElement
        :heading="'Ingredients'"
        :text="localProductData.properties['Ingredients EN']"
      />
      <AccordionElement
        :heading="'Nutritional Facts'"
        :text="localProductData.properties['Tags Eng']"
        :productDataAccordion="true"
      />
    </div>
    <!-- Nutrition Data Phase -->
  </div>
</template>

<style scoped lang="scss">
.data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 50px 50px 0px 0px;
  background: #fff;
  position: relative;
  padding-top: 10%;
  transition: transform 0.3s ease;
  z-index: 2000;
  &.brought-up {
    transform: translateY(-50%);
  }
  .chevron {
    position: absolute;
    left: 50%;
    top: 3%;
    transform: rotate(180deg) translate(50%, 0%);
    width: 15px;
    transition: transform 0.3s ease;
    &.brought-up {
      transform: rotate(360deg) translate(-50%, 0%);
    }
  }
  .data-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  // .product-data{
  //   width: 60%;
  // }
}
</style>
