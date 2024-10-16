
<script setup>
import OverviewSolution from '@/components/ProductOverview/OverviewSolution.vue';
import CurrentlyViewing from '@/components/ProductOverview/CurrentlyViewing.vue';

import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useRouteParamsStore } from '@/store/routeParams.js'

const routeParamsStore = useRouteParamsStore();
const route = useRoute();
const router = useRouter();
let isOverviewActive = ref(false);
function triggerOverview(){
  if(isOverviewActive.value){
    return
  }
  else {
    isOverviewActive.value = true;
  }
}
let currentOverviewPhase = ref('none')

// When product list is finalized, include it.


</script>

<template>
  <div class="page-category">
    <Transition name="slide-text" mode="out-in">
      <CurrentlyViewing v-if="currentOverviewPhase === 'description' || currentOverviewPhase === 'none'"/>
    </Transition>
    <div :class="isOverviewActive ? 'inactive': ''"class="left-panel">
    </div>
    <div @click="triggerOverview()" class="right-panel" :class="isOverviewActive ? 'active' : ''">
      <div class="panel-half right">
        <OverviewSolution @phaseChange="(newPhase) => {currentOverviewPhase = newPhase}" :isOverviewActive="isOverviewActive"/>
      </div>
    </div>
    <!-- <div :class="isOverviewActive ? 'overview' : ''" class="panel-container">

      <div class="panel-half left">

      </div>

    </div> -->
  </div>
</template>


<style lang="scss" scoped>
.left-panel{
  width: 50%;
  height: 100%;
  z-index: 2;
  background-color: #CEEAEC;
  position: absolute;
  transition: transform ease-in-out 0.5s, opacity 0.5s ease;
  &.inactive{
    transform: translateX(-100%);
    opacity: 0;
  }
}
.right-panel{
  width: 100%;
  height: 100%;
  // background-color: #CEEAEC;
  z-index: 1;
  &.active{
  }
}
.page-category{
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  // display: flex;
  position: relative;
  // .left-content{
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   justify-content: center;
  //   width: 40%;
  //   height: 100%;
  //   position: absolute;
  //   z-index:3;
  //   .current-selection{
  //     display: flex;
  //     width: 79%;
  //     margin-left: auto;
  //     margin-right: auto;
  //     .category{
  //       font-family: 'Century Gothic';
  //       font-weight: 400;
  //       font-style: normal;
  //       font-size: 20px;
  //       color: black;
  //     }
  //     .vertical-line{
  //       width: 2px;
  //       height: 100%;
  //       background-color: black;
  //       margin-left: 10px;
  //       margin-right: 10px;
  //     }
  //     .subcategory{
  //       font-family: "Century Gothic";
  //       font-weight: 400;
  //       font-style: normal;
  //       font-size: 20px;
  //       color: black;
  //       text-transform: uppercase;
  //     }
  //   }
  //   .suggested-product-container{
  //     width: 80%;
  //     margin-left: auto;
  //     margin-right: auto;
  //     .product-name{
  //       display: flex;
  //       flex-direction: column;
  //       width: 100%;
  //       .large-text{
  //         font-family: "Century Gothic";
  //         font-weight: 400;
  //         font-style: normal;
  //         font-size: 64px;
  //         color: black;
  //       }
  //       .medium-text{
  //         font-family: "Century Gothic";
  //         font-weight: 400;
  //         font-style: normal;
  //         font-size: 24px;
  //         color: black;
  //       }
  //     }
  //     .product-description{
  //       font-family: "Raleway";
  //       font-weight: 400;
  //       font-style: normal;
  //       font-size: 16px;
  //       color: black;
  //       max-width: 50%;
  //     }
  //   }
  // }
  .panel-container{
    display: grid;
    grid-template-columns: 50% 50%;
    width: 100%;
    height: 100%;
    transition: grid-template-columns ease 1s;
    .panel-half{
      display: flex;
      width: 100%;
      height: 100%;
      max-height: 100vh;
      &.left{
        background-color: #CEEAEC;
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
      &.right{
        .subcategory-image{
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
.panel-container{
  &.overview{
    grid-template-columns: 0% 100%;
    .left{
    }
    .right{
      z-index:1;
    }
  }
}

.slide-text{
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-text-enter-active, .slide-text-leave-active {
  // position: absolute;
}
.slide-text-enter-from, .slide-text-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-text-enter-to, .slide-text-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>