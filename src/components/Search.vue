<script setup>
import searchIconBlack from "@/assets/s-black.svg";
import searchIconWhite from "@/assets/s-white.svg";
import { ref, watch, onMounted, inject } from "vue";
import { useDebounceFn, useEventListener } from "@vueuse/core";
import { useMenuStore } from "@/store/menu";
import { allProductMap } from "@/assets/products/allProductMap";
import { subcategoryFullNames } from "@/assets/products/categoryToSubcategory";
import { productSearchTrie as Trie } from "@/helpers/Search/Trie";

const menuStore = useMenuStore();
const { isMobile } = inject("screenSize");

defineOptions({
  name: "SearchFunctionality",
});

const props = defineProps({
  navbarTheme: {
    type: String,
    required: false,
    default: "dark",
  },
});

// State
const isSearching = ref(false);
const showResults = ref(false);
const showInputField = ref(false);
const playInputFieldAnimation = ref(false);
const searchTerm = ref("");
const searchResults = ref([]);
const searchResultsMapped = ref([]);
const searchInputContainer = ref();

// Constants
const minimumSearchTermLength = 3;
const debounceDelay = 150;

// Functions
function toggleInputFieldVisibility() {
  if (showInputField.value) {
    playInputFieldAnimation.value = false;
    setTimeout(() => {
      showInputField.value = false;
      menuStore.setSearchInputFlag(false);
    }, 400);
  } else {
    showInputField.value = true;
    playInputFieldAnimation.value = true;
    menuStore.setSearchInputFlag(true);
  }
}

const debouncedSearch = useDebounceFn(
  (term) => {
    if (term.length < minimumSearchTermLength) {
      searchResultsMapped.value = [];
      return;
    }
    
    searchResults.value = Trie.findMatches(term);
    const tempArray = searchResults.value.map(res => allProductMap.get(res.productId));
    searchResultsMapped.value = tempArray;
    isSearching.value = false;
    showResults.value = true;
  },
  debounceDelay,
  { maxWait: 600 }
);

// Watchers
watch(searchTerm, (val) => {
  isSearching.value = true;
  debouncedSearch(val);
});

// Lifecycle
onMounted(() => {
  useEventListener(searchInputContainer, "focusout", () => {
    showResults.value = false;
    showInputField.value = false;
    menuStore.setSearchInputFlag(false);
  });
  
  useEventListener(searchInputContainer, "focusin", () => {
    if (searchTerm.value.length >= minimumSearchTermLength) {
      showResults.value = true;
    }
  });
});
</script>

<template>
  <div
    ref="searchInputContainer"
    class="search-container"
    :class="{ searching: playInputFieldAnimation }"
  >
    <div class="input-container">
      <img
        :src="navbarTheme === 'dark' ? searchIconBlack : searchIconWhite"
        :class="{ searching: isSearching }"
        class="search-icon"
        @click="toggleInputFieldVisibility"
        alt="Search"
      />
      
      <input
        v-show="showInputField"
        v-model="searchTerm"
        type="text"
        class="input-field"
        :class="{ active: playInputFieldAnimation }"
        placeholder="search"
      />
      
      <Transition name="fade-in-out">
        <ul v-show="showResults && searchTerm.length >= minimumSearchTermLength" class="results">
          <li v-if="searchResultsMapped.length" v-for="result in searchResultsMapped" :key="result.pathSlug" class="result-item">
            <router-link
              :to="`/projects/${result.keyToCategory}-project/${result.keyToSubcategory}/${result.pathSlug}`"
              @click="showResults = false"
              class="result-link"
            >
              <img :src="result.mainImageCompressed" :alt="result['Product name EN']" class="result-image" />
              <span class="result-name">{{ result["Product name EN"] }}</span>
              <span class="result-subcategory">{{ subcategoryFullNames[result.keyToSubcategory] }}</span>
            </router-link>
          </li>
          
          <li v-else class="result-item">
            <div class="result-link result-link-no-result">
              <span class="result-name">Oops, couldn't find anything for "{{ searchTerm }}"</span>
            </div>
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
    width: 100%;
    justify-content: flex-end;

    .input-field {
      width: 0;
      padding: 5px;
      border: 1px solid #131313;
      border-radius: 2px;
      outline: none;
      transition: width 0.3s ease-out;
      
      &.active {
        @media (min-width: 450px) {
          width: 500px;
        }
      }

      &:focus {
        @media (min-width: 450px) {
          width: 500px;
        }
      }

      &::placeholder {
        color: #4b4b4b;
        font-family: "Century Gothic";
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
  
  &.searching {
    .input-field {
      width: 60% !important;
    }
  }

  .search-icon {
    width: 24px;
    height: 24px;
    margin-right: 5px;
    cursor: pointer;
    
    &.searching {
      animation: pulsate 1s linear infinite;
    }
  }

  .results {
    position: absolute;
    top: 100%;
    right: 0;
    width: 100%;
    max-height: 40vh;
    background: whitesmoke;
    color: black;
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    z-index: 1000;

    .result-item {
      display: flex;
      align-items: center;
      cursor: pointer;

      &:not(:last-child) {
        border-bottom: 1px solid #e0e0e0;
      }

      .result-link {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px;
        text-decoration: none;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f5f5f5;
          
          .result-name {
            transform: scale(1.02);
          }
        }
      }

      .result-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        margin-right: 10px;
        border-radius: 4px;
      }

      .result-name {
        flex: 1;
        color: #000;
        font-family: "Raleway";
        font-size: 16px;
        font-weight: 400;
        line-height: 1.2;
        letter-spacing: 0.8px;
        text-transform: capitalize;
        transition: transform 0.3s ease;
      }

      .result-subcategory {
        color: #666;
        font-family: "Raleway";
        font-size: 14px;
        font-weight: 400;
        line-height: 1.2;
        letter-spacing: 0.8px;
        text-transform: capitalize;
        margin-left: 10px;
      }

      .result-link-no-result {
        justify-content: center;
        
        .result-name {
          text-align: center;
          color: #666;
        }
      }

      @media (max-width: 1024px) {
        .result-name {
          font-size: 14px;
        }
        
        .result-subcategory {
          font-size: 12px;
        }
        
        .result-image {
          width: 40px;
          height: 40px;
        }
      }
    }
  }

  // Mobile styles
  @media (max-width: 450px) {
    position: absolute;
    right: 0;
    width: 10vw;
    flex: none;
    transition: width 0.5s ease, transform 0.5s ease;

    .input-container {
      justify-content: center;
      transition: transform 0.5s ease;

      .input-field {
        width: 100%;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }

    .search-icon {
      width: 28px;
      height: 28px;
    }

    .results {
      right: -5vw;
      width: 95vw;
    }

    &.searching {
      width: 90vw;
      transform: translateX(-80vw);

      .input-field {
        opacity: 1;
      }
    }
  }
}

@keyframes pulsate {
  0% { transform: scale(1); }
  33% { transform: scale(0.9); }
  66% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.fade-in-out-enter-active,
.fade-in-out-leave-active {
  transition: opacity 0.2s ease;
}

.fade-in-out-enter-from,
.fade-in-out-leave-to {
  opacity: 0;
}
</style>