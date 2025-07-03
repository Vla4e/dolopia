import { defineStore } from 'pinia';
import { ref, reactive, computed, watch, toRaw } from 'vue';

import { allProductMap } from '@/assets/products/allProductMap.js';
import { categoryToSubcategory, categoryToSubcategoryNames, subcategoryFullNames } from '@/assets/products/categoryToSubcategory.js';
import { subcategoryToProductCodes, subcategoryToProducts, subcategoryToProductsMap } from '@/assets/products/subcategoryToProducts.js';


// // console.log("subcategory")
export const useProductStore = defineStore('product', () => {

  let isScrollActive = ref(false)
  // State variables
  const category = ref(null);
  const subcategory = ref(null);
  const categories = [
    'tomato-project',
    'vegetable-project',
    'fruit-project',
    'pasta-project',
  ]
  const categoriesByIdentifier = [
    'tomato-project',
    'vegetable-project',
    'fruit-project',
    'pasta-project',
  ]
  const categoriesByFullnames = [
    'The Tomato Project',
    'The Vegetable Project',
    'The Fruit Project',
    'The Pasta Project',
  ]
  const categoriesFullNames = {
    "tomato-project": 'The Tomato Project',
    "vegetable-project": 'The Vegetable Project',
    "fruit-project": 'The Fruit Project',
    "pasta-project": 'The Pasta Project',
  }

  let categoryByIdentifier = ref('')
  let subcategoryByIdentifier = ref('')
  let productName = ref('')
  let productCodeByIdentifier = ref('')

  let categoryData = reactive({
    name : '',
    fullName: '',
    subcategories: [],
    subcategoryNames: []
  })

  let subcategoryData = reactive({
    name: '',
    isCandiedFruit: false,
    fullName: '',
    products: new Map(),
    productIdentifiers: [],
    productNames: []
  })

  let productData = reactive({
    name: '',
    code: '',
    properties: {}
  })
  
  watch(() => categoryByIdentifier.value, (value) => {
    // console.log("===============!WATCHER! categoryByIdentifier w", value)
    categoryData.subcategories = categoryToSubcategory.get(value) //fetch the subcategory identifiers array
    categoryData.subcategoryNames = categoryToSubcategoryNames.get(value)
    categoryData.name = value
    categoryData.fullName = categoriesFullNames[value]
  
  })
  watch(() => categoryData.name, (value) => {
    // console.log("===============!WATCHER! categoryData", value)
    // subcategoryByIdentifier.value = categoryData.subcategories[0] // default to first subcategory of array

  })

  watch(() => subcategoryByIdentifier.value, (value) => {
    // console.log("===============!WATCHER! subcategoryByIdentifier w:", value)
    subcategoryData.products = subcategoryToProductsMap.get(value) // populate with product map
    subcategoryData.productIdentifiers = subcategoryToProductCodes.get(value) // populate with product map
    subcategoryData.productNames = subcategoryData.productIdentifiers.map(identifier => {
      let foundProduct = subcategoryData.products.get(identifier)
      let fetchedName = foundProduct['Product name EN']
      // // // console.log("fetchedname --- ", fetchedName)
      return fetchedName
    })
    if(value === 'candied-fruit'){
      subcategoryData.isCandiedFruit = true
    }
    subcategoryData.name = value
    subcategoryData.fullName = subcategoryFullNames[value]
    // // console.log("subcatData", value)
  })

  watch(() => subcategoryData.name, (value) => {
    // console.log("===============!WATCHER! subcategoryData w:", value)
    let fetchFirstProduct = subcategoryToProductsMap.get(value).entries().next() //default to first product of map
    // // // console.log("first product:", fetchFirstProduct)
    productData.properties= fetchFirstProduct.value[1]
    productData.name = productName.value = fetchFirstProduct.value[1]['Product name EN']
    productData.code = productCodeByIdentifier.value = fetchFirstProduct.value[0]
  })

  watch(() => productCodeByIdentifier.value, (newValue, oldValue) => {
    // console.log("===============!WATCHER! productCodeByIdentifier", newValue)
    if(newValue !== oldValue){
      let fetchProduct = subcategoryData.products.get(newValue)
      // // console.log("Fetchproduct", subcategoryData.products)
      productData.code = newValue
      productData.properties = fetchProduct
      productData.name = fetchProduct['Product name EN']
    }
  })

  watch(() => productName.value, (value) => {
    // console.log("===============!WATCHER! productName w:", value)
    
  })

  watch(() => productData.name, (value) => {
    // console.log("===============!WATCHER! productData w:", productData)
  })
  
  function selectItemFromDropdown(type, itemIdentifier){
    // // console.log('Type:', type)
    // // // console.log("Item name", item.name)
    // // console.log("Item:", itemIdentifier)
    // // console.log("catid", categoryByIdentifier.value)
    // // console.log("subcatid", subcategoryByIdentifier.value)
    // // console.log("productid", productCodeByIdentifier.value)
    if(type === 'category'){
      // // console.log("trying to set cat")
      categoryByIdentifier.value = itemIdentifier
      let glue = categoryToSubcategory.get(itemIdentifier)
      subcategoryByIdentifier.value = glue[0]
    } else if (type === 'subcategory') {
      // // console.log("trying to set subcat")
      subcategoryByIdentifier.value = itemIdentifier

    } else if (type === 'product') {
      // // console.log("trying to set product")
      productCodeByIdentifier.value = itemIdentifier
    }
  }


  let selectedCategory = ref('');
  let subcategories = ref([]);
  let subcategoryNames = ref([])
  let selectedSubcategory = reactive({
    name: '',
    products: new Map()
  });
  let selectedProduct = reactive({
    productCode: '',
    productName: '',
    properties: {},
  })
  let selectedProductCode = ref('')

  watch(() => selectedCategory.value, (newCategory)=>{
    // console.log("new category selected", newCategory)
    subcategories.value = categoryToSubcategory.get(newCategory)
    subcategoryNames.value = categoryToSubcategoryNames.get(newCategory)
    let subcategoryName = subcategories.value[0]
    selectedSubcategory.products = subcategoryToProductsMap.get(subcategoryName)
    selectedSubcategory.name = subcategoryName
  })
  watch(() => selectedSubcategory.name, ( newSubcategoryName )=>{
    // console.log("subcat watcher triggered", newSubcategoryName)
    //retrieve first map entry of subcategory's products map.
    let productMapEntry = subcategoryToProductsMap.get(newSubcategoryName).entries().next().value
    selectedProductCode = productMapEntry[0] //might be redundant
    // selectedProduct =  {
    //   productCode: productMapEntry[0], //gets the key of the retrieved map entry
    //   productName: productMapEntry[1]['Product name EN'],
    //   properties: productMapEntry[1] //gets the value of the retrieved map entry
    // }
    selectedProduct.productCode = productMapEntry[0];
    selectedProduct.productName = productMapEntry[1]['Product name EN'];
    selectedProduct.properties = productMapEntry[1]
    // // // console.log("CURRENT PRODUCT:", selectedProduct)
  })

  watch(selectedProduct, ( newProduct) => {
    // console.log("CHANGE IN SPRODUCT", newProduct)
  }, {
    immediate: true
  })
  //Setters
  function changeCategory(newCategory){
    // console.log("changing cat", newCategory)
    selectedCategory.value = newCategory
  }
  function changeSubcategory(newSubcategory){
    selectedSubcategory.name = newSubcategory
  }
  function changeProduct(newProduct){
    selectedProduct = newProduct
  }
  function changeProductCode(newProductCode){
    selectedProductCode.value = newProductCode
  }
  function changeByType(identifier, name, type){
    // // // console.log("Will change", type, "of id", identifier, "and name", name, "------------ !")
    if(type === 'category'){
      changeCategory(identifier)
    } else if( type === 'subcategory'){
      changeSubcategory(identifier)
    } else if (type === 'product') {
      changeProduct(identifier)
    } else if (type === 'productCode'){
      changeProductCode(identifier)
    }
  }
  //Getters
  function getCategory(){
    return selectedCategory.value
  }
  function getSubcategory(){
    return selectedSubcategory.value
  }
  function getProduct(){
    return selectedProduct
  }
  function getProductCode(){
    return selectedProductCode.value
  }


  // const subcategories = Object.freeze({
  //   tomato: ['pasta-saucess', 'creations', 'ketchup'],
  //   vegetable: ['spreads', 'vegetables_in_oil', 'dips'],
  //   fruit: ['jams', 'marmalades', 'syrups'],
  //   pasta: ['traditional', 'vegan', 'seafood'],
  // });

  // Actions
  function updateParams(params) {
    // console.log('Adjusting params', params);
    category.value = params.category;
    subcategory.value = params.subcategory;
    // Update other params as needed
  }

  function setDefaultParams() {
    category.value = 'tomato';
    subcategory.value = 'sauces';
    // Set other default params
  }

  // // console.log("PRODUCT STORE INSTANCE FINISHED =================================================")
  // // console.log(categoryByIdentifier.value)
  // // console.log(subcategoryByIdentifier.value)
  // // console.log(productCodeByIdentifier.value)
  // Return state and actions
  return {
    category,
    subcategory,
    categories,
    categoriesFullNames,
    subcategories,
    subcategoryNames,
    updateParams,
    setDefaultParams,
    selectedCategory,
    selectedSubcategory,
    selectedProduct,
    selectedProductCode,
    changeByType,
    changeCategory,
    changeSubcategory,
    changeProduct,
    changeProductCode,

    categoriesByIdentifier,
    categoriesFullNames,
    categoriesByFullnames,
    categoryByIdentifier,
    subcategoryByIdentifier,
    productName,
    productCodeByIdentifier,
    categoryData,
    subcategoryData,
    productData,
    selectItemFromDropdown,
    isScrollActive
  }
});
