<script setup>
import ProjectsViewMobile from "@/components/ProjectsViewMobile/ProjectsViewMobile.vue";
import ArrowButton from "@/components/ArrowButton.vue";
import { inject, onMounted } from "vue";
const { isMobile } = inject("screenSize");
const panels = [
  {
    category: {
      name: "the tomato project",
      description: "Savor the taste of tradition with Dolopias Finest Tomato Creations",
      route: "tomato-project",
    },
    subcategories: [
      {
        name: "PASTA SAUCES",
        route: "pasta-sauces",
      },
      {
        name: "TOMATO CREATIONS",
        route: "tomato-creations",
      },
      {
        name: "HOMEMADE KETCHUP",
        route: "ketchup",
      },
    ],
    imageUrl: new URL("@/assets/tomato-project.png", import.meta.url).href,
  },
  {
    category: {
      name: "the vegetable project",
      description:
        "Authentic Mediterranean flavors, rooted in heritage, perfected for modern palates.",
      route: "vegetable-project",
    },
    subcategories: [
      {
        name: "appetizer",
        route: "appetizer",
      },
      {
        name: "VEGETABLEs in OIL",
        route: "vegetable-in-oil",
      },
      {
        name: "Red pepper pate",
        route: "red-pepper-pate",
      },
    ],
    imageUrl: new URL("@/assets/vegetable-project.png", import.meta.url).href,
  },
  {
    category: {
      name: "The FRUIT Project",
      description: "Authentic fruit delights with a creative modern twist",
      route: "fruit-project",
    },
    subcategories: [
      {
        name: "jams",
        route: "jam",
      },
      {
        name: "marmalades",
        route: "marmalade",
      },
      {
        name: "candied fruits in syrup",
        route: "candied-fruit",
      },
    ],
    imageUrl: new URL("@/assets/fruit-project.png", import.meta.url).href,
  },
  {
    category: {
      name: "The PASTA Project",
      description: "Crafted with care: artisanal pasta, naturally dried, richly flavored",
      route: "pasta-project",
    },
    subcategories: [
      {
        name: "Milk pasta",
        route: "traditional-pasta",
      },
      {
        name: "vegan pasta",
        route: "vegan-pasta",
      },
      {
        name: "Seafood pasta",
        route: "seafood-pasta",
      },
    ],
    imageUrl: new URL("@/assets/pasta-project.png", import.meta.url).href,
  },
];

onMounted(() => {
  console.log("MOUNTED");
});
function clickedTest(c, s, p) {
  console.log("Cat", c);
  console.log("Sub", s);
  console.log(p);
}

import { useProductStoreCleanup } from "@/store/productCleanup";
const productStore = useProductStoreCleanup();
</script>

<template>
  <div class="page-catalog">
    <ArrowButton
      :routePath="'/home'"
      :buttonText="''"
      :showArrow="true"
      :arrowDirection="'left'"
      :showDropdown="false"
      v-if="!isMobile"
    />
    <div v-if="!isMobile" class="panel-container">
      <div
        v-for="(panel, idx) in panels"
        :key="idx"
        class="panel"
        :class="`panel-${idx}`"
      >
        <div class="panel-half text-panel">
          <div class="category">
            <router-link :to="`/projects/${panel.category.route}`" class="category-name">{{ panel.category.name }}</router-link>
            <span class="category-description">{{ panel.category.description }}</span>
          </div>

          <div class="subcategory-list">
            <router-link
              v-for="subcategory in panel.subcategories"
              :key="subcategory.name"
              :to="
                productStore.getFlowType === 'old'
                  ? {
                      name: 'projects',
                      params: {
                        category: panel.category.route,
                        subcategory: subcategory.route,
                        product: 'default',
                      },
                    }
                  : {
                      name: 'subcategory-overview',
                      params: {
                        category: panel.category.route,
                        subcategory: subcategory.route,
                      },
                    }
              "
              @click="clickedTest(panel.category.route, subcategory.route, 'default')"
              class="subcategory"
            >
              {{ subcategory.name }}
            </router-link>
          </div>
        </div>

        <div class="panel-half image-panel">
          <!-- <img :src="panel.imageUrl" class="category-image"/> -->
        </div>
      </div>
    </div>
    <ProjectsViewMobile v-if="isMobile" />
  </div>
</template>

<style lang="scss" scoped>
.arrow-button {
  position: absolute;
  z-index: 2;
  top: 5vh;
  left: 5vh;
}
.page-catalog {
  width: 100%;
  height: 100%;
  @media (max-width: 450px) {
    margin-bottom: 40px !important;
  }
  .panel-container {
    display: grid;
    grid-template-rows: 50% 50%;
    grid-template-columns: 50% 50%;
    flex-grow: 1;
    max-height: 100vh;
    .panel {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      // flex-direction: column;
      // border: 1px solid gray;
      .panel-half {
        width: 100%;
        height: 100%;
        // background: #CEEAEC;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // border: 1px solid black;
        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .category {
          display: flex;
          flex-direction: column;
          max-width: 80%;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 5%;
          &-name {
            font-family: "Century Gothic";
            font-size: 24px;
            font-style: normal;
            font-weight: 400;
            color: black;
            text-transform: uppercase;
            text-align: center;
            letter-spacing: 0%;
          }
          &-description {
            font-family: "Raleway";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            color: black;
            text-align: center;
          }
        }
        .subcategory-list {
          display: flex;
          flex-direction: column;
          max-width: 80%;
          margin-left: auto;
          margin-right: auto;
          .subcategory {
            font-family: "Century Gothic";
            font-size: 16px;
            text-transform: uppercase;
            color: black;
            text-align: center;
          }
        }
      }
      &-0 {
        background-image: url("@/assets/project_showcase_images/16_9/tomato_16_9.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        @m;
      }
      &-1 {
        background-image: url("@/assets/project_showcase_images/16_9/vegetable_16_9.jpg");
        background-size: cover;
        background-repeat: no-repeat;
      }
      &-2 {
        background-image: url("@/assets/project_showcase_images/16_9/fruit_16_9.jpg");
        background-size: cover;
        background-repeat: no-repeat;
      }
      &-3 {
        background-image: url("@/assets/project_showcase_images/16_9/pasta_16_9.jpg");
        background-size: cover;
        background-repeat: no-repeat;
      }
      &-0,
      &-1 {
        .text-panel {
          order: 1;
        }
        .image-panel {
          order: 2;
        }
      }
      &-2,
      &-3 {
        .text-panel {
          order: 2;
        }
        .image-panel {
          order: 1;
        }
      }
      .text-panel {
      }
      .image-panel {
      }
    }
  }
}
</style>
