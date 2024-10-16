<template>
  <div class="vertical-carousel">
    <span 
      v-for="( item, index ) in items" 
      :key="item.name" 
      class="item"
      :class="{
        'selected': selectedProductCode === item.productCode,
        'top': index > (itemsLength / 2),
        'bottom': index < (itemsLength / 2)
      }"
      @click="selectProductCode(item.productCode)"
    >
      {{ item.name }}
    </span>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useProductStore } from '@/store/product.js';
import { subcategoryToProductsMap } from '@/assets/products/subcategoryToProducts';
const productStore = useProductStore()
let items = [
  {
    productCode: '123',
    name: '123'
  },
  {
    productCode: '456',
    name: '457'
  },
  {
    productCode: '789',
    name: '789'
  },
  {
    productCode: '1001',
    name: '1001'
  },
]
let itemsLength = items.length
let selectedProductCode = ref('123')
function selectProductCode(code){
  selectedProductCode.value = code
}

</script>

<style lang="scss" scoped>
.vertical-carousel{
  display: flex;
  .item{
    &:not(.selected){
      position: absolute;
      &.top{
        top: -10px;
      }
      &.bottom{
        bottom: 10px;
      }
    }
  }
}
</style>