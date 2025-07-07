
<script setup>
import { watch, ref, onMounted } from 'vue';
let dataObjects = {
  tomato: {
    heading: "Tomato-based products",
    paragraph: "Our tomato-based products include flavorful pasta sauces, rich ketchups, and other tomato creations, made from sun-ripened tomatoes that enhance any dish with their vibrant taste.",
    imageUrl: new URL("@/assets/about/projects/tomato-project.png", import.meta.url).href,
    alt: "pasta sauce, tomato sauces, homemade ketchup"
  },
  fruit: {
    heading: "Fruit collection",
    paragraph: "For those with a sweet tooth, our fruit collection includes jams, marmalades, and candied fruits in syrup, all made from ripe, carefully selected fruits that embody the natural sweetness and richness of Greece’s orchards.",
    imageUrl: new URL("@/assets/about/projects/fruit-project.png", import.meta.url).href,
    alt: "Fruit, jams, marmalades, candied fruits"
  },
  vegetable: {
    heading: "Vegetable-based spreads and salads",
    paragraph: "We also offer a selection of vegetable-based spreads and salads, featuring red pepper pates in four different levels of spiciness, along with vegetables preserved in olive oil, capturing the essence of Mediterranean produce.",
    imageUrl: new URL("@/assets/about/projects/vegetable-project.png", import.meta.url).href,
    alt: "Appetizers, red pepper pates, vegetables in oil"
  },
  pasta: {
    heading: "A diverse range of pasta",
    paragraph: "We create a diverse range of pasta, including traditional varieties, vegan options, and seafood-infused pasta. These are produced using time-honored techniques like air-drying and bronze dies to ensure rich flavors and a perfect texture that holds sauces beautifully.",
    imageUrl: new URL("@/assets/about/projects/pasta-project.png", import.meta.url).href,
    alt: "vegan pasta, seafood pasta, traditional pasta"
  }
}

const props = defineProps({
  project: {
    type: String,
    required: true,
    default: ''
  },
})
let currentProject = ref('pasta')
let currentProjectObject = ref({})
watch(() => props.project, (newProject) => {
  // console.log("NewURL:", newProject)
  // new URL(newProject, import.meta.url).href
  currentProject.value = newProject
  currentProjectObject.value = dataObjects[newProject]
}, 
{
  immediate: true
})

onMounted(() => {
  // console.log("mounted", props.project)
  //triggerSlideIn()
})
</script>

<template>
  <div class="about-singular-project" :class="props.project">
    <div class="text-container">
      <h2>{{ currentProjectObject.heading }}</h2>
      <p>{{ currentProjectObject.paragraph }}</p>
      <!-- <span style="color: black;">{{ currentProjectObject }}</span> -->
    </div>
    <!-- <Waterfall/> -->
    <img :src="currentProjectObject.imageUrl" class="image" :alt="currentProjectObject.alt"/>
  </div>
</template>


<style lang="scss" scoped>
.about-singular-project{
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  .text-container{
    max-width: 30%;
    h2{
      color: #FFF;
      font-family: "Belleza";
      font-size: 75px;
      font-style: normal;
      font-weight: 400;
      line-height: 75px; /* 100% */
      margin-bottom: 24px;
      @media(max-height: 900px) and (max-width: 1600px){
        font-size: 60px;
        line-height: 1;
      }
    }
    p{
      color: #FFF;
      font-family: "Raleway";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 25px; /* 156.25% */
      @media(max-height: 900px) and (max-width: 1600px){
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }
  .image{
    height: 80%;
    width: auto;
    // max-height: 80%;
    // width: auto;
  }
  &.tomato{
    .image{
      // width: 45%; 
    }
  }
  &.vegetable{
    .image{
      // width:40%;
    }
  }
}
</style>