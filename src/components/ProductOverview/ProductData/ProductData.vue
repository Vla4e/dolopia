
<script setup>
import NutritionChevron from './NutritionChevron.vue';
import {ref, watch, onMounted } from 'vue';

let allergens = [1,2,3,4]
let stats = [1,2,3,4, 5]
let ingredients = ['test', 'test2', 'test3', 'test4', 'test5']


</script>

<template>
  <section class="product-data">
    <section class="left-column column">

      <section class="ingredients">
        <h2>
          Ingredients
        </h2>
        <p class="ingredients-list">
          1 cup of all-purpose flour, 2 tablespoons of sugar, 1 teaspoon of baking powder, 1/2 teaspoon of baking soda, 1/4 teaspoon of salt, 1 cup of buttermilk (or milk with a tablespoon of vinegar or lemon juice as a substitute), 1 large egg, 2 tablespoons of melted butter or oil, and 1/2 teaspoon of vanilla extract.
        </p>
      </section>

      <section class="alergens">
        <h2>
          Allergens
        </h2>
        <p class="allergens-list">
          Wheat (from all-purpose flour), eggs, dairy (from buttermilk or milk and butter), and sometimes nuts or soy (depending on the type of oil or additional ingredients used).
        </p>
      </section>

    </section>

    <section class="right-column column">
      <h2>
        Nutritional Facts 
        <br/>
        <span>per 100g</span>
      </h2>
      <ul class="chevron-list">
        <li v-for="(stat,idx) in stats" :key="idx" >
          <NutritionChevron :productId="stat"/>
        </li>
      </ul>
    </section>

  </section>
</template>


<style lang="scss" scoped>
.product-data{
  display: flex;
  flex-direction: row;
  height: 60%;
  margin-top: auto;
  margin-bottom: auto;
  justify-content: flex-end;
  .column{
    // width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.left-column{
      justify-content: space-around;
      width: 30%;
      max-width: 30%;
      margin-right: 10%;
      h2{
        color: #3F3F3D;
        font-family: "Century Gothic";
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin-bottom: 5px;
      }
      p{
        color: #000;
        font-family: "Raleway";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
      }
    }
    &.right-column{
      justify-content: space-around;
      min-width: 50%;
      h2{
        // height: 10%;
        color: #3F3F3D;
        font-family: "Century Gothic";
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        // margin-bottom: 50px;
        span{
          color: #3F3F3D;
          font-family: "Century Gothic";
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          text-transform: lowercase;
        }
      }
      .chevron-list{
        height: 85%;
        li{
          height: 20%;
        }
      }
    }
  }
}
</style>