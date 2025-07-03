import { productMapByCode } from "@/assets/products/productMapByCode";
import { allProductMap } from "@/assets/products/allProductMap";

export function prefillWithRoutes(){
  allProductMap.forEach((value, key) => {
    value.path = productMapByCode.get(key).path
  })
  console.log("ALLPMAP", allProductMap)
}