
<script setup>
import { ref, computed, inject } from 'vue';

const { isMobile } = inject('screenSize')
const panels = [
    {
      category: {
        name: 'the tomato project',
        description: 'Savor the taste of tradition with Dolopias Finest Tomato Creations',
        route: 'tomato-project',
        subcategoryRoute: 'pasta-sauces',
        imageUrl: new URL('@/assets/project_showcase_images/mobile/tomato-project.png', import.meta.url).href
      },
    },
    {
      category: {
        name: 'the vegetable project',
        description: 'Authentic Mediterranean flavors, rooted in heritage, perfected for modern palates.',
        route: 'vegetable-project',
        subcategoryRoute: 'jam',
        imageUrl: new URL('@/assets/project_showcase_images/mobile/vegetable-project.png', import.meta.url).href,
      },
    },
    {
      category: {
        name: 'The PASTA Project',
        description: 'Crafted with care: artisanal pasta, naturally dried, richly flavored',
        route: 'pasta-project',
        subcategoryRoute: 'traditional-pasta',
        imageUrl: new URL('@/assets/project_showcase_images/mobile/pasta-project.png', import.meta.url).href
      },
    },
    {
      category: {
        name: 'The FRUIT Project',
        description: 'Authentic fruit delights with a creative modern twist',
        route: 'fruit-project',
        subcategoryRoute: 'appetizer',
        imageUrl: new URL('@/assets/project_showcase_images/mobile/fruit-project.png', import.meta.url).href
      },
    }
  ]
</script>

<template>
  <div class="project-cards-container">
    <router-link 
      class="project-card" 
      :class="`project-card-${idx}`" 
      v-for="(panel, idx) in panels"
      :key="idx"
      :to="{ name : 'catalog', query: { category: panel.category.route, subcategory: panel.category.subcategoryRoute }}"
    >
      <div class="image-container">
        <img :src="panel.category.imageUrl" :alt="panel.category.name">
      </div>
      <div class="text-container">
        <h2>{{ panel.category.name }}</h2>
        <p>{{ panel.category.description }}</p>
      </div>
    </router-link>
  </div>
</template>


<style lang="scss" scoped>
.project-cards-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  z-index: 2;

  .project-card{
    position: relative;
    border-radius: 20px;
    width: 100%;
    margin-bottom: 20px;
    overflow: hidden;

    .image-container{
      width: 100%;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }

    .text-container{
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      h2{
        color: #000;
        font-family: "Century Gothic";
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;
        text-transform: uppercase;
        margin-bottom: 15px;
      }
      p{
        color: #000;
        font-family: "Raleway";
        font-size: 11px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px; /* 127.273% */
        letter-spacing: 0.99px;
        text-transform: capitalize;
      }
    }
    &-0, &-2{
    }
    &-1, &-3{
      .text-container{
        left: 50%;
      }
    }
  }
}
</style>