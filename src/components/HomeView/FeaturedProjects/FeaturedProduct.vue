<script setup>
import { nextTick, onMounted, ref } from "vue";
import ChevronLink from "@/components/Routing/ChevronLink.vue";

// Define the component's props
const props = defineProps({
  layoutType: {
    type: String,
    required: true,
    // Ensure only valid layout types are passed
    validator: (value) => ["tomato", "vegetable", "pasta", "fruit"].includes(value),
  },
  product: {
    type: Object,
    required: true,
  },
});

// Template refs for positioning calculations
let container = ref();
let topTarget = ref();
let rightTarget = ref();
let leftTarget = ref();
let floatingImage = ref();

// A helper function to dynamically import image assets
const getImageUrl = (path) => {
  return new URL(`/src/assets/${path}`, import.meta.url).href;
};

// Unified positioning logic
const positionImage = async () => {
  await nextTick();

  if (!floatingImage.value) return;

  // Use a switch statement based on layoutType to apply the correct logic
  switch (props.layoutType) {
    case "tomato": {
      if (!rightTarget.value) return;
      const rightTargetRect = rightTarget.value.getBoundingClientRect();
      const offsetInPixels = ((9 - 9) * window.innerWidth) / 100;
      const rightVal = rightTargetRect.width - offsetInPixels;
      floatingImage.value.style.right = rightVal + "px";
      break;
    }
    case "vegetable": {
      if (!rightTarget.value) return;
      const rightTargetRect = rightTarget.value.getBoundingClientRect();
      const offsetInPixels = ((12 - 0) * window.innerWidth) / 100;
      const leftVal = rightTargetRect.width - offsetInPixels;
      floatingImage.value.style.left = leftVal + "px";
      break;
    }
    case "pasta": {
      const imageBottomOffset = (5 * floatingImage.value.height) / 100;
      floatingImage.value.style.marginBottom = -imageBottomOffset + "px";
      break;
    }
    case "fruit": {
      if (!leftTarget.value || !rightTarget.value) return;
      const leftTargetRect = leftTarget.value.getBoundingClientRect();
      const imageRect = floatingImage.value.getBoundingClientRect();
      const offsetInPixels = ((10 - 0) * window.innerWidth) / 100;
      const offsetByAwardIcon = (25 * imageRect.width) / 100;
      const heightOffset = (5 * imageRect.height) / 100;

      floatingImage.value.style.left =
        leftTargetRect.width - (offsetByAwardIcon + offsetInPixels) + "px";
      floatingImage.value.style.bottom = -heightOffset + "px";
      break;
    }
  }
};

onMounted(() => {
  // Use a short timeout to ensure all elements are rendered
  setTimeout(positionImage, 500);
});

let hoverProp = ref(false);
</script>

<template>
  <section ref="container" class="featured" :class="`featured--${layoutType}`">
    <template
      v-if="
        layoutType === 'tomato' || layoutType === 'vegetable' || layoutType === 'fruit'
      "
    >
      <div class="top-section">
        <router-link
          :to="product.route"
          class="product-name-link"
          @mouseenter="hoverProp = true"
          @mouseleave="hoverProp = false"
        >
          <h2 ref="topTarget" class="product-name">
            <span v-html="product.name.large"></span>
            <span class="small-text" v-html="product.name.small"></span>
          </h2>
          <ChevronLink :routePath="product.route" :hoverProp="hoverProp" linkText="" />
        </router-link>
      </div>
      <div class="middle-section">
        <router-link
          :to="product.route"
          class="product-image-link"
          @mouseenter="hoverProp = true"
          @mouseleave="hoverProp = false"
        >
          <img
            ref="floatingImage"
            :src="getImageUrl(product.imageSrc)"
            class="product-image"
          />
        </router-link>
        <div class="text">
          <span
            v-for="(tag, index) in product.taglines"
            :key="index"
            ref="rightTarget"
            :class="['large', tag.class]"
            v-html="tag.text"
          ></span>
          <p v-html="product.description"></p>
          <span
            v-if="product.closingTagline"
            class="large"
            v-html="product.closingTagline"
          ></span>
        </div>
      </div>
      <div class="bottom-section">
        <p v-html="product.projectInfo"></p>
      </div>
    </template>

    <template v-if="layoutType === 'pasta'">
      <div class="middle-section">
        <router-link
          :to="product.route"
          class="product-image-link"
          @mouseenter="hoverProp = true"
          @mouseleave="hoverProp = false"
        >
          <img
            ref="floatingImage"
            :src="getImageUrl(product.imageSrc)"
            class="product-image"
          />
        </router-link>
        <div class="texts-container">
          <router-link
            :to="product.route"
            class="product-name-link"
            @mouseenter="hoverProp = true"
            @mouseleave="hoverProp = false"
          >
            <h2 ref="topTarget" class="product-name">
              <span v-html="product.name.large"></span>
              <span class="small-text" v-html="product.name.small"></span>
            </h2>
            <ChevronLink :routePath="product.route" :hoverProp="hoverProp" linkText="" />
          </router-link>
          <div ref="rightTarget" class="text">
            <span
              v-for="(tag, index) in product.taglines"
              :key="index"
              class="large"
              v-html="tag.text"
            ></span>
            <p v-html="product.description"></p>
            <span
              v-if="product.closingTagline"
              class="large"
              v-html="product.closingTagline"
            ></span>
          </div>
        </div>
      </div>
      <div class="bottom-section">
        <p v-html="product.projectInfo"></p>
      </div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
/* Base Styles (common to all layouts) */
.product-name-link,
.product-image-link {
  text-decoration: none;
  color: inherit;
  display: contents;
}

.featured {
  display: flex;
  flex-direction: column;
  width: 60%;
  margin: 0 auto;
  height: 100vh;
  justify-content: center;
  align-items: center;
  color: black;
  position: relative;

  .middle-section {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    width: 100%;
    position: relative;
    overflow: visible;

    .product-image {
      object-fit: contain;
      max-width: 100%;
      position: absolute;
      cursor: pointer;
    }

    .text {
      display: flex;
      flex-direction: column;
      row-gap: 12px;
      p {
        color: #000;
        font-family: "Raleway";
        font-weight: 400;
      }
      .large {
        color: #039ea2;
        font-family: "Century Gothic";
        font-weight: 400;
        display: flex;
        flex-direction: column;
        b {
          font-weight: 700;
        }
      }
    }
  }

  .top-section {
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 15px;
    position: relative;
    .product-name {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      font-family: "Century Gothic";
      font-weight: 700;
      color: #fff;
      .small-text {
        color: #fff;
        font-family: "Century Gothic";
        font-weight: 700;
      }
    }
  }

  .bottom-section p {
    color: #000;
    font-family: "Raleway";
    font-weight: 400;
  }
}

/* --- Layout Specific Overrides --- */

/* Tomato Layout */
.featured--tomato {
  .top-section {
    justify-content: flex-end;
    .product-name {
      width: 70%;
      margin-right: 25%;
      .large-text {
        // Specific class from original HTML
        font-size: clamp(2.2rem, 4.5vw, 5rem);
        letter-spacing: 6px;
        background: #ceebec;
        text-align: right;
      }
      .small-text {
        font-size: clamp(1.2rem, 2vw, 2.8rem);
        text-align: right;
      }
    }
  }
  .middle-section {
    justify-content: flex-end;
    .product-image {
      width: 28vw;
      top: 50%;
      transform: translateY(-50%);
    }
    .text {
      width: 60%;
      margin-right: 40px;
      .large {
        font-size: clamp(1.2rem, 2vw, 2.2rem);
        b {
          font-size: clamp(1.1rem, 1.7vw, 2.1rem);
        }
      }
      p {
        font-size: clamp(12px, 1.1vw, 1.05rem);
      }
    }
  }
  .bottom-section p {
    font-size: clamp(12px, 1.1vw, 1.05rem);
  }
}

/* Vegetable Layout */
.featured--vegetable {
  .top-section {
    justify-content: flex-start;
    .product-name {
      text-align: left;
      font-size: clamp(2.3rem, 4vw, 4.8rem);
      .small-text {
        text-align: left;
        font-size: clamp(1.2rem, 1.8vw, 2rem);
        margin-top: 12px;
      }
    }
  }
  .middle-section {
    justify-content: flex-start;
    .product-image {
      width: 28vw;
      bottom: -25px;
    }
    .text {
      width: 60%;
      .large {
        font-size: clamp(1.4rem, 2vw, 2.2rem);
        b {
          font-size: clamp(1.3rem, 1.9vw, 2.1rem);
        }
      }
      p {
        font-size: clamp(12px, 1.05vw, 1.05rem);
      }
    }
  }
  .bottom-section {
    justify-content: flex-start;
    width: 100%;
    p {
      font-size: clamp(12px, 1.05vw, 1.05rem);
    }
  }
}

/* Pasta Layout */
.featured--pasta {
  @media (max-width: 1366px) {
    width: 70%;
  }
  .middle-section {
    align-items: flex-end;
    height: 50vh;
    .product-image {
      height: 100%;
    }
    .texts-container {
      width: 70%;
    }
    .product-name-link {
      display: flex;
    }
    .product-name {
      text-align: left;
      font-size: clamp(1.2rem, 1.9vw, 2.4rem);
      letter-spacing: 5px;
      .small-text {
        font-size: clamp(2.4rem, 3.7vw, 4.8rem);
        text-align: left;
      }
    }
    .text {
      width: 100%;
      align-items: flex-start;
      .large {
        font-size: clamp(1.5rem, 2.5vw, 2.4rem);
        b {
          font-size: clamp(1.3rem, 2.1vw, 2.1rem);
        }
      }
      p {
        font-size: clamp(12px, 1.2vw, 1rem);
      }
    }
  }
  .bottom-section p {
    font-size: clamp(12px, 1vw, 1rem);
  }
}

/* Fruit Layout */
.featured--fruit {
  .top-section {
    justify-content: flex-start;
    .product-name {
      text-align: left;
      font-size: clamp(2.5rem, 5vw, 5.1rem);
      .small-text {
        text-align: right;
        font-size: clamp(1.05rem, 2.1vw, 2.1rem);
        margin-top: 10px;
      }
    }
  }
  .middle-section {
    justify-content: flex-start;
    .product-image {
      width: 25vw;
    }
    .text {
      width: 65%;
      .lt-1 {
        font-size: clamp(1.3rem, 1.9vw, 1.9rem);
        b {
          font-size: clamp(1.3rem, 1.9vw, 1.9rem);
        }
      }
      .lt-2 {
        font-size: clamp(1.7rem, 2.5vw, 2.5rem);
        b {
          font-size: clamp(1.8rem, 2.6vw, 2.6rem);
        }
        margin-bottom: 25px;
      }
      .no-break {
        display: inline;
      }
      p {
        font-size: clamp(0.9rem, 1.2vw, 1.1rem);
        margin-bottom: 30px;
      }
    }
  }
  .bottom-section {
    width: 100%;
    p {
      font-size: clamp(0.9rem, 1vw, 1.1rem);
    }
  }
}
</style>
