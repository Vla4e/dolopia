import { categoryToSubcategory } from '@/assets/products/categoryToSubcategory.js';
import { subcategoryToProductCodes } from '@/assets/products/subcategoryToProducts.js';
import { productMapByCode } from '@/assets/products/productMapByCode';
import { productMapByPath } from '@/assets/products/productMapByPath';
import { useProductStoreCleanup } from '@/store/productCleanup';

/**
 * [Internal] Updates the Pinia store with the validated product details.
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
  if (!firstProductCode) return null;
  
  const product = productMapByCode.get(firstProductCode);
  return product?.path || null;
}

/**
 * [Internal] A pure function to sequentially validate product route parameters.
 * It does NOT modify state.
 * @param {object} params - The route parameters { category, subcategory, productName }.
 * @returns {object} A resolution object: { status: 'VALID'|'REDIRECT'|'NOT_FOUND', payload: ... }
 */
async function _resolveProjectRoute(params) {
  const { category, subcategory, product: productName } = params;

  // 1. Validate Category
  const validSubcategories = categoryToSubcategory.get(category);
  if (!validSubcategories) {
    // If the category itself is invalid, we cannot proceed.
    return { status: 'NOT_FOUND' };
  }

  // 2. Validate Subcategory
  if (!validSubcategories.includes(subcategory)) {
    // If the subcategory is not valid for the given category, we cannot proceed.
    return { status: 'NOT_FOUND' };
  }

  // 3. Validate Product
  if (!productName) {
    // If productName is missing, redirect to the default product for the valid subcategory.
    const defaultProduct = _getDefaultProductPathForSubcategory(subcategory);
    if (!defaultProduct) return { status: 'NOT_FOUND' };
    return {
      status: 'REDIRECT',
      payload: { 
        name: 'projects', 
        params: { ...params, productName: defaultProduct } 
      }
    };
  }

  const productCode = productMapByPath.get(productName)?.code;
  const isProductInSubcategory = productCode && subcategoryToProductCodes.get(subcategory)?.includes(productCode);
  if (isProductInSubcategory) {
    // The URL is fully valid.
    return { status: 'VALID', payload: { productCode } };
  } else {
    // The product is invalid for the given subcategory, so redirect to its default product.
    const defaultProduct = _getDefaultProductPathForSubcategory(subcategory);
    if (!defaultProduct) return { status: 'NOT_FOUND' };
    return {
      status: 'REDIRECT',
      payload: { 
        name: 'projects', 
        params: { ...params, productName: defaultProduct } 
      }
    };
  }
}

/**
 * The main exported wrapper function called by the router guard.
 * It orchestrates validation and state updates for the product route.
 * @param {object} params - The route parameters from Vue Router.
 * @returns {object} The final resolution object for the router guard.
 */
export async function handleProjectRouteParameters(params) {
  const resolution = await _resolveProjectRoute(params);

  // If the route is valid, perform the side effect (update the store).
  if (resolution.status === 'VALID') {
    _updateProductStore(params, resolution.payload.productCode);
  }

  return resolution;
}