<template>
  <div class="hero-text-container">
    <h1 v-if="!isMobile" class="heading">explore our <br/> culinary World</h1>
    <h1 v-else class="heading"> Culinary World </h1>
    <p class="subheading">Where Ancient Greek traditions meet modern flavors <br/> Honoring our commitment to nature and people</p>
  </div>
</template>

<script setup>
import { inject } from 'vue';
const { isMobile } = inject('screenSize')
</script>

<style lang="scss" scoped>
.hero-text-container{
  margin-top: 5%;
  .heading{
    font-size: 75px;
    color: white;
    text-transform: uppercase;
    font-family: 'Century Gothic';
    font-style: normal;
    line-height: 6rem;
  }
  .subheading{
    font-size: 20px;
    color: white;
    font-family: 'Raleway';
    font-style: normal;
  }
  @media(min-width: 768px) and (max-height: 900px){
    .heading{
      font-size: 64px;
      line-height: 1.1;
      padding-left: 5vw;
    }
    .subheading{
      
      padding-left: 5vw;
    }
  }
  @media(max-width: 450px){
    .heading{
      color: #FFF;
      text-align: center;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-family: "Century Gothic";
      font-size: 40px;
      font-style: normal;
      font-weight: 700;
      line-height: 45px;
      letter-spacing: 3.6px;
      text-transform: uppercase;
      margin-bottom: 45vh;
    }
    .subheading{
      color: #FFF;
      text-align: center;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-family: "Raleway";
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 26px; /* 100% */
    }
  }
}
</style>