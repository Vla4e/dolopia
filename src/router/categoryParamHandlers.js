
import { allProductMap } from '@/assets/products/allProductMap.js';
import { categoryToSubcategory } from '@/assets/products/categoryToSubcategory.js';
import { 
  subcategoryToProductCodes, 
  subcategoryToProducts, 
  subcategoryToProductsMap
} from '@/assets/products/subcategoryToProducts.js';

function adjustParamStore(params, store) {
  store.updateParams(params)
}

function isAllowedRoute(params, query, store) {
  try{
    let categoryRoute = params.category
    let subcategoryRoute = params.subcategory
    let productRoute = query.product || null
    console.log("going to category", categoryRoute, " / ", subcategoryRoute, " and product", productRoute)
    if (!categoryToSubcategory.has(categoryRoute)) return false;
    console.log("get throws false")
    if (!categoryToSubcategory.get(categoryRoute).includes(subcategoryRoute)) return false;
    if (productRoute) {
        return subcategoryToProductsMap.get(routeSubcat)?.has(productRoute) || false;
    }
    return true;
  } catch (e) {
    console.error(e)
    return false
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