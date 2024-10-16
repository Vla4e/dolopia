<template>
  <div class="left-content">
    <h1 class="current-selection">
      <span class="category">
        {{ routeParamsStore.categoriesFullNames[routeParamsStore.category] }}
        <!-- <ManualCarousel /> -->
        <Dropdown :dropdownAlignment="'left'"/>
      </span>
      <span class="vertical-line"/>
      <span class="subcategory">
        <!-- <ManualCarousel /> -->
        {{ routeParamsStore.subcategory }}
        <Dropdown :dropdownAlignment="'center'"/>
      </span>
    </h1>
    <div class="suggested-product-container">
      <h2 class="product-name">
        <span class="large-text">
          STRAWBERRY
        </span>
        <span class="medium-text">
          with mint & pepper
        </span>
      </h2>
      <p class="product-description">
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
  </div>
</template>

<script setup>

import { useRouteParamsStore } from '@/store/routeParams.js'
import Dropdown from '../Dropdown.vue';
import ManualCarousel from '../VerticalCarousel/ManualCarousel.vue';
const routeParamsStore = useRouteParamsStore();
</script>

<style lang="scss" scoped>
.left-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  height: 100%;
  position: absolute;
  z-index:3;
  .current-selection{
    display: flex;
    width: 79%;
    margin-left: auto;
    margin-right: auto;
    .category{
      font-family: 'Century Gothic';
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      color: black;
      display: flex;
    }
    .vertical-line{
      width: 2px;
      height: 100%;
      background-color: black;
      margin-left: 10px;
      margin-right: 10px;
    }
    .subcategory{
      font-family: "Century Gothic";
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      color: black;
      text-transform: uppercase;
      display: flex;
    }
  }
  .suggested-product-container{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    .product-name{
      display: flex;
      flex-direction: column;
      width: 100%;
      .large-text{
        font-family: "Century Gothic";
        font-weight: 400;
        font-style: normal;
        font-size: 64px;
        color: black;
      }
      .medium-text{
        font-family: "Century Gothic";
        font-weight: 400;
        font-style: normal;
        font-size: 24px;
        color: black;
      }
    }
    .product-description{
      font-family: "Raleway";
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: black;
      max-width: 50%;
    }
  }
}
</style>