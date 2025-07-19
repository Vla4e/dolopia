//Prefills the allProductMap.js map's values with predefined route paths from productMapByCode.js

import { productMapByCode } from "@/assets/products/productMapByCode";
import { allProductMap } from "@/assets/products/allProductMap";

export function prefillWithRoutes(){
  allProductMap.forEach((value, key) => {
    value.path = productMapByCode.get(key).path
  })
}