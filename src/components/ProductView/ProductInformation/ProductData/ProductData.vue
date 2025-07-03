<script setup>
import NutritionChevron from "./NutritionChevron.vue";
import { computed, inject } from "vue";

const { isMobile } = inject("screenSize");

import { useProductStore } from "@/store/product";
import { useProductStoreCleanup } from "@/store/productCleanup";
const productStore = useProductStore();
const produtStoreCleanup = useProductStoreCleanup();
let localProductData = computed(() => {
  return produtStoreCleanup.currentProduct;
});
function splitNumberAndUnit(input) {
  const number = input.match(/\d+/g)[0]; // Extract digits
  const unit = input.match(/[a-zA-Z]+/g)[0];
  return {
    number,
    unit,
  };
}
let energy = computed(() => {
  let energyValue = localProductData.value.properties["Energy"];
  let { number, unit } = splitNumberAndUnit(energyValue);
  return {
    number,
    unit,
  };
});
let productStatistics = computed(() => [
  {
    type: "Energy",
    chevronValue: `${Math.round(parseInt(energy.value.number) * 4.184)}`, //kj formula
    chevronUnit: "kj",
    note: "",
    outsideChevronValue: energy.value.number,
    outsideChevronUnit: energy.value.unit,
  },
  {
    type: "Protein",
    chevronValue: "",
    chevronUnit: "",
    note: "",
    outsideChevronValue: localProductData.value.properties["Protein"],
    outsideChevronUnit: "",
  },
  {
    type: "Sodium",
    chevronValue: "",
    chevronUnit: "",
    note: "",
    outsideChevronValue: localProductData.value.properties["Sodium"],
    outsideChevronUnit: "",
  },
  {
    type: "Carbs",
    chevronValue: localProductData.value.properties["Carbs"],
    chevronUnit: "",
    note: "of which sugar",
    outsideChevronValue: localProductData.value.properties["of which sugar"],
    outsideChevronUnit: "",
  },
  {
    type: "Total fat",
    chevronValue: localProductData.value.properties["Total fat"],
    chevronUnit: "",
    note: "of which saturated fat",
    outsideChevronValue: localProductData.value.properties["saturated fat"],
    outsideChevronUnit: "",
  },
]);
</script>

<template>
  <section class="product-data">
    <section v-if="!isMobile" class="left-column column">
      <section class="ingredients">
        <h2>Ingredients</h2>
        <p class="ingredients-list">
          <!-- 1 cup of all-purpose flour, 2 tablespoons of sugar, 1 teaspoon of baking powder, 1/2 teaspoon of baking soda, 1/4 teaspoon of salt, 1 cup of buttermilk (or milk with a tablespoon of vinegar or lemon juice as a substitute), 1 large egg, 2 tablespoons of melted butter or oil, and 1/2 teaspoon of vanilla extract. -->
          {{ localProductData.properties["Ingredients EN"] }}
        </p>
      </section>

      <section class="allergens">
        <h2>Allergens</h2>
        <p class="allergens-list">
          <!-- Wheat (from all-purpose flour), eggs, dairy (from buttermilk or milk and butter), and sometimes nuts or soy (depending on the type of oil or additional ingredients used). -->
          {{ localProductData.properties["Allergens EN"] }}
        </p>
      </section>
    </section>

    <section class="right-column column">
      <h2 v-if="!isMobile">
        Nutritional Facts
        <br />
        <span>per 100g</span>
      </h2>
      <ul class="chevron-list">
        <li v-for="(statistic, idx) in productStatistics" :key="statistic.type">
          <NutritionChevron :productId="idx" :statistic="statistic" />
        </li>
      </ul>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.product-data {
  display: flex;
  flex-direction: row;
  height: 60%;
  margin-top: auto;
  margin-bottom: auto;
  justify-content: flex-end;
  .column {
    // width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.left-column {
      justify-content: space-around;
      width: 30%;
      max-width: 30%;
      margin-right: 10%;
      h2 {
        color: #3f3f3d;
        font-family: "Century Gothic";
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin-bottom: 5px;
      }
      p {
        color: #000;
        font-family: "Raleway";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
      }
    }
    &.right-column {
      justify-content: space-around;
      min-width: 50%;
      h2 {
        // height: 10%;
        color: #3f3f3d;
        font-family: "Century Gothic";
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        // margin-bottom: 50px;
        span {
          color: #3f3f3d;
          font-family: "Century Gothic";
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          text-transform: lowercase;
        }
      }
      .chevron-list {
        height: 85%;
        li {
          height: 20%;
        }
      }
    }
  }

  @media (max-width: 450px) {
    height: auto;
    width: 100%;
    .right-column {
      width: 100%;
      .chevron-list {
        height: 100% !important;
        li {
          margin-bottom: 15px;
        }
      }
    }
  }
}
</style>
