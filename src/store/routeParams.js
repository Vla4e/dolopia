import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRouteParamsStore = defineStore({
  id: 'routeParams',
  state: () => ({
    category: null,
    subcategory: null,
    categories: Object.freeze([
      'tomato',
      'vegetable',
      'fruit',
      'pasta'
    ]),
    categoriesFullNames: Object.freeze({
      'tomato': 'The Tomato Project',
      'vegetable': 'The Vegetable Project',
      'fruit': 'The Fruit Project',
      'pasta': 'The Pasta Project',
    }),
    subcategories: Object.freeze({
      'tomato': [
        'pasta-saucess',
        'creations',
        'ketchup'
      ],
      'vegetable': [
        'spreads',
        'vegetables_in_oil',
        'dips'
      ],
      'fruit': [
        'jams',
        'marmalades',
        'syrups'
      ],
      'pasta': [
        'traditional',
        'vegan',
        'seafood'
      ]
    }),
  }),
  getters: {
  },
  actions: {
    updateParams(params) {
      // console.log("Adjusting params", params)
      this.category = params.category;
      this.subcategory = params.subcategory;
      // Update other params as needed
    },
    setDefaultParams() {
      this.category = 'tomato';
      this.subcategory = 'sauces';
      // Set other default params
    },
  }
})