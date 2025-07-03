// routeParameterHandlers.js

import { categoryToSubcategory } from '@/assets/products/categoryToSubcategory.js';
import { subcategoryToProductCodes } from '@/assets/products/subcategoryToProducts.js';
import { productMapByCode } from '@/assets/products/productMapByCode';
import { productMapByPath } from '@/assets/products/productMapByPath';
import { useProductStoreCleanup } from '@/store/productCleanup';

/**
 * [Internal] Updates the Pinia store. This is the "side effect".
 * @param {object} params - The route parameters { category, subcategory }.
 * @param {string} productCode - The validated product code.
 */
function _updateProductStore(params, productCode) {
  const productStoreCleanup = useProductStoreCleanup();
  productStoreCleanup.updateFromParams({
    category: params.category,
    subcategory: params.subcategory,
    product: productCode,
  });
}

/**
 * [Internal] Gets the default product path for a given subcategory.
 * @param {string} subcategoryIdentifier - The identifier for the subcategory.
 * @returns {string|null} The path of the default product or null if not found.
 */
function _getDefaultProductPathForSubcategory(subcategoryIdentifier) {
  const firstProductCode = subcategoryToProductCodes.get(subcategoryIdentifier)?.[0];
  console.log('fpc', firstProductCode, !firstProductCode)
  if (!firstProductCode) return null;
  console.log("PMAPBYCODE", productMapByCode.get(firstProductCode))
  const product = productMapByCode.get(firstProductCode);
  console.log("ppath", product.path)
  return product?.path || null;
}

/**
 * [Internal] A pure function to sequentially validate route parameters.
 * It does NOT modify state.
 * @param {object} params - The route parameters { category, subcategory, product }.
 * @returns {object} A resolution object: { status: 'VALID'|'REDIRECT'|'NOT_FOUND', payload: ... }
 */
async function _resolveProjectRoute(params) {
  console.log("PARAMS PATHMATCH", params)
  let { category, subcategory, product: productPath } = params;
  console.log("attempting resolution", category, subcategory, productPath)
  // 1. Validate Category
  let validSubcategories = categoryToSubcategory.get(category);
  if (!validSubcategories) {
    //default to tomato-project if category param is incorrect
    category = 'tomato-project'
    validSubcategories = categoryToSubcategory.get(category)
  }

  // 2. Validate Subcategory
  if (!validSubcategories.includes(subcategory)) {
    const defaultSubcategory = validSubcategories[0];
    const defaultProduct = _getDefaultProductPathForSubcategory(defaultSubcategory);
    if (!defaultProduct) return { status: 'NOT_FOUND' };
    console.log("Redirection, default subcategory")
    return {
      status: 'REDIRECT',
      payload: { 
        name: 'projects', 
        params: { category, subcategory: defaultSubcategory, product: defaultProduct } 
      }
    };
  }

  // 3. Validate Product
  if (!productPath || productPath === 'default') {
    const defaultProduct = _getDefaultProductPathForSubcategory(subcategory);
    if (!defaultProduct) return { status: 'NOT_FOUND' };
    
    console.log("Redirection, default product")
    return {
      status: 'REDIRECT',
      payload: { name: 'projects', params: { ...params, product: defaultProduct } }
    };
  }

  const productCode = productMapByPath.get(productPath)?.code;
  let temp = subcategoryToProductCodes.get(subcategory);
  console.log("temp -> ", temp)
  console.log("CODE ->", productCode)
  console.log("IS IT IN TEMP?", temp.includes(productCode))
  const isProductInSubcategory = productCode && subcategoryToProductCodes.get(subcategory)?.includes(productCode);
  // console.log("ISPINSUBCAT?", isProductInSubcategory, !!productCode, subcategoryToProductCodes.get(subcategory))
  if (isProductInSubcategory) {
    // Valid! Return the productCode in the payload for the wrapper to use.
    return { status: 'VALID', payload: { productCode } };
  } else {
    // Invalid product, redirect to the default for the subcategory.
    const defaultProduct = _getDefaultProductPathForSubcategory(subcategory);
    if (!defaultProduct) return { status: 'NOT_FOUND' };
    
    console.log("Redirection, isproduct in subcat")
    return {
      status: 'REDIRECT',
      payload: { name: 'projects', params: { ...params, product: defaultProduct } }
    };
  }
}

/**
 * The main exported wrapper function called by the router.
 * It orchestrates validation and state updates.
 * @param {object} params - The route parameters from Vue Router.
 * @returns {object} The final resolution object for the router guard.
 */
export async function handleProjectRouteParameters(params) {
  console.log("---------------handlerpparams----------------")
  // 1. Get the pure validation result first.
  const resolution = await _resolveProjectRoute(params);

  // 2. If the route is valid, perform the side effect (update the store).
  if (resolution.status === 'VALID') {
    _updateProductStore(params, resolution.payload.productCode);
  }

  // 3. Return the final resolution to the router guard.
  // The payload is passed through for REDIRECT cases.
  // The payload for VALID cases is not needed by the router, but no harm in passing it.
  return resolution;
}