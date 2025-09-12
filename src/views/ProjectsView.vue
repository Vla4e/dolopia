<script setup>
import ArrowButton from "@/components/ArrowButton.vue";
import { inject } from "vue";

const { isMobile } = inject("screenSize");

//TODO: solve with existing data in /src/products
const panels = [
  {
    category: {
      name: "the tomato <br/> project",
      description: "Savor the taste of tradition with Dolopias Finest Tomato Creations",
      route: "tomato-project",
    },
    subcategories: [
      {
        name: "Pasta sauces",
        route: "pasta-sauce",
      },
      {
        name: "Tomato creations",
        route: "tomato-creations",
      },
      {
        name: "Ketchups",
        route: "Ketchup",
      },
    ],
  },
  {
    category: {
      name: "the vegetable <br/> project",
      description:
        "Authentic Mediterranean flavors, rooted in heritage, perfected for modern palates.",
      route: "vegetable-project",
    },
    subcategories: [
      {
        name: "appetizers",
        route: "appetizer",
      },
      {
        name: "VEGETABLEs in OIL",
        route: "vegetable-in-oil",
      },
      {
        name: "Red pepper pates",
        route: "red-pepper-pate",
      },
    ],
  },
  {
    category: {
      name: "The FRUIT <br/> Project",
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
  },
  {
    category: {
      name: "The PASTA <br/> Project",
      description: "Crafted with care: artisanal pasta, naturally dried, richly flavored",
      route: "pasta-project",
    },
    subcategories: [
      {
        name: "Traditional pasta",
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
  },
];
</script>

<template>
  <div class="projects-page-container">
    <ArrowButton
      :routePath="'/home'"
      :buttonText="''"
      :showArrow="true"
      :arrowDirection="'left'"
      v-if="!isMobile"
    />
    <div class="panel-container">
      <div
        v-for="(panel, idx) in panels"
        :key="idx"
        class="panel"
        :class="`panel-${idx}`"
      >
        <div class="panel-half text-panel">
          <div class="category">
            <router-link
              :to="`/projects/${panel.category.route}`"
              class="category-name"
              v-html="panel.category.name"
            ></router-link>
            <span class="category-description">{{ panel.category.description }}</span>
          </div>

          <div class="subcategory-list">
            <router-link
              v-for="subcategory in panel.subcategories"
              :key="subcategory.name"
              :to="{
                name: 'subcategory-overview',
                params: {
                  category: panel.category.route,
                  subcategory: subcategory.route,
                },
              }"
              class="subcategory"
            >
              {{ subcategory.name }}
            </router-link>
          </div>
        </div>

        <div v-if="!isMobile" class="panel-half filler-panel">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.arrow-button {
  position: absolute;
  z-index: 2;
  top: 5vh;
  left: 5vh;
}
.projects-page-container {
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
    @media (max-width: 450px) {
      display: flex;
      flex-direction: column;
      width: 100vw;
    }
    .panel {
      width: 100%;
      height: 100%;
      aspect-ratio: 16 / 9;
      display: flex;
      justify-content: space-around;
      align-items: center;

      @media (max-width: 450px) {
        height: auto;
        aspect-ratio: 9 / 16;
        background-position: center;
        // padding-bottom: 45%; //move centered text up by 45% of panel height
      }
      .panel-half {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        @media (max-width: 450px){
          justify-content: flex-start;
          padding-top: 15%;
        }
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
            color: #000;
            text-align: center;
            font-family: "Century Gothic";
            font-size: 36px;
            font-style: normal;
            font-weight: 400;
            line-height: 1.2;
            text-transform: uppercase;
            transition: none;
            &:hover {
              transform: scale(1.05);
            }
            @media (max-width: 1600px) and (max-height: 900px) {
              font-size: 28px;
            }
          }
          &-description {
            color: #000;
            text-align: center;
            font-family: "Raleway";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 1.3;
            letter-spacing: 1.26px;
            @media (max-width: 1600px) and (max-height: 900px) {
              font-size: 12px;
            }
          }
        }
        .subcategory-list {
          display: flex;
          flex-direction: column;
          max-width: 80%;
          margin-left: auto;
          margin-right: auto;
          @media(max-width: 450px){
            row-gap: 10px;
            margin-top: 15px;
          }
          .subcategory {
            color: #000;
            text-align: center;
            font-family: "Century Gothic";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            text-transform: uppercase;
            transition: none;
            @media (max-width: 1600px) and (max-height: 900px) {
              font-size: 14px;
            }
            &:hover {
              transform: scale(1.05);
            }
          }
        }
      }
      &-0 {
        background-image: url("@/assets/project_showcase_images/16_9/tomato_16_9.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        @media (max-width: 450px) {
          background-image: url("@/assets/project_showcase_images/mobile/tomato-project.png");
        }
      }
      &-1 {
        background-image: url("@/assets/project_showcase_images/16_9/vegetable_16_9.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        @media (max-width: 450px) {
          background-image: url("@/assets/project_showcase_images/mobile/vegetable-project.png");
        }
      }
      &-2 {
        background-image: url("@/assets/project_showcase_images/16_9/fruit_16_9.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        @media (max-width: 450px) {
          background-image: url("@/assets/project_showcase_images/mobile/fruit-project.png");
        }
      }
      &-3 {
        background-image: url("@/assets/project_showcase_images/16_9/pasta_16_9.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        @media (max-width: 450px) {
          background-image: url("@/assets/project_showcase_images/mobile/pasta-project.png");
        }
      }
      &-0,
      &-1 {
        .text-panel {
          order: 1;
        }
        .filler-panel {
          order: 2;
        }
      }
      &-2,
      &-3 {
        .text-panel {
          order: 2;
        }
        .filler-panel {
          order: 1;
        }
      }
    }
  }
}
</style>