<script setup>
  import { onMounted, ref, useTemplateRef, watch, computed } from 'vue';
  import chevron from '@/assets/product_overview/nutrition-chevron.png'
  import lightChevron from '@/assets/product_overview/nutrition-chevron-light.png'

  import { useProductStore } from '@/store/product';
  const productStore = useProductStore()
  let localProductData = computed(() => {
    return productStore.productData
  })

  let props = defineProps({
    productId: {
      type: String,
      required: true
    },
    statistic: {
      type: Object,
      required: true
    }
  })
  let isInLowerHalf = ref(false)
  let productRef = useTemplateRef(`chevron-${props.productId}`)
  let isPositionCalculated = ref(false)
  function checkElementPosition() {
      if (productRef.value) {
        const productRect = productRef.value.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const containerCenterY = windowHeight / 2.1; // background image does not visually cut the middle of the viewport
        isInLowerHalf.value = productRect.top > containerCenterY;
        isPositionCalculated.value = true
      }
  };

  onMounted(() => {
    checkElementPosition()
  })
</script>

<template>
  <div :ref="`chevron-${productId}`" :id="`chevron-${productId}`" class="nutrition-chevron">
    <!-- <img src="@/assets/product_overview/nutrition-chevron-light.png" class="chevron" alt="Nutritional Data"> -->
    <div class="chevron-image-container">
      <img v-show="isPositionCalculated" :src="isInLowerHalf ? lightChevron : chevron" class="chevron" alt="Nutritional Data">
      <label :class="isInLowerHalf ? 'black' : 'white'" class="inside-chevron-data">
        <!-- <span class="type">{{ product.inside_chevron.type }}</span>
        <span class="value">{{ product.inside_chevron.value }}</span> -->
        <span class="type">
          <!-- Type -->
          {{ statistic.type }}
        </span>
        <span class="value">
          {{ statistic.chevronValue }} <span class="value-unit">{{ statistic.chevronUnit }}</span>
        </span>
      </label>
    </div>
    <div class="outside-chevron-data">
      <!-- <span>{{stat}}</span>
      <span>{{product[stat].value}}</span> -->
      <span class="statistic-value">
        <!-- 250 <span class="statistic-units">units</span> -->
        {{ statistic.outsideChevronValue }} <span class="statistic-unit">{{ statistic.outsideChevronUnit }}</span>
      </span>
      <label class="statistic-note">
        <!-- of which sugars -->
        {{ statistic.note }}
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nutrition-chevron{
  width: 70%;
  height: 100%;
  display: flex;
  // justify-content: space-between;
  position: relative;
  .chevron-image-container{
    display: flex;
    height: 75%;
    // min-width: 60%;
    position: relative;
    .chevron{
      height: 100%;
      width: auto;
    }
    .inside-chevron-data{
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 100%;
      max-width: 40%;
      width: 40%;
      position: absolute;
      align-items: center;
      justify-content: center;
      .type{
        width: 85%;
        color: #FEEDEE;
        font-family: "Century Gothic";
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      .value{
        width: 85%;
        color: #FEEDEE;
        font-family: "Century Gothic";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        .units{
          color: #FEEDEE;
          font-family: "Century Gothic";
          font-size: 7px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
      &.black{
        .type{
          color: #414142;
        }
        .value{
          color: #414142;
        }
      }
    }
  }
  
  .outside-chevron-data{
    display: flex;
    height: 75%;
    min-width: 30%;
    // width: 100%;
    position: relative;
    align-items: center;
    justify-content: flex-end;
    .statistic-value{
      color: #3D3D3D;
      font-family: "Century Gothic";
      font-size: 19.454px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-bottom: -20px;
    }
    .statistic-unit{
      color: #3D3D3D;
      font-family: "Century Gothic";
      font-size: 12.353px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-bottom: -20px;
    }
    .statistic-note{
      min-width: 110px;
      position: absolute;
      top: 10px;
      color: #3D3D3D;
      font-family: "Century Gothic";
      font-size: 10px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-align: right;
    }
  }
  @media(max-width: 450px){
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    justify-content: space-between;
    .chevron-image-container{
      width: 80%;
      .chevron{
        width: 100%;
        max-height: 60px;
      }
    }
    .outside-chevron-data{
      height: 60px;
    }
  }
}
</style>