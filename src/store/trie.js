//Store for Trie initialization and provision

import { defineStore } from 'pinia';
import { ref } from 'vue';

import { allProductMap } from '@/assets/products/allProductMap';
import { ProductSearchTrie, productSearchTrie, Priority } from '@/helpers/Search/Trie';

export const useTrieStore = defineStore('trie', () => {
  console.log("running trie init: ")
  const TrieTree = ref(new ProductSearchTrie());
  TrieTree.value.indexProducts(allProductMap)
  console.log("Trie Tree:", TrieTree.value)
  return {
    TrieTree
  }
});
