
import { allProductMap } from '@/assets/products/allProductMap.js';
import { categoryToSubcategory } from '@/assets/products/categoryToSubcategory.js';
import { 
  subcategoryToProductCodes, 
  subcategoryToProducts, 
  subcategoryToProductsMap
} from '@/assets/products/subcategoryToProducts.js';

import { productMapByCode } from '@/assets/products/productMapByCode';
import { productMapByPath } from '@/assets/products/productMapByPath';

import { useProductStoreCleanup } from '@/store/productCleanup';


function adjustParamStore(params, store) {
  store.updateParams(params)
}
async function handleProductRoute(productRoute){
  if(!productRoute){

  } else if (productRoute === 'default'){

  } else {

  }
}
async function isAllowedRoute(params, query) {
  // console.log(2, "IsAllowedRoute CALLED")
  try{
    let categoryRoute = params.category
    let subcategoryRoute = params.subcategory
    let productRoute = params.product || null
    
    if (!categoryToSubcategory.has(categoryRoute)) return {routeValidity: false, productCode: null};
    if (!categoryToSubcategory.get(categoryRoute).includes(subcategoryRoute)) return {routeValidity: false, productCode: null};
    if (productRoute) {
      // console.log("PRODUCTROUTE FOUND ! ")
      let productCode = productMapByPath.get(productRoute)?.code || null;
      if(productCode){
        let isProductValid = subcategoryToProductsMap.get(subcategoryRoute)?.has(productCode) || false; //check if code is contained in subcategory ma
        // console.log("Product validity:", isProductValid)
        return {routeValidity: isProductValid, productCode: null};
      }
    }
    return true;
  } catch (e) {
    console.error(e)
    return false
  }
}

async function adjustProductStoreCleanup(params, productCode) {
  // console.log("Adjusting product store from route:", { params, query });
  productStoreCleanup.updateFromParams({
    category: params.category,
    subcategory: params.subcategory,
    product: productCode || null // The action expects a 'product' key for the product code.
  });
}

async function handleRouteParameters(params, query){
  let {routeValidity, productCode} = isAllowedRoute(params, null)
  if(routeValidity){
    adjustProductStoreCleanup(params, productCode)
  }
}
// A helper function to validate parameters
function areParamsValid(params, store) {
  let category = params.category
  let subcategory = params.subcategory
  let foundCategory = store.categories.find((cat) => {
    return cat === category
  })
  let foundSubcategory = null;
  if(foundCategory){
    foundSubcategory = store.subcategories[foundCategory].find((subcat) => {
      return subcat === subcategory
    })
    if(foundSubcategory){
      return true
    } else return false
  } else return false
}

export { adjustParamStore, areParamsValid, isAllowedRoute }