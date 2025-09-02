<script setup>
defineOptions({
  name: "SearchFunctionality",
});

import { ref, watch, onMounted, nextTick } from "vue";

import { allProductMap } from "@/assets/products/allProductMap";
import { subcategoryFullNames } from "@/assets/products/categoryToSubcategory";

import { useTrieStore } from "@/store/trie";
const trieStore = useTrieStore();
let { TrieTree } = trieStore;

import { useDebounceFn, useEventListener } from "@vueuse/core";
let isSearching = ref(false);
let showResults = ref(false);

let searchInput = ref();
let searchTerm = ref("");
const minimumSearchTermLength = 3;
let searchResults = ref([]);
let searchResultsMapped = ref([]);

const debouncedSearch = useDebounceFn(
  (term) => {
    if (term.length < minimumSearchTermLength) {
      // exit if search term is too short
      return;
    }

    searchResults.value = TrieTree.findMatches(term);

    let tempArray = [];
    searchResults.value.forEach((res) => {
      // fetch product data objects using result's productIds
      tempArray.push(allProductMap.get(res.productId));
    });
    searchResultsMapped.value = tempArray; //assign to rerender only once instead of per iteration
    isSearching.value = false
    showResults.value = true;
    console.log("Should show results")
  },
  300,
  { maxWait: 600 }
);

watch(searchTerm, async (val) => {
  isSearching.value = true;
  debouncedSearch(val);
});

onMounted(() => {
  console.log("Search input val", searchInput.value);
  if (searchInput.value) {
    searchInput.value.addEventListener("focusout", ()=> {
      showResults.value = false;
    });
    searchInput.value.addEventListener("focusin", ()=> {
      showResults.value = true;
    });
  }
});
</script>

<template>
  <div ref="searchInput" class="search-container">
    <div class="input-container">
      <img
        src="@/assets/search-icon.png"
        :class="isSearching ? 'searching' : ''"
        style="opacity: 1"
        class="search-icon"
      />
      <input type="text" v-model="searchTerm" class="input-field" placeholder="search" />
      <!-- <span class="clear-input">x</span> -->
      <Transition name="fade-in-out">
        <ul v-show="showResults" class="results">
          <li v-for="result in searchResultsMapped" class="result-item">
            <router-link
              :to="
                '/projects/' +
                result.keyToCategory + '-project' +
                '/' +
                result.keyToSubcategory +
                '/' +
                result.pathSlug
              "
              @click="showResults = !showResults"
              class="result-link"
            >
              <img :src="result.mainImageCompressed" class="result-image" />
              <span class="result-name">
                {{ result["Product name EN"] }}
              </span>
              <span class="result-subcategory"
                >{{ subcategoryFullNames[result.keyToSubcategory] }}
              </span>
            </router-link>
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-container {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  position: relative;
  .input-container {
    display: flex;
    width: 60%;
    justify-content: flex-end;
    .input-field {
      width: 20%;
      -webkit-transition: width 0.2s ease-out;
      -moz-transition: width 0.2s ease-out;
      -o-transition: width 0.2s ease-out;
      transition: width 0.2s ease-out;
      padding: 5px;
      &:active,
      &:focus {
        width: 60%;
      }

      &::placeholder{
        color: #4b4b4b;
        font-family: "Century Gothic";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
      }
    }
    .clear-input{
      position: absolute;
      color: black;
      right: 4px;
    }
  }
  .search-icon {
    width: 24px;
    height: 24px;
    margin-right: 5px;
    &.searching {
      animation: spin 1s linear infinite;
      transform-origin: center;
    }
  }
  .results {
    display: flex;
    flex-direction: column;
    // width: 100%;
    max-width: 100%;
    max-height: 40vh;
    position: absolute;
    transform: translateY(50px);
    color: black;
    list-style-type: none;
    padding-inline-start: 0px;
    overflow-y: scroll;
    background: whitesmoke;
    .result-item {
      display: flex;
      align-items: center;
      // width: 100%;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 5px;
      }
      &:hover {
        background: gainsboro;
      }
      .result-link {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .result-image {
        width: 10%;
      }
      .result-name {
        width: 70%;
        color: #000;
        font-family: "Century Gothic";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 120% */
        letter-spacing: 0.8px;
        text-transform: capitalize;
        padding: 5px 10px;
        width: 60%;
      }
      .result-subcategory {
        color: #000;
        font-family: "Century Gothic";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 120% */
        letter-spacing: 0.8px;
        text-transform: capitalize;
        width: 20%;
      }
      @media(max-width: 1024px){
        .result-name{
          font-size: 14px;
          padding-left: 5px;
        }
        .result-subcategory{
          font-size: 12px;
        }
        .result-image{
          width: 75px;
        }
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: scale(100%);
  }
  33% {
    transform: scale(90%);
  }
  66% {
    transform: scale(100%);
  }
  100% {
    transform: scale(110%);
  }
}
</style>
