<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

import {
  categoryToSubcategory,
  subcategoryFullNames,
} from "@/assets/products/categoryToSubcategory";
import { subcategoryToProductCodes } from "@/assets/products/subcategoryToProducts";
import { allProductMap } from "@/assets/products/allProductMap";
import { updateProjectUrl } from "@/router/updateAllProductsUrl";

import { useProductStoreCleanup } from "@/store/productCleanup";
const productStore = useProductStoreCleanup();

import leftChevron from "@/assets/project-catalog/left-chevron-white.svg";
import rightChevron from "@/assets/project-catalog/right-chevron-white.svg";
import cardBackgroundPlaceholder from "@/assets/product_overview/background.png";

const route = useRoute();
const projects = [
  "tomato-project",
  "vegetable-project",
  "pasta-project",
  "fruit-project",
];
const selectedProject = ref("tomato-project");
const selectedSubcategory = ref(null);
const isLoading = ref(false);

watch(selectedSubcategory, (newSubcategory, oldSubcategory) => {
  if (newSubcategory !== oldSubcategory) {
    updateProjectUrl(selectedProject.value, newSubcategory);
  }
});

watch(
  () => route.params,
  async (newParams) => {
    isLoading.value = true;
    await nextTick();

    const newCategory = newParams.category || "tomato-project";
    const newSubcategory = newParams.subcategory || null;

    if (newCategory !== selectedProject.value) {
      selectedProject.value = newCategory;
      await nextTick(); // Ensure computed properties update before proceeding
    }

    const currentProjectSubcategories =
      categoryToSubcategory.get(selectedProject.value) || [];

    if (newSubcategory && currentProjectSubcategories.includes(newSubcategory)) {
      selectedSubcategory.value = newSubcategory;
    } else {
      // If subcategory from URL is invalid or null, default to the first one for the current project
      selectedSubcategory.value = currentProjectSubcategories[0] || null;
    }

    // Use a timeout for visual transition
    setTimeout(() => {
      isLoading.value = false;
    }, 200);
  },
  { immediate: true }
);

const subcategoryKeysArray = computed(() =>
  Array.from(categoryToSubcategory.get(selectedProject.value) || [])
);

const processedProducts = computed(() => {
  if (!selectedSubcategory.value) {
    return [];
  }
  const productCodeArray = subcategoryToProductCodes.get(selectedSubcategory.value) || [];

  return productCodeArray
    .map((productCode) => {
      const product = allProductMap.get(productCode);
      if (!product) {
        console.warn(`Product not found for code: ${productCode}`);
        return null;
      }
      return { ...product, id: productCode };
    })
    .filter((p) => p !== null);
});

function selectProject(project) {
  if (project === selectedProject.value) return;

  selectedProject.value = project;
  console.log("SELECTED PROJ", project);
  const subcategories = categoryToSubcategory.get(project) || [];
  selectedSubcategory.value = subcategories.length > 0 ? subcategories[0] : null;
}

let transitionName = ref("slide-project-left");
function cycleCategory(direction) {
  const currentIndex = projects.indexOf(selectedProject.value);
  let nextIndex;

  if (direction === "right") {
    nextIndex = (currentIndex + 1) % projects.length;
    transitionName.value = "slide-project-right";
  } else {
    nextIndex = (currentIndex - 1 + projects.length) % projects.length;
    transitionName.value = "slide-project-left";
  }

  selectProject(projects[nextIndex]);
}

function selectSubcategory(subcategory) {
  if (subcategory !== selectedSubcategory.value) {
    selectedSubcategory.value = subcategory;
  }
}

// --- Navigation to Product Detail Page ---
function goToProductDetail(product) {
  router
    .push({
      // This assumes a route exists for product details similar to the desktop's router-link structure
      path: `/projects/${selectedProject.value}/${selectedSubcategory.value}/${product.path}`,
    })
    .catch((err) => {
      if (err.name !== "NavigationDuplicated") {
        console.error("Router push failed:", err);
      }
    });
}
</script>

<template>
  <div class="projects-mobile">
    <div class="selection-menu">
      <div class="categories">

        <svg
          @click="cycleCategory('left')"
          class="chevron left"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d="M15 6L9 12L15 18"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>

        <Transition :name="transitionName" mode="out-in">
          <span :key="selectedProject" class="category">
            {{ productStore.categoryFullNames[selectedProject] }}
          </span>
        </Transition>

        <svg
          @click="cycleCategory('right')"
          class="chevron right"

          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d="M9 6L15 12L9 18"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </div>

      <ul class="subcategories">
        <li
          v-for="subcategory in subcategoryKeysArray"
          :key="subcategory"
          class="item"
          :class="{ selected: subcategory === selectedSubcategory }"
          @click="selectSubcategory(subcategory)"
        >
          <div class="selected-indicator">
            <svg
              class="indicator-rectangle"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 142 15.19851"
              preserveAspectRatio="xMidYMax meet"
              aria-hidden="true"
            >
              <path
                d="M12.0053 3.80149C13.9018 1.40061 16.793 0 19.8525 0H122.147C125.207 0 128.098 1.40061 129.995 3.80149L142 15.19851H0L12.0053 3.80149Z"
                fill="#44A0AD"
              />
            </svg>
          </div>
          <span class="text">
            {{ subcategoryFullNames[subcategory] }}
          </span>
        </li>
      </ul>
    </div>
    <ul class="product-list">
      <li v-for="product in processedProducts" :key="product.id" class="product-card">
        <router-link
          :key="product.id"
          class="card-content"
          :class="product.keyToSubcategory"
          :to="
            '/projects/' +
            selectedProject +
            '/' +
            product.keyToSubcategory +
            '/' +
            product.pathSlug
          "
          :title="`View ${product['Product name EN']} from the ${productStore.categoryFullNames[selectedProject]} - ${subcategoryFullNames[subcategoryKey]} category in more detail`"
        >
          <div class="image-container">
            <img class="background" :src="cardBackgroundPlaceholder" />
            <img
              class="product"
              :src="product.mainImageCompressed"
              :alt="product['Product name EN']"
              loading="lazy"
            />
          </div>

          <div class="product-texts">
            <div class="category-subcategory">
              <span class="category">{{
                productStore.categoryFullNames[selectedProject]
              }}</span>
              <span class="vertical-line" />
              <span class="subcategory">{{
                subcategoryFullNames[selectedSubcategory]
              }}</span>
            </div>
            <div class="product-text-container">
              <h2 class="product-name">
                <span class="large-text">
                  {{ product.splitName.firstPart }}
                </span>
                <span class="medium-text">
                  {{ product.splitName.secondPart }}
                </span>
              </h2>
              <p class="product-description">
                {{ product["Short Description EN"] }}
              </p>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.projects-mobile {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  .selection-menu {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 250px;
    background: #2b565d;
    .categories {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 25%;
      width: 95%;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 20px;
      .category {
        color: #fff;
        font-family: "Century Gothic";
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        text-transform: uppercase;
      }
      .chevron {
        width: 30px;
        height: 30px;
        transition: transform 0.3s ease;
        path{
          stroke: white;
        }
        &.left {
        }
        &.right {
        }
        &:focus, &:active {
          transform: scale(110%);
        }
      }
    }
    .subcategories {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      min-height: 40px;
      padding: 0px;
      padding-left: 2.5%;
      padding-right: 2.5%;
      // height: 80px;
      background-color: #44a0ad;
      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        padding: 5px;
        min-width: 120px;
        min-height: 30px;
        position: relative;
        .selected-indicator {
          opacity: 0;
          min-width: 120px;
          height: 25px;
          position: absolute;
          top: -24px;
          display: flex; /* Ensure the SVG is centered within the container */
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          transform: translateY(100%);
          z-index: 2;
        }

        .indicator-rectangle {
          width: 100%;
          height: 100%;
          max-width: 100%; /* Prevent overflow */
          max-height: 100%; /* Prevent overflow */
        }
        &.selected {
          .selected-indicator {
            opacity: 1;
            transform: translateY(0%);
          }
        }
        .text {
          color: #000;
          font-family: "Century Gothic";
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 1.1; /* 83.333% */
          text-transform: uppercase;
          z-index: 3;
          text-align: center;
        }
      }
    }
  }
  .product-list {
    display: grid;
    width: 95%;
    max-width: 95%;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    row-gap: 60px;
    grid-template-columns: 100%;
    column-gap: 10px;
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 0px !important;
    .product-card {
      display: flex;
      flex-direction: column;
      .card-content {
        width: 100%;
        height: 100%;
      }
      .image-container {
        position: relative;
        width: 100%;
        height: auto;
        .background {
          width: 100%;
          min-height: 275px;
          border-top-right-radius: 20px;
          border-top-left-radius: 20px;
        }
        .product,
        .shadow-silhouette,
        .highlight {
          height: 100%;
          width: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .product-texts {
        width: 100%;
        // margin-top: 10px;
        .category-subcategory {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          min-width: 30px;
          .category,
          .subcategory {
            color: #000;
            font-family: "Century Gothic";
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            letter-spacing: 0.9px;
            text-transform: capitalize;
          }
        }
        .product-name {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 5px;
          .large-text {
            color: #000;
            font-family: "Century Gothic";
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px; /* 100% */
            letter-spacing: 2.16px;
            text-transform: uppercase;
            text-wrap: wrap;
            word-break: normal;
          }
          .medium-text {
            color: #000;
            font-family: "Century Gothic";
            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
            letter-spacing: 1.08px;
            text-transform: uppercase;
          }
        }
        .product-description {
          color: #000;
          font-family: "Raleway";
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0.2px;
          line-height: 1.5; /* 150% */
        }
      }
    }
  }
}
.vertical-line {
  display: flex;
  width: 1px;
  height: 15px;
  background-color: #131313;
  margin-left: 5px;
  margin-right: 5px;
}

/* Slide Project Left Transitions */
.slide-project-left-enter-active,
.slide-project-left-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-project-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-project-left-enter-to {
  transform: translateX(0%);
  opacity: 1;
}

.slide-project-left-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.slide-project-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide Project Right Transitions */
.slide-project-right-enter-active,
.slide-project-right-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-project-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-project-right-enter-to {
  transform: translateX(0%);
  opacity: 1;
}

.slide-project-right-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.slide-project-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
