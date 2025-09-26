<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

import {
  categoryToSubcategory,
  subcategoryFullNames,
} from "@/assets/products/categoryToSubcategory";
import { updateProjectUrl } from "@/router/updateAllProductsUrl";

import { useProductStoreCleanup } from "@/store/productCleanup";
import { storeToRefs } from "pinia";
const productStore = useProductStoreCleanup();
const { selectCategory: selectProject, selectSubcategory, selectProduct } = productStore;
const {
  selectedCategoryId: selectedProject,
  selectedSubcategoryId: selectedSubcategory,
  selectedProductCode,
} = storeToRefs(productStore);


const route = useRoute();
const projects = [
  "tomato-project",
  "vegetable-project",
  "pasta-project",
  "fruit-project",
];

const transitionName = ref("slide-project-left");

watch(
  () => selectedSubcategory.value,
  (newSubcategory, oldSubcategory) => {
    console.log("Subcategory watcher -> ", newSubcategory);
    if (newSubcategory !== oldSubcategory) {
      updateProjectUrl(selectedProject.value, newSubcategory);
    }
  }
);
watch(
  () => selectedProject.value,
  (newProject) => {
    console.log("Watcher SelectedProject => ", newProject);
  },
  { immediate: true }
);
watch(
  () => route.params,
  async (newParams) => {
    const newProject = newParams.category || "tomato-project";
    const newSubcategory = newParams.subcategory || null;
    console.log("NewParams -> ", newParams);
    console.log("newProject route -> ", newProject);
    // return
    if (newProject !== selectedProject.value) {
      selectProject(newProject);
      await nextTick();
    }
    // return;
    const currentProjectSubcategories = categoryToSubcategory.get(selectedProject) || [];

    if (newSubcategory && currentProjectSubcategories.includes(newSubcategory)) {
      selectSubcategory(newSubcategory);
    } else {
      selectSubcategory(currentProjectSubcategories[0] || null);
    }
  },
  { immediate: true }
);

const subcategoryKeysArray = computed(() =>
  Array.from(categoryToSubcategory.get(selectedProject.value) || [])
);

// function selectProject(project) {
//   if (project === selectedProject.value) return;

//   selectedProject.value = project;
//   const subcategories = categoryToSubcategory.get(project) || [];
//   selectedSubcategory.value = subcategories.length > 0 ? subcategories[0] : null;
// }

function cycleCategory(direction) {
  console.log("Cycling -> ", direction);

  console.log("Project", selectedProject.value);
  console.log("Subcategory", selectedSubcategory.value);
  console.log("Product", selectedProductCode.value);
  // return;
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
  // selectCategory()
}

// function selectSubcategory(subcategory) {
//   if (subcategory !== selectedSubcategory.value) {
//     selectedSubcategory.value = subcategory;
//   }
// }
</script>

<template>
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
</template>

<style lang="scss" scoped>
.selection-menu {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  min-height: 190px;
  // padding-top: 10vh;
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
      @media(max-width: 450px){
        font-size: 22px;
      }
    }
    .chevron {
      width: 30px;
      height: 30px;
      transition: transform 0.3s ease;
      path {
        stroke: white;
      }
      &.left {
      }
      &.right {
      }
      &:focus,
      &:active {
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
      @media(max-width: 365px){
        min-width: 100px;
      }
      .selected-indicator {
        opacity: 0;
        min-width: 120px;
        height: 25px;
        position: absolute;
        top: -24px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
        transform: translateY(100%);
        z-index: 2;
      }
      .indicator-rectangle {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
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
        line-height: 1.1;
        text-transform: uppercase;
        z-index: 3;
        text-align: center;
        @media(max-width: 365px){
          font-size: 10px;
        }
      }
    }
  }
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
