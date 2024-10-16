import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

import { allProductMap } from '@/assets/products/allProductMap.js';
import { categoryToSubcategory } from '@/assets/products/categoryToSubcategory.js';
import { subcategoryToProductCodes, subcategoryToProducts, subcategoryToProductsMap, subCategoryToProductsMap } from '@/assets/products/subcategoryToProducts.js';

export const useProductStore = defineStore('product', () => {
  // State variables
  const category = ref(null);
  const subcategory = ref(null);

  let selectedCategory = ref('');
  let selectedSubcategory = reactive({
    name: '',
    products: new Map()
  });
  let selectedProduct = reactive({
    productCode: '',
    properties: new Map(),
  })
  let selectedProductCode = ref('')

  watch(() => selectedCategory.value, (newCategory)=>{
    console.log("new category selected", newCategory)
    let subcategoryName = categoryToSubcategory.get(newCategory)[0]
    selectedSubcategory = {
      name: subcategoryName,
      products: subCategoryToProductsMap.get(subcategoryName)
    }
  })
  watch(() => selectedSubcategory.name, (newSubcategoryName)=>{
    console.log("subcat selected", newSubcategoryName)
    //retrieve first map entry of subcategory's products map.
    let productMapEntry = categoryToSubcategory.get(newSubcategoryName).entries().next().value 
    selectedProductCode = productMapEntry[0] //might be redundant
    console.log("first product's key", productMapEntry[0])
    selectedProduct =  {
      productCode: productMapEntry[0], //gets the key of the retrieved map entry
      properties: productMapEntry[1] //gets the value of the retrieved map entry
    } 
  })

  //Setters
  function changeCategory(newCategory){
    selectedCategory.value = newCategory
  }
  function changeSubcategory(newSubcategory){
    selectedSubcategory.value = newSubcategory
  }
  function changeProduct(newProduct){
    selectedProduct.value = newProduct
  }
  function changeProductCode(newProductCode){
    selectedProductCode.value = newProductCode
  }

  //Getters
  function getCategory(){
    return selectedCategory.value
  }
  function getSubcategory(){
    return selectedSubcategory.value
  }
  function getProduct(){
    return selectedProduct.value
  }
  function getProductCode(){
    return selectedProductCode.value
  }


  const categories = Object.freeze([
    'tomato-project',
    'vegetable-project',
    'fruit-project',
    'pasta-project',
  ]);

  const categoriesFullNames = Object.freeze({
    tomato: 'The Tomato Project',
    vegetable: 'The Vegetable Project',
    fruit: 'The Fruit Project',
    pasta: 'The Pasta Project',
  });

  const subcategories = Object.freeze({
    tomato: ['pasta-saucess', 'creations', 'ketchup'],
    vegetable: ['spreads', 'vegetables_in_oil', 'dips'],
    fruit: ['jams', 'marmalades', 'syrups'],
    pasta: ['traditional', 'vegan', 'seafood'],
  });

  // Actions
  function updateParams(params) {
    console.log('Adjusting params', params);
    category.value = params.category;
    subcategory.value = params.subcategory;
    // Update other params as needed
  }

  function setDefaultParams() {
    category.value = 'tomato';
    subcategory.value = 'sauces';
    // Set other default params
  }

  // Return state and actions
  return {
    category,
    subcategory,
    categories,
    categoriesFullNames,
    subcategories,
    updateParams,
    setDefaultParams,
    selectedCategory,
    selectedSubcategory,
    selectedProduct,
    selectedProductCode

  };
});
