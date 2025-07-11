<script setup>
import placeholderImage from "@/assets/products/product-images/placeholder/placeholder-compressed.png";

let projects = ["tomato-project", "vegetable-project", "pasta-project", "fruit-project"];

import { useRoute } from "vue-router";
const route = useRoute();

import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useProductStoreCleanup } from "@/store/productCleanup";
import { splitProductName } from "@/helpers/splitProductName";
const productStore = useProductStoreCleanup();

import {
  categoryToSubcategory,
  subcategoryFullNames,
} from "@/assets/products/categoryToSubcategory";
import { subcategoryToProductCodes } from "@/assets/products/subcategoryToProducts";
import { allProductMap } from "@/assets/products/allProductMap";

// --- Component setup ---
let selectedProject = ref("tomato-project");
let selectedSubcategory = ref(null);
let isLoading = ref(false);

watch(selectedProject, async (newProject, oldProject) => {
  console.log("firing watcher SPROJECT");
  if (newProject !== oldProject) {
    isLoading.value = true;
    await nextTick();
    setTimeout(() => { // visuals break without delay between (race condition between subcat and project watchers) :/
      isLoading.value = false;
    }, 200);
  }
});

watch(selectedSubcategory, async (newSubcategory, oldSubcategory) => {
  console.log("firing watcher SCATEGORY");
  if (newSubcategory !== oldSubcategory) {
    isLoading.value = true;
    await nextTick();
    setTimeout(() => { // visuals break without delay between (race condition between subcat and project watchers) :/
      isLoading.value = false;
    }, 200);
  }
});


const processedProductsBySubcategory = computed(() => {
  const processedMap = new Map();
  let subcategoryKeys = categoryToSubcategory.get(selectedProject.value);

  if (!subcategoryKeys) {
    return processedMap;
  }

  let keysToProcess = subcategoryKeys;
  if (selectedSubcategory.value) {
    keysToProcess = [selectedSubcategory.value].filter(key => subcategoryKeys.includes(key));
  }

  for (const subcatKey of keysToProcess) {
    const productCodeArray = subcategoryToProductCodes.get(subcatKey) || [];
    const productsWithSplitNames = productCodeArray
      .map((productCode) => {
        const product = allProductMap.get(productCode);
        if (!product) {
          console.warn(`Product not found for code: ${productCode}`);
          return null;
        }
        const { firstPart, secondPart } = splitProductName(product["Product name EN"]);
        return {
          ...product,
          id: productCode,
          nameFirstPart: firstPart,
          nameSecondPart: secondPart,
        };
      })
      .filter((p) => p !== null);

    processedMap.set(subcatKey, productsWithSplitNames);
  }

  return processedMap;
});

const subcategoryKeysArray = computed(() =>
  Array.from(categoryToSubcategory.get(selectedProject.value) || [])
);

function selectProject(project){
  console.log("SELECTING PROJECT", project);
  if(project === selectedProject.value){
    return;
  }
  selectedProject.value = project;
  selectedSubcategory.value = null;
}

function selectSubcategory(subcategory){
  console.log("SELECTING SUBCAT", subcategory);
  if(subcategory === selectedSubcategory.value){
    selectedSubcategory.value = null; //deselect 
  } else {
    console.log("inside else");
    selectedSubcategory.value = subcategory;
    console.log("AFTER INSIDE ELSE", selectedSubcategory.value);
  }
}

// Main watch for route parameters to drive component state
watch(
  () => route.params,
  async (newParams, oldParams) => {
    console.log("ROUTE PARAMS CHANGED:", newParams);

    const newCategory = newParams.category || "tomato-project";
    const newSubcategory = newParams.subcategory || null;

    // --- Step 1: Update selectedProject ---
    if (newCategory !== selectedProject.value) {
      selectedProject.value = newCategory;
      await nextTick();
      console.log("NEXTTICK after project change, DOM should be ready for new subcategories");
    }

    if (newSubcategory !== selectedSubcategory.value) {
      const currentProjectSubcategories = categoryToSubcategory.get(selectedProject.value) || [];
      if (newSubcategory && !currentProjectSubcategories.includes(newSubcategory)) {
          selectedSubcategory.value = null;
          console.warn(`Route subcategory '${newSubcategory}' not found for project '${selectedProject.value}'. Resetting selectedSubcategory.`);
      } else {
          selectedSubcategory.value = newSubcategory;
      }
    }

    isLoading.value = true;
    await nextTick(); // Wait for state changes to be reflected in DOM before hiding skeleton
    setTimeout(() => {
      isLoading.value = false;
    }, 200); // Small delay for visual effect
  },
  { immediate: true, deep: true } // run on initial load
);

</script>

<template>
  <div class="all-products-container">
    <section class="selection">
      <Transition name="slide-horizontal" mode="out-in">
        <h1 class="project-name short-slide" :key="selectedProject">{{productStore.categoryFullNames[selectedProject]}}</h1>
      </Transition>

      <div class="menus">
        <div class="projects">
          <div
            v-for="(project, idx) in projects"
            @click="selectProject(project)"
            :key="project"
            class="project"
            :class="{'active': project === selectedProject}"
            >
              {{ productStore.categoryFullNames[project] }}
            </div>
        </div>

        <div class="subcategories">
          <div
            v-for="subcategory in subcategoryKeysArray"
            @click="selectSubcategory(subcategory)"
            :key="subcategory"
            class="subcategory"
            :class="{'active': subcategory === selectedSubcategory}"
          >
            {{ subcategoryFullNames[subcategory] }}
            </div>
        </div>
      </div>
    </section>

    <section class="listing">
      <div class="subcategory-sections">
        <div
          v-for="[subcategoryKey, products] in processedProductsBySubcategory"
          :key="subcategoryKey"
          class="subcategory-section"
          :class="{ 'transitioning': isLoading, 'loading-state': isLoading, 'single': processedProductsBySubcategory.size === 1}"
          :ref="subcategoryKey"
        >

          <div class="subcategory-panel">
            <Transition name="slide-horizontal" mode="out-in">
              <h2 class="subcategory-name long-slide" :key="subcategoryKey">
                <span v-for="word in subcategoryFullNames[subcategoryKey].split(' ')">
                  {{ word }}
                </span>
              </h2>
            </Transition>
          </div>

          <div class="product-grid">
            <TransitionGroup name="fade-staggered" tag="div" class="product-grid-inner">
              <router-link
                v-for="(product, index) in products"
                :key="product.id" class="grid-item"
                :style="{ '--delay': `${0.4 + index * 0.1}s` }"
                :to="'/projects/'+ selectedProject + '/' + subcategoryKey + '/' + product.path"
              >
                <div class="texts">
                  <h3 class="name">
                    <span class="top-part">
                      {{ product.nameFirstPart }}
                    </span>
                    <span class="bottom-part">
                      {{ product.nameSecondPart }}
                    </span>
                  </h3>
                  <span class="description">
                    {{ product["Short Description EN"] }}
                  </span>
                </div>
                <img :src="product.mainImage" class="image" :alt="product['Product name EN']" />
              </router-link>
            </TransitionGroup>
          </div>

          <div class="horizontal-border"/>
        </div>
      </div>
    </section>
  </div>
</template>


<style lang="scss" scoped>
.all-products-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100%;
  padding-top: 20vh;
  background-color: #E6F6F6;
  .selection {
    display: flex;
    width: 100%;
    color: black;
    padding-left: 2vw; // 2.28% of whole navbar width
    padding-right: 5vw;
    margin-bottom: 2vh;
    .project-name {
      width: 50%;
      color: #000;
      font-family: "Century Gothic";
      font-size: 64px;
      font-style: normal;
      font-weight: 400;
      line-height: 1; /* 37.5% */
      @media(max-width: 1600px){
        font-size: 56px;
      }
    }
    .menus {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-self: flex-end;
      align-self: flex-end;
      .projects {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        color: #44A0AD;
        text-align: right;
        font-family: "Raleway";
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 16px; /* 114.286% */
        letter-spacing: 1.26px;
        .project{
          transition: color 0.3s ease-out, font-weight 0.3s ease-out;
          cursor: pointer;
          
          // &:not(:last-child)::after {
          //   content: " | ";
          // }
          
          &.active {
            color: #000;
            font-weight: 700;
          }
        }
      }
      .subcategories {
        // width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start; // Add this
        color: #44A0AD;
        text-align: right;
        font-family: "Raleway";
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 133.333% */
        letter-spacing: 1.08px;
        margin-top: 10px;
        .subcategory{
          margin-right: 20px;
          flex-shrink: 0;
          cursor: pointer;
          // background: red;
          &::after, &::before {
            content: " | ";
          }
          &.active{
            color: #000;
          }
        }
      }
    }
  }

  .listing {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 70vh;
    flex-grow: 1;
    padding-bottom: 130px;
    background: #2B565D;
    position: relative;
    .subcategory-sections{
      display: flex; // Ensures it can control its children's alignment
      flex-direction: column;
      flex: 1;
    }
    .subcategory-section {
      display: flex;
      width: 100%;
      background: #ceebec;

      &.loading-state {
        min-height: 100vh;
      }
      &.single{
        // height: 100vh;
        height: 100%;
      }
      .horizontal-border{
        height: 1px;
        background-color: #AFD6D9;
        width: 100%;
        position: absolute;
        // bottom: 10px;
        // z-index: 30000;
      }
    }
    .subcategory-panel {
      width: 30%;
      // height: 100%;
      // background: lightblue;
      // border-bottom: 1px solid #AFD6D9;
      // box-shadow: inset 0 -1px 0 #AFD6D9; //border-bottom adds 1px which misaligns with grid drawn bottom borders
      .subcategory-name {
        padding-left: 5%;
        padding-right: 5%;
        padding-top: 5vh;
        color: white;
        font-family: "Century Gothic";
        font-size: 46px;
        font-style: normal;
        font-weight: 700;
        line-height: 1.1; /* 100% */
        display: flex;
        flex-direction: column;
        @media(max-width: 1600px){
          font-size: 56px;
        }
      }
    }

    .product-grid {
      width: 70%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      // Set borders on the container itself to frame the grid
      border-left: 1px solid white;
      // // border-right: 1px solid white;
      padding-top: 5vh;
      // background: #44A0AD;
      // overflow: hidden;
      .product-grid-inner {
        display: contents; /* Allows the grid items to respect the parent grid's layout */
      }
      .grid-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: 450px;
        position: relative;
        margin-bottom: 20px;
        background: #ceebec;
        cursor: pointer;

        // /* GRID ITEM POP */
        // transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
        // &:hover{
        //   transform: translate(-2px, -5px); /* Lifts the item up by 5 pixels */
        //   box-shadow: 0px 15px 10px 2px rgba(0, 0, 0, 0.2);
        // }

        /* TEXT/IMAGE POP */
        &:hover{
          .image{
            transform: scale(1.05);
          }
          .name{
            // text-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
            transform: scale(1.05);
          }
        }

        /* MOVE ON HOVER TO LEFT */
        // transition: transform 0.3s ease;
        // &:hover{
        //   transform: translateX(-20%);
        // }


        .texts{
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 30%;
          .name {
            display: flex;
            flex-direction: column;
            width: 70%;
            margin-left: auto;
            margin-right: auto;
            // transition: transform 0.3s ease-out; //text pop
            .top-part {
              color: #000;
              font-family: "Century Gothic";
              font-size: 32px;
              font-style: normal;
              font-weight: 400;
              line-height: 1; /* 75% */
              letter-spacing: 2.88px;
              margin-bottom: 5px;
            }
            .bottom-part {
              color: #000;
              font-family: "Century Gothic";
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 1; /* 171.429% */
              letter-spacing: 1.26px;
              margin-bottom: 10px;
            }
          }
          .description {
            color: #000;
            font-family: "Raleway";
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 1.2; /* 120% */
            width: 70%;
            margin-left: auto;
            margin-right: auto;
          }
        }
        .image {
          height: 70%;
          position: absolute;
          bottom: 0%;

          transition: transform 0.3s ease-out; // image pop
          // width: 70%;
        }
      }
    }
  }
}


// .product-grid-skeleton {
//   width: 70%;
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr;
//   border-left: 1px solid white;
//   margin-left: 30%; // account for subcategory-panel
// }

// .skeleton-item {
//   height: 450px; // match grid item height
//   background-color: rgba(255, 255, 255, 0.5);
//   border-right: 1px solid white;
//   border-bottom: 1px solid #afd6d9;
  
//   position: relative;
//   overflow: hidden;
  
//   &::before {
//     content: '';
//     position: absolute;
//     top: 0%;
//     left: 15%;
//     right: 15%;
//     height: 100%;
//     background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
//     animation: shimmer 1.5s infinite;
//   }
// }

// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }



/*TRANSITION ANIMATIONS*/
//fade
.fade-long-enter-active,
.fade-long-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-long-enter-from,
.fade-long-leave-to {
  opacity: 0;
}

.slide-horizontal-enter-active,
.slide-horizontal-leave-active {
  &.long-slide {
    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
    
    /* Add delay for enter animation - starts after short-slide finishes */
    &.slide-horizontal-enter-active {
      transition-delay: 0s; /* Delay by short-slide duration */
    }
    
    /* No delay for leave animation - starts immediately */
    &.slide-horizontal-leave-active {
      transition-delay: 0s;
    }
  }
  
  &.short-slide {
    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
    
    /* No delay for enter animation - starts immediately */
    &.slide-horizontal-enter-active {
      transition-delay: 0s;
    }
    
    /* Add delay for leave animation - starts after long-slide finishes leaving */
    &.slide-horizontal-leave-active {
      transition-delay: 0s; /* Or add delay if you want short-slide to wait */
    }
  }
}

//slide
.slide-horizontal-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-horizontal-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-horizontal-enter-to,
.slide-horizontal-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Alternative approach using separate classes for more control */
.slide-horizontal-enter-active.long-slide {
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
  transition-delay: 0.4s; /* Enter after short-slide completes */
}

.slide-horizontal-leave-active.long-slide {
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
  transition-delay: 0s; /* Leave immediately */
}

.slide-horizontal-enter-active.short-slide {
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
  transition-delay: 0s; /* Enter immediately */
}

.slide-horizontal-leave-active.short-slide {
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
  transition-delay: 0s; /* Leave immediately (or add delay if needed) */
}


// fade delayed (product grid)
.fade-staggered-enter-active {
  transition: opacity 0.5s ease-in, transform 0.5s ease-in;
  transition-delay: var(--delay); // set on grid-item via :style binding
}

.fade-staggered-leave-active{
  opacity: 0;
}
.fade-staggered-enter-from {
  opacity: 0;
  // transform: translateY(10px);
}

.fade-staggered-enter-to {
  opacity: 1;
  // transform: translateY(0);
}
</style>
