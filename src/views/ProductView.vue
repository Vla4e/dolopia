<script setup>
import ProductsViewMobile from "@/components/ProductsViewMobile/ProductsViewMobile.vue";
import ProductInformation from "@/components/ProductView/ProductInformation/ProductInformation.vue";
import SelectionInformationPanel from "@/components/ProductView/SelectionInformationPanel.vue";
import ArrowButton from "@/components/ArrowButton.vue";

import { ref, watch, onMounted, onUnmounted, computed, inject } from "vue";
const { isMobile } = inject("screenSize");

import { useProductStoreCleanup } from "@/store/productCleanup.js";
const productStore = useProductStoreCleanup();
const categories = productStore.categories;

import { useRoute } from "vue-router";
const route = useRoute();
watch(
  () => route,
  (val) => {
    // console.log("Route watcher inside component =>", val);
  },
  {
    immediate: true,
  }
);
let isOverviewActive = ref(false);
function triggerOverview() {
  // console.log("OVERVIEW");
  if (isOverviewActive.value) {
    isOverviewActive.value = false;
    currentOverviewPhase.value = "none";
    return;
  } else {
    isOverviewActive.value = true;
  }
}
let currentOverviewPhase = ref("none");

// When product list is finalized, include it.
onMounted(() => {
  if (isMobile.value) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
});
</script>

<template>
  <div class="page-category">
    <ArrowButton
      :routePath="'/catalog'"
      :buttonText="''"
      :showArrow="true"
      :arrowDirection="'left'"
      :showDropdown="false"
      v-if="!isMobile"
      class="catalog-arrow"
    />

    <Transition name="slide-text" mode="out-in">
      <SelectionInformationPanel
        v-show="
          !isMobile &&
          (currentOverviewPhase === 'description' || currentOverviewPhase === 'none')
        "
      />
    </Transition>
    <div v-if="!isMobile" :class="isOverviewActive ? 'inactive' : ''" class="left-panel">
      <div @click="triggerOverview()" class="open-panel">></div>
    </div>

    <div
      v-if="!isMobile"
      @click="triggerOverview()"
      class="right-panel"
      :class="isOverviewActive ? 'active' : ''"
    >
      <div class="panel-half right">
        <ProductInformation
          @phaseChange="
            (newPhase) => {
              currentOverviewPhase = newPhase;
            }
          "
          :isOverviewActive="isOverviewActive"
        />
      </div>
    </div>

    <div class="categories-selection">
      <button
        v-for="category in categories"
        :key="category"
        class="item"
        :class="productStore.selectedCategoryId === category ? 'active' : ''"
        @click="productStore.selectCategory(category)"
      >
        {{ productStore.categoryFullNames[category] || "" }}
      </button>
    </div>

    <ArrowButton
      :routePath="'/all-products'"
      :buttonText="'View other products'"
      :showArrow="true"
      :arrowDirection="'right'"
      :showDropdown="false"
      v-if="!isMobile"
      class="all-products-arrow"
    />
    <!-- <ProductsViewMobile v-if="isMobile" /> -->
  </div>
</template>

<style lang="scss" scoped>
.all-products-arrow {
  position: absolute;
  bottom: 5vh;
  z-index: 1001;
  right: 4vw;
}
.catalog-arrow {
  position: absolute;
  top: 20vh;
  z-index: 4;
  left: 5%;
}
.left-panel {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  z-index: 2;
  background-color: #ceeaec;
  position: absolute;
  transition: transform ease-in-out 0.5s, opacity 0.5s ease;
  &.inactive {
    transform: translateX(-100%);
    z-index: 3;

    .open-panel {
      opacity: 1;
      z-index: 3000;
    }
  }
  .open-panel {
    width: 25px;
    height: 50px;
    background-color: #ceeaec;
    align-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translatex(100%);
    border-top-right-radius: 200px;
    border-bottom-right-radius: 200px;
    z-index: 2000;
    background-color: #ceeaec;
    opacity: 0;
    cursor: pointer; // Add cursor pointer for better UX

    // Add hover effect for better UX
    &:hover {
      background-color: #b8dde0;
    }
  }
}
.right-panel {
  width: 100%;
  height: 100%;
  // background-color: #CEEAEC;
  z-index: 1;
  &.active {
  }
}
.page-category {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  // display: flex;
  position: relative;
  @media (max-width: 450px) {
    background-image: url("@/assets/product_overview/background-mobile.png");
    background-size: cover;
    background-repeat: no-repeat;
  }
  .panel-container {
    display: grid;
    grid-template-columns: 50% 50%;
    width: 100%;
    height: 100%;
    transition: grid-template-columns ease 1s;
    .panel-half {
      display: flex;
      width: 100%;
      height: 100%;
      max-height: 100vh;
      &.left {
        background-color: #ceeaec;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        margin-left: auto;
        margin-right: auto;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      &.right {
        .subcategory-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
.panel-container {
  &.overview {
    grid-template-columns: 0% 100%;
    .left {
    }
    .right {
      z-index: 1;
    }
  }
}

.categories-selection {
  position: absolute;
  right: 2vw;
  top: 15vh;
  // transform: translate(-100%, 100%);
  display: flex;
  flex-direction: column;
  color: black;
  z-index: 10;
  .item {
    margin-bottom: 10px;
    color: #44a0ad;
    text-align: right;
    font-family: "Raleway";
    font-size: 12px;
    @media (min-width: 1900px) {
      font-size: 16px;
    }
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 133.333% */
    letter-spacing: 1.08px;
    &.active {
      color: #000;
      font-family: "Raleway";
      font-size: 13px;
      @media (min-width: 1900px) {
        font-size: 17px;
      }
      font-style: normal;
      font-weight: 700;
      line-height: 16px; /* 123.077% */
      letter-spacing: 1.17px;
    }
  }
}

.slide-text {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-text-enter-active,
.slide-text-leave-active {
  // position: absolute;
}
.slide-text-enter-from,
.slide-text-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-text-enter-to,
.slide-text-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
