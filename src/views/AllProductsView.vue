<script setup>
import AllProductsMobile from "@/components/AllProductsView/AllProductsMobile.vue";
import { inject } from "vue";
const { isMobile } = inject("screenSize");

let projects = ["tomato-project", "vegetable-project", "pasta-project", "fruit-project"];

import { updateProjectUrl } from "@/router/updateAllProductsUrl";
import { useRoute } from "vue-router";
const route = useRoute();

import { ref, computed, watch, nextTick, onMounted, useTemplateRef } from "vue";
import { useProductStoreCleanup } from "@/store/productCleanup";
const productStore = useProductStoreCleanup();

import {
  categoryToSubcategory,
  subcategoryFullNames,
  subcategoryFullNamesWithSplitTargets,
} from "@/assets/products/categoryToSubcategory";
import { subcategoryToProductCodes } from "@/assets/products/subcategoryToProducts";
import { allProductMap } from "@/assets/products/allProductMap";

// --- Component setup ---
let selectedProject = ref("tomato-project");
let selectedSubcategory = ref(null);
let isLoading = ref(false);

watch(selectedProject, async (newProject, oldProject) => {
  if (newProject !== oldProject) {
    isLoading.value = true;
    await nextTick();
    // Set default subcategory if none is present in route.params
    if (!route.params.subcategory) {
      const subcategories = categoryToSubcategory.get(newProject) || [];
      if (subcategories.length > 0) {
        selectedSubcategory.value = subcategories[0];
      }
    }
    setTimeout(() => {
      isLoading.value = false;
    }, 200);
  }
});

// textSizing
let subcategoryNameRef = ref(null);
import { useTextSizing } from "@/composables/useTextSize";
const { wordFontSizes, updateWordFontSizes, setupAutoResize } = useTextSizing();

async function handleFontSizeUpdate() {
  console.log("Handling font size upd");
  if (!subcategoryNameRef.value || !selectedSubcategory.value) return;
  console.log("found the refs", subcategoryNameRef.value[0]);
  const text = subcategoryFullNamesWithSplitTargets[selectedSubcategory.value];
  await updateWordFontSizes(subcategoryNameRef.value[0], text);
}

setupAutoResize(handleFontSizeUpdate, 1000);
watch(selectedSubcategory, async (newSubcategory, oldSubcategory) => {
  if (newSubcategory !== oldSubcategory) {
    isLoading.value = true;
    await nextTick();

    isLoading.value = false;
    updateProjectUrl(selectedProject.value, newSubcategory);

    setTimeout(handleFontSizeUpdate, 100);
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
    keysToProcess = [selectedSubcategory.value].filter((key) =>
      subcategoryKeys.includes(key)
    );
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

        return {
          ...product,
          id: productCode,
        };
      })
      .filter((p) => p !== null);

    processedMap.set(subcatKey, productsWithSplitNames);
  }

  return processedMap;
});

const subcategoryKeysArray = computed(() => {
  return Array.from(categoryToSubcategory.get(selectedProject.value) || []);
});

function selectProject(project) {
  if (project === selectedProject.value) {
    return;
  }
  selectedProject.value = project;
  selectedSubcategory.value = null; // Reset subcategory
  // Set default subcategory (first one in the array for the project)
  const subcategories = categoryToSubcategory.get(project) || [];
  if (subcategories.length > 0) {
    selectedSubcategory.value = subcategories[0];
  }
}

function selectSubcategory(subcategory) {
  if (subcategory === selectedSubcategory.value) {
    selectedSubcategory.value = null; //deselect
  } else {
    selectedSubcategory.value = subcategory;
  }
}

watch(
  () => route.params,
  async (newParams, oldParams) => {
    const newCategory = newParams.category || "tomato-project";
    const newSubcategory = newParams.subcategory || null;

    if (newCategory !== selectedProject.value) {
      selectedProject.value = newCategory;
      await nextTick();
    }

    if (newSubcategory !== selectedSubcategory.value) {
      const currentProjectSubcategories =
        categoryToSubcategory.get(selectedProject.value) || [];
      if (newSubcategory && !currentProjectSubcategories.includes(newSubcategory)) {
        selectedSubcategory.value = null;
        console.warn(
          `Route subcategory '${newSubcategory}' not found for project '${selectedProject.value}'. Resetting selectedSubcategory.`
        );
        // Set default subcategory
        selectedSubcategory.value = currentProjectSubcategories[0] || null;
      } else {
        selectedSubcategory.value = newSubcategory;
      }
    }

    isLoading.value = true;
    await nextTick();
    setTimeout(() => {
      isLoading.value = false;
    }, 200);
  },
  { immediate: true, deep: true }
);
function onAfterEnter(el) {
  console.log("Element has entered, updating font sizes");
  setTimeout(handleFontSizeUpdate, 50);
}

function onBeforeLeave(el) {
  console.log("Element about to leave");
  // isTransitioning.value = true;
}
</script>

<template>
  <div v-if="!isMobile" class="all-products-page-container">
    <section class="selection">
      <!-- <Transition name="slide-horizontal" mode="out-in">
        <h1 class="project-name short-slide" :key="selectedProject">{{productStore.categoryFullNames[selectedProject]}}</h1>
      </Transition> -->

      <div class="menus">
        <nav class="projects">
          <div
            v-for="(project, idx) in projects"
            @click="selectProject(project)"
            :key="project"
            class="project"
            :class="{ active: project === selectedProject }"
          >
            {{ productStore.categoryFullNames[project] }}
          </div>
        </nav>

        <nav class="subcategories">
          <Transition name="fade-in-out" mode="out-in">
            <div
              class="subcategory-group"
              :class="selectedProject"
              :key="selectedProject"
            >
              <div
                v-for="subcategory in subcategoryKeysArray"
                @click="selectSubcategory(subcategory)"
                :key="subcategory"
                class="subcategory"
                :class="{ active: subcategory === selectedSubcategory }"
              >
                {{ subcategoryFullNames[subcategory] }}
              </div>

              <!-- <div class="subcategory filler" /> -->
            </div>
          </Transition>
        </nav>
      </div>
    </section>

    <section class="listing">
      <div class="subcategory-sections">
        <div
          v-for="[subcategoryKey, products] in processedProductsBySubcategory"
          class="subcategory-section"
          :class="{
            transitioning: isLoading,
            'loading-state': isLoading,
            single: processedProductsBySubcategory.size === 1,
          }"
          :ref="subcategoryKey"
        >
          <div class="subcategory-panel">
            <Transition
              name="slide-horizontal"
              @before-leave="onBeforeLeave"
              @before-enter="onAfterEnter"
              mode="out-in"
            >
              <h2
                class="subcategory-name long-slide"
                ref="subcategoryNameRef"
                :key="subcategoryKey"
              >
                <span
                  :id="word"
                  v-for="word in subcategoryFullNamesWithSplitTargets[
                    subcategoryKey
                  ].split('&')"
                  :key="word"
                >
                  {{ word }}
                </span>
              </h2>
            </Transition>
          </div>

          <div class="product-grid" :class="selectedProject">
            <TransitionGroup name="fade-staggered" tag="div" class="product-grid-inner">
              <router-link
                v-for="(product, index) in products"
                :key="product.id"
                class="grid-item"
                :class="product.keyToSubcategory"
                :style="{ '--delay': `${0.4 + index * 0.1}s` }"
                :to="
                  '/projects/' +
                  selectedProject +
                  '/' +
                  subcategoryKey +
                  '/' +
                  product.pathSlug
                "
                :title="`View ${product['Product name EN']} from the ${productStore.categoryFullNames[selectedProject]} - ${subcategoryFullNames[subcategoryKey]} category in more detail`"
              >
                <div class="texts">
                  <h3 class="name">
                    <span class="top-part">
                      {{ product.splitName.firstPart }}
                    </span>
                    <span class="bottom-part">
                      {{ product.splitName.secondPart }}
                    </span>
                  </h3>
                  <span class="description">
                    {{ product["Short Description EN"] }}
                  </span>
                </div>

                <img
                  :src="product.mainImageCompressed"
                  class="image"
                  :alt="product['Product name EN']"
                  loading="lazy"
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#131313"
                  class="chevron"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                  />
                </svg>
              </router-link>
            </TransitionGroup>
          </div>

          <!-- <div class="horizontal-border"/> -->
        </div>
      </div>
    </section>
  </div>

  <AllProductsMobile v-else />
</template>

<style lang="scss" scoped>
.all-products-page-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100%;
  padding-top: 15vh;
  background-color: #e6f6f6;
  .selection {
    display: flex;
    width: 100%;
    color: black;
    padding-left: 5vw; // rounded 2.28% of whole navbar width
    padding-right: 5vw;
    margin-bottom: 2vh;
    .project-name {
      width: 50%;
      color: #000;
      font-family: "Century Gothic";
      font-size: 64px;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      @media (max-width: 1600px) {
        font-size: 56px;
      }
      @media (min-width: 2560px) {
        font-size: 72px;
      }
      @media (min-width: 3200px) {
        font-size: 86px;
      }
    }
    .menus {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-self: flex-end;
      align-self: flex-end;
      align-items: space-around;
      .projects {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        min-height: 40px;
        .project {
          width: 25%;
          display: flex;
          justify-content: center;

          text-align: start;
          color: #44a0ad;
          text-align: right;
          font-family: "Raleway";
          font-size: 30px;
          font-style: normal;
          line-height: 1.15;
          letter-spacing: 1.26px;

          cursor: pointer;
          transition: color 0.3s ease-out, font-weight 0.3s ease-out,
            font-size 0.2s ease-out;
          &.active {
            color: #000;
            font-weight: 700;
            font-family: "Raleway";
            font-size: 34px;
            font-style: normal;
            font-weight: 400;
          }
          @media (max-width: 1600px) {
            font-size: 56px;
            &.active {
              font-size: 61px;
            }
          }
          @media (min-width: 2560px) {
            font-size: 72px;
            &.active {
              font-size: 79px;
            }
          }
          @media (min-width: 3200px) {
            font-size: 86px;
            &.active {
              font-size: 94px;
            }
          }
        }
      }
      .subcategories {
        display: grid;
        grid-template-columns: repeat(4, 1fr); // Match the projects grid
        align-items: flex-start;
        margin-top: 10px;
        .subcategory-group {
          display: flex;
          align-items: center;
          justify-content: center;

          //centers below appropriate selected-project
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          &.tomato-project {
            grid-column: 1;
          }
          &.vegetable-project {
            grid-column: 2;
          }
          &.pasta-project {
            grid-column: 3;
          }
          &.fruit-project {
            grid-column: 4;
          }

          column-gap: 25px;
          .subcategory {
            color: #44a0ad;
            text-align: center;
            font-family: "Raleway";
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: 1.33;
            letter-spacing: 1.08px;
            @media (min-width: 1920px) {
              font-size: 18px;
            }
            @media (min-width: 2560px) {
              font-size: 20px;
            }
            @media (min-width: 3200px) {
              font-size: 26px;
            }

            flex-shrink: 0;
            cursor: pointer;
            &:not(.filler)::before,
            &:not(.filler)::after {
              content: " | ";
            }

            &.active {
              color: #000;
            }

            .filler {
              min-width: 120px;
            }
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
    // background: #2B565D;
    background: #ceebec;
    position: relative;
    .subcategory-sections {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .subcategory-section {
      display: flex;
      width: 100%;

      &.loading-state {
        min-height: 100vh;
      }
      &.single {
        // height: 100vh;
        height: 100%;
      }
      .horizontal-border {
        height: 1px;
        background-color: #afd6d9;
        width: 100%;
        position: absolute;
        // bottom: 10px;
        // z-index: 30000;
      }
    }
    .subcategory-panel {
      width: 20%;
      // height: 100%;
      // background: lightblue;
      // border-bottom: 1px solid #AFD6D9;
      // box-shadow: inset 0 -1px 0 #AFD6D9; //border-bottom adds 1px which misaligns with grid drawn bottom borders
      .subcategory-name {
        padding-left: 2vw;
        padding-right: 0;
        padding-top: 5vh;
        color: white;
        font-family: "Century Gothic";
        font-size: 46px;
        font-style: normal;
        font-weight: 700;
        line-height: 1.1; /* 100% */
        display: flex;
        flex-direction: column;
        letter-spacing: 2px;
        text-transform: uppercase;
        @media (max-width: 1600px) {
          font-size: 36px;
        }
        @media (min-width: 2560px) {
          font-size: 48px;
        }
        @media (min-width: 3200px) {
          font-size: 54px;
        }
      }
      .word-span {
        display: block;
        line-height: 0.9;
        transition: font-size 0.3s ease;
      }
    }

    .product-grid {
      width: 80%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      padding-top: 5vh;
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
        margin-bottom: 120px;
        background: #ceebec;
        cursor: pointer;

        .texts {
          display: flex;
          flex-direction: column;
          align-items: center;
          // height: 30%;
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
              margin-bottom: 10px;
              @media (max-width: 1600px) and (max-height: 900px) {
                font-size: 28px;
              }
              @media (min-width: 2560px) {
                font-size: 36px;
              }
              @media (min-width: 3200px) {
                font-size: 44px;
              }
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
              @media (min-width: 2560px) {
                font-size: 20px;
              }
              @media (min-width: 3200px) {
                font-size: 28px;
              }
            }
          }
          .description {
            color: #000;
            font-family: "Raleway";
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 1.5; /* 120% */
            width: 70%;
            margin-left: auto;
            margin-right: auto;
            @media (min-width: 2560px) {
              font-size: 16px;
            }
            @media (min-width: 3200px) {
              font-size: 20px;
            }
          }
        }
        .image {
          height: 80%;
          position: absolute;
          bottom: -10%;

          transition: transform 0.3s ease-out; // image pop
          z-index: 3;
          @media (min-width: 2560px) {
            height: 90%;
          }
          // width: 70%;
        }
        .chevron {
          width: 20px;
          height: 20px;
          position: absolute;
          bottom: 20%;
          stroke: #2b565d;
          z-index: 2;
          left: 50%;
          transition: transform 0.3s ease-out;
        }

        &:hover {
          .image {
            transform: translateX(-20px);
          }
          .chevron {
            // text-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
            transform: translateX(100px);
          }
        }
      }

      &.pasta-project {
        .image {
          height: 70%;
        }
      }
      .grid-item {
        &.ketchup {
          .image {
            bottom: -15%;
          }
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

// Slide animation - Project Name is short-slide
.slide-horizontal-enter-active,
.slide-horizontal-leave-active {
  &.long-slide {
    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;

    &.slide-horizontal-enter-active {
      transition-delay: 0s; /* Delay by short-slide duration */
    }

    &.slide-horizontal-leave-active {
      transition-delay: 0s;
    }
  }

  &.short-slide {
    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;

    &.slide-horizontal-enter-active {
      transition-delay: 0s;
    }

    &.slide-horizontal-leave-active {
      transition-delay: 0s; /* delay for short-slide */
    }
  }
}
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

.fade-staggered-leave-active {
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
