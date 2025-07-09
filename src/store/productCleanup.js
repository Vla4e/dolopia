import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

import { allProductMap } from '@/assets/products/allProductMap.js';
import { productMapByCode } from '@/assets/products/productMapByCode';
import { productMapByPath } from '@/assets/products/productMapByPath';
import { categoryToSubcategory, categoryToSubcategoryNames, subcategoryFullNames } from '@/assets/products/categoryToSubcategory.js';
import { subcategoryToProductCodes, subcategoryToProducts, subcategoryToProductsMap } from '@/assets/products/subcategoryToProducts.js';

export const useProductStoreCleanup = defineStore('productCleanup', () => {
  // console.log("DEFINING STORE")
  // =====================================
  // CONSTANTS
  // =====================================
  const CATEGORIES = [
    'tomato-project',
    'vegetable-project', 
    'fruit-project',
    'pasta-project',
  ];

  const CATEGORY_FULL_NAMES = {
    "tomato-project": 'The Tomato Project',
    "vegetable-project": 'The Vegetable Project',
    "fruit-project": 'The Fruit Project',
    "pasta-project": 'The Pasta Project',
  };

  // source of truth
  const selectedCategoryId = ref('');
  const selectedSubcategoryId = ref('');
  const selectedProductCode = ref('');
  const isScrollActive = ref(false);

  // derivatives
  const currentCategory = computed(() => ({
    id: selectedCategoryId.value,
    name: CATEGORY_FULL_NAMES[selectedCategoryId.value] || '',
    subcategories: categoryToSubcategory.get(selectedCategoryId.value) || [],
    subcategoryNames: categoryToSubcategoryNames.get(selectedCategoryId.value) || []
  }));

  const currentSubcategory = computed(() => {
    const subcategoryId = selectedSubcategoryId.value;
    const products = subcategoryToProductsMap.get(subcategoryId) || new Map();
    
    return {
      id: subcategoryId,
      name: subcategoryFullNames[subcategoryId] || '',
      isCandiedFruit: subcategoryId === 'candied-fruit',
      products,
      productCodes: subcategoryToProductCodes.get(subcategoryId) || [],
      productNames: Array.from(products.values()).map(product => product['Product name EN'])
    };
  });

  const currentProduct = computed(() => {
    // console.log("CPRODUCT COMPUTING BEGIN", selectedProductCode.value)
    const productCode = selectedProductCode.value;
    const product = currentSubcategory.value.products.get(productCode);
    // console.log("Returning:", productCode, product)
    return {
      code: productCode,
      name: product?.['Product name EN'] || '',
      properties: product || {}
    };
  });

  // =====================================
  // VALIDATION COMPUTED
  // =====================================
  const isValidSelection = computed(() => {
    return !!(selectedCategoryId.value && 
              selectedSubcategoryId.value && 
              selectedProductCode.value);
  });

  const availableSubcategories = computed(() => 
    categoryToSubcategory.get(selectedCategoryId.value) || []
  );

  const availableProducts = computed(() => 
    subcategoryToProductsMap.get(selectedSubcategoryId.value) || new Map()
  );

  // =====================================
  // CASCADING UPDATE FUNCTIONS
  // =====================================
  function selectCategory(categoryId, preventCascade = false) {
    if (!CATEGORIES.includes(categoryId)) {
      console.warn(`Invalid category: ${categoryId}`);
      return false;
    }

    selectedCategoryId.value = categoryId;
    
    if (!preventCascade) {
      // Auto-select first available subcategory
      const subcategories = categoryToSubcategory.get(categoryId);
      if (subcategories?.length > 0) {
        selectSubcategory(subcategories[0]);
      }
    }
    
    return true;
  }

  function selectSubcategory(subcategoryId, preventCascade = false) {
    // Validate subcategory belongs to current category
    const availableSubs = categoryToSubcategory.get(selectedCategoryId.value) || [];
    if (!availableSubs.includes(subcategoryId)) {
      console.warn(`Subcategory ${subcategoryId} not available for category ${selectedCategoryId.value}`);
      return false;
    }

    selectedSubcategoryId.value = subcategoryId;
    
    if (!preventCascade) {
      // Auto-select first available product
      const products = subcategoryToProductsMap.get(subcategoryId);
      if (products?.size > 0) {
        const firstProductCode = products.keys().next().value;
        selectProduct(firstProductCode);
      }
    }
    
    return true;
  }

  function selectProduct(productCode) {
    // Validate product belongs to current subcategory
    const availableProducts = subcategoryToProductsMap.get(selectedSubcategoryId.value);
    if (!availableProducts?.has(productCode)) {
      console.warn(`Product ${productCode} not available for subcategory ${selectedSubcategoryId.value}`);
      return false;
    }

    selectedProductCode.value = productCode;
    return true;
  }

  // =====================================
  // UNIFIED SELECTION FUNCTION
  // =====================================
  function selectByType(type, identifier) {
    // console.log(`Selecting ${type}: ${identifier}`);
    
    switch (type) {
      case 'category':
        return selectCategory(identifier);
      case 'subcategory':
        return selectSubcategory(identifier);
      case 'product':
        return selectProduct(identifier);
      default:
        console.warn(`Unknown selection type: ${type}`);
        return false;
    }
  }

  // =====================================
  // INITIALIZATION & DEFAULTS
  // =====================================
  function setDefaults() {
    if (CATEGORIES.length > 0) {
      selectCategory(CATEGORIES[0]);
    }
  }

  function updateFromParams(params) {
    // console.log('Updating from params:', params);
    
    // Set without cascading first
    if (params.category) selectCategory(params.category, true);
    if (params.subcategory) selectSubcategory(params.subcategory, true);
    if (params.product) selectProduct(params.product);
    
    // Validate final state
    if (!isValidSelection.value) {
      console.warn('Invalid selection state after params update, applying defaults');
      setDefaults();
    }
  }

  // =====================================
  // WATCHERS FOR SIDE EFFECTS
  // =====================================
  watch(selectedCategoryId, (newVal) => {
    // console.log('Category changed to:', newVal);
  });

  watch(selectedSubcategoryId, (newVal) => {
    // console.log('Subcategory changed to:', newVal);
  });

  watch(selectedProductCode, (newVal) => {
    // console.log('Product changed to:', newVal);
  });

  // =====================================
  // LEGACY COMPATIBILITY (if needed)
  // =====================================
  const categoryByIdentifier = computed({
    get: () => selectedCategoryId.value,
    set: (val) => selectCategory(val)
  });

  const subcategoryByIdentifier = computed({
    get: () => selectedSubcategoryId.value,
    set: (val) => selectSubcategory(val)
  });

  const productCodeByIdentifier = computed({
    get: () => selectedProductCode.value,
    set: (val) => selectProduct(val)
  });

  // =====================================
  // RETURN STORE API
  // =====================================
  // console.log("CURRENT CATEGORY", currentCategory.value)
  let flowType = ref('old');
  function setFlowType(val) {
    flowType.value = val;
  }
  const getFlowType = computed({
    get: () => flowType.value,
    set: (val) => setFlowType(val)
  })
  return {
    // Primary state
    selectedCategoryId,
    selectedSubcategoryId, 
    selectedProductCode,
    isScrollActive,

    flowType,
    setFlowType,
    getFlowType,
    // Computed state
    currentCategory,
    currentSubcategory,
    currentProduct,
    isValidSelection,
    availableSubcategories,
    availableProducts,

    // Constants
    categories: CATEGORIES,
    categoryFullNames: CATEGORY_FULL_NAMES,

    // Actions
    selectCategory,
    selectSubcategory,
    selectProduct,
    selectByType,
    setDefaults,
    updateFromParams,

    // Legacy compatibility
    categoryByIdentifier,
    subcategoryByIdentifier,
    productCodeByIdentifier,
    selectItemFromDropdown: selectByType, // alias
    
    // Aliases for template usage
    changeByType: selectByType,
  };
});