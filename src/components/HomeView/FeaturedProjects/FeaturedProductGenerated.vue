<script setup>
import { nextTick, onMounted, ref } from 'vue';
import ChevronLink from '@/components/Routing/ChevronLink.vue';
import { goToRoute } from '@/helpers/goToRoute';

const props = defineProps({
  layoutType: { type: String, required: true }, // 'tomato' | 'pasta' | 'vegetable' | 'fruit'
  product: { type: Object, required: true }
});

let container = ref();
let floatingImage = ref();
let hoverProp = ref(false);
let projectInfoTarget = ref();
let descriptionTarget = ref();
let tagline1Target = ref();

// Positioning logic for images in layout
const positioners = {
  tomato: async () => {
    await nextTick();
    if (!container.value || !floatingImage.value || !projectInfoTarget.value || !descriptionTarget.value) return;
    const containerRect = container.value.getBoundingClientRect();
    const descriptionRect = descriptionTarget.value.getBoundingClientRect();
    const imageRect = floatingImage.value.getBoundingClientRect();
    // Align image bottom with projectInfo top
    const bottomOffset = imageRect.height * 0.10;
    floatingImage.value.style.bottom = -bottomOffset + 'px';
    // Align image right edge to description left edge (relative to container)
    const leftOffset = descriptionRect.left - containerRect.left - imageRect.width;
    floatingImage.value.style.left = leftOffset + 'px';
    floatingImage.value.style.right = '';
  },
  vegetable: async () => {
    await nextTick();
    if (!container.value || !floatingImage.value || !projectInfoTarget.value || !tagline1Target.value) return;
    const projectInfoRect = projectInfoTarget.value.getBoundingClientRect();
    const descriptionRect = descriptionTarget.value.getBoundingClientRect();
    const tagline1Rect = tagline1Target.value.getBoundingClientRect();
    const imageRect = floatingImage.value.getBoundingClientRect();
    // Align image bottom with projectInfo top
    const bottomOffset = imageRect.height * 0.1;
    floatingImage.value.style.bottom = -bottomOffset + 'px';
    // Align image left with tagline[1] right
    const leftOffset = descriptionRect.width - imageRect.width * 0.10;
    floatingImage.value.style.left = leftOffset + 'px';
    floatingImage.value.style.right = '';
  },
  pasta: async () => {
    await nextTick();
    if (!container.value || !floatingImage.value || !projectInfoTarget.value || !descriptionTarget.value) return;
    const projectInfoRect = projectInfoTarget.value.getBoundingClientRect();
    const descriptionRect = descriptionTarget.value.getBoundingClientRect();
    const imageRect = floatingImage.value.getBoundingClientRect();
    // Align image bottom with projectInfo top
    const bottomOffset = window.scrollY + projectInfoRect.top - (window.scrollY + imageRect.top + imageRect.height);
    floatingImage.value.style.bottom = bottomOffset + 'px';
    // Align image right with description left
    const rightOffset = window.innerWidth - descriptionRect.left - imageRect.width;
    floatingImage.value.style.right = rightOffset + 'px';
    floatingImage.value.style.left = '';
  },
  fruit: async () => {
    await nextTick();
    if (!container.value || !floatingImage.value || !projectInfoTarget.value || !tagline1Target.value) return;
    const projectInfoRect = projectInfoTarget.value.getBoundingClientRect();
    const descriptionRect = descriptionTarget.value.getBoundingClientRect();
    const tagline1Rect = tagline1Target.value.getBoundingClientRect();
    const imageRect = floatingImage.value.getBoundingClientRect();
    // Align image bottom with projectInfo top
    // const bottomOffset = window.scrollY + projectInfoRect.top - (window.scrollY + imageRect.top + imageRect.height);
    const bottomOffset = imageRect.height*0.10; // bottom = 0 already aligns image bottom with projectInfo top, we need more space for whitespace between image and projectInfo, thus *10%
    floatingImage.value.style.bottom = -bottomOffset + 'px';
    // Align image left with tagline[1] right
    const leftOffset = descriptionRect.width - imageRect.width * 0.10; // 10% * image.width = accomodate for whitespace left of actual image jar
    floatingImage.value.style.left = leftOffset + 'px';
    floatingImage.value.style.right = '';
  }
};

onMounted(async () => {
  setTimeout(async () => {
    if (positioners[props.layoutType]) {
      await positioners[props.layoutType]();
    }
  }, 500);
});
</script>

<template>
  <section ref="container" class="featured" :class="layoutType">
    <div class="top-section" :class="layoutType">
      <router-link
        v-if="layoutType !== 'pasta' && layoutType !== 'tomato'"
        :to="product.route"
        class="product-name-link"
        @mouseenter="hoverProp = true"
        @mouseleave="hoverProp = false"
      >
        <h2 class="product-name">
          <span v-html="product.name.large" class="large-text"></span>
          <span v-if="product.name.small" v-html="product.name.small" class="small-text"></span>
        </h2>
        <ChevronLink :routePath="'/catalog'" :hoverProp="hoverProp" linkText="" />
      </router-link>
    </div>

    <div class="middle-section" :class="layoutType">
      <router-link
        :to="product.route"
        class="product-image-link"
        @mouseenter="hoverProp = true"
        @mouseleave="hoverProp = false"
      >
        <img
          ref="floatingImage"
          :src="product.imageSrc"
          class="product-image"
        />
      </router-link>

      <div class="text">
        <template v-if="layoutType === 'fruit' || layoutType === 'vegetable'">
          <span
            v-if="product.taglines[0]"
            class="large"
            :class="product.taglines[0].class"
            v-html="product.taglines[0].text"
          ></span>
          <p ref="descriptionTarget" v-html="product.description"></p>
          <span
            v-if="product.taglines[1]"
            ref="tagline1Target"
            class="large"
            :class="product.taglines[1].class"
            v-html="product.taglines[1].text"
          ></span>
          <span v-if="product.closingTagline" class="large" v-html="product.closingTagline"></span>
        </template>
        <template v-else>
          <!-- <div class="wrapper"> -->
            <router-link
              v-if="layoutType === 'pasta' || layoutType ==='tomato'"
              :to="product.route"
              class="product-name-link"
              @mouseenter="hoverProp = true"
              @mouseleave="hoverProp = false"
            >
              <h2 class="product-name">
                <span v-html="product.name.large" class="large-text"></span>
                <span v-if="product.name.small" v-html="product.name.small" class="small-text"></span>
              </h2>
              <ChevronLink :routePath="'/catalog'" :hoverProp="hoverProp" linkText="" />
            </router-link>

            <template v-for="(tagline, idx) in product.taglines" :key="idx">
              <span
                class="large"
                :class="tagline.class"
                v-html="tagline.text"
              ></span>
            </template>
            <p ref="descriptionTarget" v-html="product.description"></p>
            <span v-if="product.closingTagline" class="large" v-html="product.closingTagline"></span>
          <!-- </div> -->
        </template>
      </div>
    </div>

    <div class="bottom-section" ref="projectInfoTarget">
      <p v-html="product.projectInfo"></p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.product-name-link {
  text-decoration: none;
  color: inherit;
  display: contents;
  .chevron-link-container{
    margin-left: 15px;
  }
}
.product-image-link{
  text-decoration: none;
  color: inherit;
  display: contents;
  .product-image{
    max-width: 600px !important;
  }
}

.featured {
  display: flex;
  flex-direction: column;
  min-width: 40%;
  @media(min-width: 1600px) and (max-width: 1980px){
    min-width: 60%;
  }
  height: 100vh;
  justify-content: center;
  align-items: center;
  color: black;
  position: relative;

  // Tomato styles
  &.tomato {
    .top-section {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 15px;
      position: relative;
    }
    .middle-section {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      margin-bottom: 20px;
      width: 100%;
      position: relative;
      overflow: visible;
      .product-image {
        width: 28vw;
        object-fit: contain;
        max-width: 100%;
        position: absolute;
        cursor: pointer;
      }

      .wrapper{
        display: flex;
        flex-direction: column;
        width: 60%;
      }
      .text {
        display: flex;
        flex-direction: column;
        align-items: flex-end ;
        row-gap: 12px;
        margin-right: 40px;
        width: 100%;
        position: relative;
        .product-name-link{
          width: 65%;
          display: flex;
          justify-content: flex-start;
          .product-name {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            //margin-right: 25%;
            cursor: pointer;
            .large-text {
              color: #fff;
              font-family: "Century Gothic";
              font-weight: 700;
              line-height: 1.1;
              font-style: normal;
              letter-spacing: 6px;
              text-align: right;
              background: none;
              font-size: clamp(2.3rem, 4vw, 4.8rem);
            }
            .small-text {
              color: #fff;
              text-align: right;
              font-family: "Century Gothic";
              font-size: clamp(1.2rem, 2vw, 2.8rem);
              line-height: 1;
              font-style: normal;
              font-weight: 700;
              letter-spacing: 0.9px;
            }
          }
        }
        .large {
          width: 60%;
          color: #039ea2;
          font-family: "Century Gothic";
          font-size: clamp(1.2rem, 2vw, 2.2rem);
          line-height: 1.2;
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0.9px;
          display: flex;
          flex-direction: column;
          b {
            color: #039ea2;
            font-family: "Century Gothic";
            font-size: clamp(1.1rem, 1.7vw, 2.1rem);
            line-height: 1.2;
            font-style: normal;
            font-weight: 700;
            letter-spacing: 0.8px;
          }
        }
        p {
          width: 60%;
          color: #000;
          font-family: "Raleway";
          font-size: clamp(12px, 1.1vw, 1.05rem);
          line-height: 1.6;
          font-style: normal;
          font-weight: 400;
          position: relative;
        }
      }
    }
    .bottom-section {
      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1.1vw, 1.05rem);
        line-height: 1.6;
        font-style: normal;
        font-weight: 400;
      }
    }
  }

  // Pasta styles
  &.pasta {
    @media (max-width: 1366px) {
      width: 70%;
    }
    .middle-section {
      display: flex;
      align-items: flex-end;
      margin-bottom: 20px;
      width: 100%;
      height: 50vh;
      position: relative;
      overflow: visible;
      .texts-container {
        width: 70%;
      }
      .product-image {
        object-fit: contain;
        max-width: 100%;
      }

      .product-name-link{
        display: flex;
        .product-name {
          display: flex;
          flex-direction: column;
          width: fit-content;
          .large-text{
            color: #fff;
            text-align: left;
            font-family: "Century Gothic";
            font-size: clamp(1.2rem, 1.9vw, 2.4rem);
            line-height: clamp(1.2rem, 1.9vw, 2.4rem);
            font-style: normal;
            font-weight: 700;
            letter-spacing: 5px;
          }
          width: 100%;
          .small-text {
            color: #fff;
            text-align: left;
            font-family: "Century Gothic";
            font-size: clamp(2.4rem, 3.7vw, 4.8rem);
            line-height: clamp(2.4rem, 3.7vw, 4.8rem);
            font-style: normal;
            font-weight: 700;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        width: 100%;
        align-items: flex-start;
        .large {
          color: #039ea2;
          font-family: "Century Gothic";
          font-size: clamp(1.5rem, 2.5vw, 2.4rem);
          line-height: clamp(1.5rem, 2.5vw, 2.4rem);
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0.9px;
          display: flex;
          flex-direction: column;
          b {
            color: #039ea2;
            font-family: "Century Gothic";
            font-size: clamp(1.3rem, 2.1vw, 2.1rem);
            line-height: clamp(1.3rem, 2.1vw, 2.1rem);
            font-style: normal;
            font-weight: 700;
            letter-spacing: 0.8px;
          }
        }
        p {
          color: #000;
          font-family: "Raleway";
          font-size: clamp(12px, 1.2vw, 1rem);
          line-height: clamp(18px, 1.8vw, 1.4rem);
          font-style: normal;
          font-weight: 400;
        }
      }
    }
    .bottom-section {
      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1vw, 1rem);
        line-height: clamp(18px, 1.5vw, 1.4rem);
        font-style: normal;
        font-weight: 400;
      }
    }
  }

  // Vegetable styles
  &.vegetable {
    .top-section {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 15px;
      position: relative;
      .product-name {
        display: flex;
        flex-direction: column;
        .large-text{
          color: #fff;
          text-align: left;
          font-family: "Century Gothic";
          font-size: clamp(2.3rem, 4vw, 4.8rem);
          line-height: 1.1;
          font-style: normal;
          font-weight: 700;
          letter-spacing: 6px;
        }
        cursor: pointer;
        .small-text {
          color: #fff;
          text-align: left;
          font-family: "Century Gothic";
          font-size: clamp(1.2rem, 1.8vw, 2rem);
          line-height: 1.1;
          font-style: normal;
          font-weight: 700;
          margin-top: 12px;
        }
      }
    }
    .middle-section {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: clamp(15px, 2vh, 30px);
      width: 100%;
      position: relative;
      overflow: visible;
      .product-image {
        width: 28vw;
        object-fit: contain;
        max-width: 100%;
        position: absolute;
        bottom: -25px;
        cursor: pointer;
      }
      .text {
        display: flex;
        flex-direction: column;
        row-gap: 12px;
        width: 60%;
        .large {
          color: #039ea2;
          font-family: "Century Gothic";
          font-size: clamp(1.4rem, 2vw, 2.2rem);
          line-height: 1.25;
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0.9px;
          display: flex;
          flex-direction: column;
          width: fit-content;
          b {
            color: #039ea2;
            font-family: "Century Gothic";
            font-size: clamp(1.3rem, 1.9vw, 2.1rem);
            line-height: 1.25;
            font-style: normal;
            font-weight: 700;
            letter-spacing: 0.8px;
          }
        }
        p {
          color: #000;
          font-family: "Raleway";
          font-size: clamp(12px, 1.05vw, 1.05rem);
          line-height: 1.6;
          font-style: normal;
          font-weight: 400;
          width: fit-content;
        }
      }
    }
    .bottom-section {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1.05vw, 1.05rem);
        line-height: 1.6;
        font-style: normal;
        font-weight: 400;
      }
    }
  }

  // Fruit styles
  &.fruit {
    .top-section {
      display: flex;
      width: 100%;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 15px;
      position: relative;
      .product-name {
        display: flex;
        flex-direction: column;
        .large-text{
          color: #fff;
          text-align: left;
          font-family: "Century Gothic";
          font-size: clamp(2.5rem, 5vw, 5.1rem);
          line-height: 1.1;
          font-style: normal;
          font-weight: 700;
          letter-spacing: 5px;
        }
        .small-text {
          color: #fff;
          text-align: left;
          font-family: "Century Gothic";
          font-size: clamp(1.05rem, 2.1vw, 2.1rem);
          line-height: 1;
          font-style: normal;
          font-weight: 700;
          margin-top: 10px;
        }
      }
    }
    .middle-section {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 20px;
      width: 100%;
      position: relative;
      overflow: visible;
      .product-image {
        width: 25vw;
        object-fit: contain;
        max-width: 100%;
        position: absolute;
      }
      .text {
        display: flex;
        flex-direction: column;
        row-gap: 12px;
        width: 65%;
        .large {
          color: #039ea2;
          font-family: "Century Gothic";
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0.9px;
          display: flex;
          flex-direction: column;
          width: fit-content;
          b {
            font-size: clamp(1.3rem, 1.9vw, 2.1rem);
            line-height: 1.25;
            font-style: normal;
            font-weight: 700;
            letter-spacing: 0.8px;
          }
          &.lt-1 {
            font-size: clamp(1.3rem, 1.9vw, 1.9rem);
            line-height: 1.25;
            b {
              font-size: clamp(1.3rem, 1.9vw, 1.9rem);
            }
          }
          &.lt-2 {
            font-size: clamp(1.7rem, 2.5vw, 2.5rem);
            line-height: 1.1;
            b {
              font-size: clamp(1.8rem, 2.6vw, 2.6rem);
            }
            margin-bottom: 25px;
          }
          &.no-break {
            display: inline;
          }
        }
        p {
          color: #000;
          font-family: "Raleway";
          font-size: clamp(0.9rem, 1.2vw, 1.1rem);
          line-height: 1.6;
          font-style: normal;
          font-weight: 400;
          margin-bottom: 30px;
          width: fit-content;
        }
      }
    }
    .bottom-section {
      width: 100%;
      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(0.9rem, 1vw, 1.1rem);
        line-height: 1.6;
        font-style: normal;
        font-weight: 400;
      }
    }
  }
}
</style> 