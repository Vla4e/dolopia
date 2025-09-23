<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import ChevronLink from "@/components/Routing/ChevronLink.vue";

import { useScreenSize } from "@/composables/useScreenSize";
const { isMobile, isTablet, isDesktop } = useScreenSize();

const props = defineProps({
  layoutType: { type: String, required: true }, // 'tomato' | 'pasta' | 'vegetable' | 'fruit'
  product: { type: Object, required: true },
});

let container = ref();
let floatingImageTarget = ref();
let hoverProp = ref(false);
let projectInfoTarget = ref();
let descriptionTarget = ref();
let productNameTarget = ref();
let fillerBlockTarget = ref();
let closingTaglineTarget = ref();

// Positioning logic for images in layout - transferred from original
const positioners = {
  tomato: async () => {
    return;
  },
  vegetable: async () => {
    return;
  },
  pasta: async () => {
    await nextTick();
    if (!container.value || !floatingImageTarget.value || !descriptionTarget.value) {
      return;
    }
    console.log(fillerBlockTarget.value.style.width);
    const descriptionRect = descriptionTarget.value.getBoundingClientRect();
    const productNameRect = productNameTarget.value.getBoundingClientRect();
    const imageRef = floatingImageTarget.value;
    let imageRect;

    //Set height of image to height of .texts + .product-name-link, manual adjustment of * 2 so that image goes out of container
    floatingImageTarget.value.style.height =
      productNameRect.height * 2 + descriptionRect.height + "px";
    floatingImageTarget.value.style.marginTop = -productNameRect.height + "px";
    await nextTick();

    if (imageRef.complete) {
      imageRect = imageRef.getBoundingClientRect();
    } else {
      // Wait for image to load
      imageRef.onload = () => {
        imageRect = imageRef.getBoundingClientRect();
        console.log("After load:", rect.width);
      };
    }
    //set filler block width so that justify-content: center aligns element the same "left" offset in top-section as they are in middle-section
    fillerBlockTarget.value.style.width = imageRect.width + "px";
  },
  fruit: async () => {
    return;
  },
};

onMounted(async () => {
  setTimeout(async () => {
    if(!isMobile.value){
      if (positioners[props.layoutType]) {
        await positioners[props.layoutType]();
      }
    }
  }, 1000);
});
</script>

<template>
  <div class="featured-product-container" ref="container" :class="layoutType">
    <section class="featured-product-section">
      <div class="top-section">
        <div
          v-if="layoutType === 'pasta' || layoutType === 'fruit'"
          ref="fillerBlockTarget"
          class="filler-block"
        />
        <router-link class="product-name-link" :to="product.route">
          <h2 class="product-name" ref="productNameTarget">
            <span v-html="product.name.large" class="large-text"></span>
            <span
              v-if="product.name.small"
              v-html="product.name.small"
              class="small-text"
            ></span>
          </h2>
          <ChevronLink
            v-if="!isMobile"
            :routePath="product.route"
            :hoverProp="hoverProp"
            linkText=""
          />
        </router-link>
      </div>

      <div class="middle-section">
        <router-link
          v-if="(layoutType === 'tomato' || layoutType === 'pasta') && !isMobile"
          :to="product.route"
          class="product-image-link"
          @mouseenter="hoverProp = true"
          @mouseleave="hoverProp = false"
        >
          <img
            ref="floatingImageTarget"
            :src="isMobile ? product.imageSrcMobile : product.imageSrc"
            class="product-image"
          />
        </router-link>
        <div class="text" ref="descriptionTarget">
          <span
            v-if="isMobile ? product.taglines.openingMobile : product.taglines.opening"
            class="large"
            :class="
              isMobile
                ? product.taglines.openingMobile?.class
                : product.taglines.opening?.class
            "
            v-html="
              isMobile
                ? product.taglines.openingMobile?.text
                : product.taglines.opening?.text
            "
          ></span>
          <p
            v-html="isMobile ? product.descriptionMobile : product.description"
            class="description"
          ></p>

          <router-link
            v-if="isMobile"
            :to="product.route"
            class="product-image-link"
            @mouseenter="hoverProp = true"
            @mouseleave="hoverProp = false"
          >
            <img
              ref="floatingImageTarget"
              :src="isMobile ? product.imageSrcMobile : product.imageSrc"
              class="product-image"
            />
          </router-link>
          <span
            v-if="isMobile ? product.taglines.closingMobile : product.taglines.closing"
            ref="closingTaglineTarget"
            class="large"
            :class="
              isMobile
                ? product.taglines.closingMobile?.class
                : product.taglines.closing?.class
            "
            v-html="
              isMobile
                ? product.taglines.closingMobile?.text
                : product.taglines.closing?.text
            "
          ></span>
        </div>
        <router-link
          v-if="(layoutType === 'vegetable' || layoutType === 'fruit') && !isMobile"
          :to="product.route"
          class="product-image-link"
          @mouseenter="hoverProp = true"
          @mouseleave="hoverProp = false"
        >
          <img
            ref="floatingImageTarget"
            :src="isMobile ? product.imageSrcMobile : product.imageSrc"
            class="product-image"
          />
        </router-link>
      </div>

      <div class="bottom-section" ref="projectInfoTarget">
        <p
          v-html="isMobile ? product.projectInfoMobile : product.projectInfo"
          class="project-information"
        ></p>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.featured-product-container {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: center;
  @media (max-width: 450px) {
    width: 80% !important;
  }
  @media(max-width: 360px){
    margin-bottom: 30px;
  }
  .featured-product-section {
    display: flex;
    flex-direction: column;
    width: 100%;

    .top-section {
      width: 100%;
    }

    .middle-section {
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        display: flex;
        flex-direction: column;
        @media (max-width: 450px) {
          width: 100%;
        }
      }
      .product-image-link {
        max-width: 40%;
        .product-image {
          // width: 100%
        }
        @media (max-width: 450px) {
          max-width: 100vw !important;
        }
      }
    }
    .bottom-section {
      width: 100%;
      @media (max-width: 450px) {
        justify-content: flex-start;
      }
    }
  }

  // Layout-specific skeletons
  &.tomato {
    .top-section {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      padding-right: 10%;
      @media (max-width: 450px) {
        padding-right: 0;
        justify-content: center;
      }
      .product-name-link {
        display: flex;
        justify-content: flex-start;
        @media (max-width: 3860px) and (min-width: 1600px) {
        }
        .product-name {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          //margin-right: 25%;
          cursor: pointer;
          @media (max-width: 450px) {
            align-items: center;
            margin-bottom: 25px;
            .large-text,
            .small-text {
              text-align: center !important;
              width: 100vw;
            }
          }
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
            font-size: clamp(1.6rem, 2vw, 2.8rem);
            line-height: 1;
            font-style: normal;
            font-weight: 700;
            letter-spacing: 0.9px;
          }
        }
        .chevron-link-container {
          margin-left: 15px;
        }
      }
    }
    .middle-section {
      display: flex;
      // align-items: flex-start;
      justify-content: center;
      width: 100%;
      margin-bottom: 30px;
      .product-image-link {
        display: flex;
        justify-content: center;
        .product-image {
          max-height: 100%;
          width: 80%;
          //width: auto;
          object-fit: contain;
          @media (max-width: 450px) {
            width: 110%;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        row-gap: 12px;
        position: relative;
        .large {
          // width: 60%;
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
          // width: 60%;
          color: #000;
          font-family: "Raleway";
          font-size: clamp(12px, 1.1vw, 1.05rem);
          line-height: 1.6;
          font-style: normal;
          font-weight: 400;
          position: relative;
        }

        @media (max-width: 450px) {
          .large {
            &.lt-1 {
              text-align: right;
              color: #039ea2;
              text-align: right;
              font-family: "Century Gothic";
              font-size: 24px;
              font-style: normal;
              font-weight: 400;
              line-height: 24px;
              letter-spacing: 0.48px;
              margin-bottom: 15px;
            }
            &.lt-2 {
              text-align: left;
              color: #039ea2;
              font-family: "Century Gothic";
              font-size: 32px;
              font-style: normal;
              font-weight: 400;
              line-height: 30px;
              margin-top: -30px;
            }
          }
          p {
            text-align: right;
            color: #000;
            text-align: right;
            font-family: Raleway;
            font-size: 11px;
            font-style: normal;
            font-weight: 400;
            line-height: 14px;
          }
        }
      }
    }
    .bottom-section {
      display: flex;
      justify-content: center;
      @media (max-width: 450px) {
        justify-content: flex-start;
      }
      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1.1vw, 1.05rem);
        line-height: 1.6;
        font-style: normal;
        font-weight: 400;
        @media (max-width: 450px) {
          color: #000;
          font-family: Raleway;
          font-size: 11px;
          font-style: normal;
          font-weight: 400;
          line-height: 14px;
        }
      }
    }
  }

  &.vegetable {
    .top-section {
      display: flex;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 30px;
      @media (max-width: 450px) {
        width: 100%;
        margin-bottom: 25px;
        justify-content: center;
      }
      .product-name-link {
        display: flex;
        .product-name {
          display: flex;
          flex-direction: column;
          .large-text {
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
          @media (max-width: 450px) {
            .large-text {
              color: #fff;
              text-align: center;
              font-family: "Century Gothic";
              font-size: 36px;
              font-style: normal;
              font-weight: 700;
              line-height: 1.1;
              letter-spacing: normal;
              width: 100vw;
            }
            .small-text {
              color: #fff;
              text-align: center;
              font-family: "Century Gothic";
              font-size: 36px;
              font-style: normal;
              font-weight: 700;
              line-height: 1.1;
              margin-top: 0px;
            }
          }
        }
        .chevron-link-container {
          margin-left: 15px;
        }
      }
    }
    .middle-section {
      width: 80%;
      margin-left: auto;
      margin-right: auto;
      justify-content: flex-start;
      @media (max-width: 450px) {
        width: 100%;
      }
      .product-image-link {
        display: flex;
        max-width: 40%;
        .product-image {
          width: 100%;
          height: auto;
          object-fit: contain;
        }
      }
      .text {
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

          b {
            color: #039ea2;
            font-family: "Century Gothic";
            font-size: clamp(1.3rem, 1.9vw, 2.1rem);
            line-height: 1.25;
            font-style: normal;
            font-weight: 700;
            letter-spacing: 0.8px;
          }
          @media (max-width: 450px) {
            color: #039ea2;
            font-family: "Century Gothic";
            font-size: 32px;
            font-style: normal;
            font-weight: 400;
            line-height: 32px;
          }
        }
        .lt-1 {
          @media (max-width: 450px) {
            margin-bottom: 20px;
          }
        }
        &.lt-2 {
          @media (max-width: 450px) {
            color: #039ea2;
            font-family: "Century Gothic";
            font-size: 34px !important;
            font-style: normal;
            font-weight: 400;
            line-height: 1.3;
            margin-top: -20px;
            display: flex;
            align-items: center;
            .small {
              color: #039ea2;
              text-align: right;
              font-family: "Century Gothic";
              font-size: 24px !important;
              font-style: normal;
              font-weight: 700;
              line-height: 1, 1;
            }
          }
          @media(max-width: 370px){
            font-size: 30px !important;
            .small{
              font-size: 20px !important;
            }
          }
        }

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
    .bottom-section {
      display: flex;
      justify-content: flex-start;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
      margin-top: 30px;
      @media (max-width: 450px) {
        width: 100%;
        margin-top: 15px;
        justify-content: center;
      }
      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1.05vw, 1.05rem);
        line-height: 1.6;
        font-style: normal;
        font-weight: 400;
        @media (max-width: 450px) {
          text-align: right;
        }
      }
    }
  }

  &.pasta {
    .top-section {
      display: flex;
      justify-content: center;
      margin-bottom: -30px;
      @media (max-width: 450px) {
        margin-bottom: 15px;
        align-items: center;
      }
      .filler-block {
        display: flex;
        @media (max-width: 450px) {
          display: none;
        }
      }
      .product-name-link {
        display: flex;
        width: 40%;
        @media (max-width: 450px) {
          width: 100%;
          justify-content: center;
        }
        .chevron-link-container {
          margin-left: 15px;
        }
        .product-name {
          display: flex;
          flex-direction: column;
          .large-text {
            color: #fff;
            text-align: left;
            font-family: "Century Gothic";
            font-size: clamp(1.2rem, 1.9vw, 2.4rem);
            line-height: clamp(1.2rem, 1.9vw, 2.4rem);
            font-style: normal;
            font-weight: 700;
            letter-spacing: 5px;
            @media(max-width: 360px){
              font-size: 30px !important;
            }
          }

          .small-text {
            color: #fff;
            text-align: left;
            font-family: "Century Gothic";
            font-size: clamp(2.4rem, 3.7vw, 4.8rem);
            line-height: clamp(2.4rem, 3.7vw, 4.8rem);
            font-style: normal;
            font-weight: 700;
            @media(max-width: 360px){
              font-size: 34px !important;
            }
          }

          @media (min-width: 1400px) and (max-height: 800px) {
            font-size: clamp(0.9rem, 1vw, 1.8rem);
            line-height: clamp(0.9rem, 1vw, 1.8rem);
            letter-spacing: 4px;
            .small-text {
              font-size: clamp(1.8rem, 2.5vw, 3.6rem);
              line-height: clamp(1.8rem, 2.5vw, 3.6rem);
            }
          }
          @media (max-width: 450px) {
            align-items: center;
            .large-text {
              color: #fff;
              text-align: center;
              font-family: "Century Gothic";
              font-size: 29px;
              font-style: normal;
              font-weight: 700;
              line-height: 1.1;
              text-align: center;
            }
            .small-text {
              color: #fff;
              text-align: center;
              font-family: "Century Gothic";
              font-size: 40px;
              font-style: normal;
              font-weight: 700;
              line-height: 1.1;
              letter-spacing: 2px;
              text-align: center;
            }
          }
        }
      }
    }

    .middle-section {
      @media (max-width: 450px) {
        width: 100%;
      }
      // align-items: stretch !important;
      .product-image-link {
        // max-width: 40%;
        // flex: 1;
        @media (max-width: 370px){
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }
        .product-image {
          // width: 100%;
          // object-fit: contain;
          @media (max-width: 450px) {
            width: 100%;
          }
          @media (max-width: 370px){
            width: 90%;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
        width: 40%;
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

          @media (min-width: 1400px) and (max-height: 800px) {
            font-size: clamp(1rem, 1.8vw, 1.6rem);
            line-height: clamp(1rem, 1.8vw, 1.6rem);
            b {
              font-size: clamp(0.9rem, 1.5vw, 1.5rem);
              line-height: clamp(0.9rem, 1.5vw, 1.5rem);
            }
          }

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

          @media (min-width: 1400px) and (max-height: 800px) {
            font-size: clamp(10px, 0.9vw, 0.7rem);
            line-height: clamp(14px, 1.2vw, 0.9rem);
          }
        }

        @media (max-width: 450px) {
          width: 100%;
          align-items: center;
          row-gap: 0px;
          .lt-1 {
            color: #039ea2;
            text-align: center;
            font-family: "Century Gothic";
            font-size: 24px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            letter-spacing: 0.48px;
            margin-bottom: 10px;
          }
          .lt-2 {
            color: #039ea2;
            font-family: "Century Gothic";
            font-size: 28px;
            font-style: normal;
            font-weight: 400;
            line-height: 30px;
            text-align: left;
            align-self: flex-start;
            margin-top: -150px;
            margin-bottom: 10px;
          }
          p {
            text-align: center;
          }
        }
      }
    }

    .bottom-section {
      display: flex;
      justify-content: center;
      @media (max-width: 450px) {
        justify-content: flex-start;
      }
      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(12px, 1vw, 1rem);
        line-height: clamp(18px, 1.5vw, 1.4rem);
        font-style: normal;
        font-weight: 400;

        @media (min-width: 1400px) and (max-height: 800px) {
          font-size: clamp(10px, 0.8vw, 0.7rem);
          line-height: clamp(14px, 1.2vw, 0.9rem);
        }
      }
    }
  }

  &.fruit {
    .top-section {
      display: flex;
      padding-left: 20%;
      margin-bottom: 30px;
      @media (max-width: 450px) {
        padding-left: 0px;
        margin-bottom: 15px;
      }
      .product-name-link {
        display: flex;
        align-items: center;
        .product-name {
          display: flex;
          flex-direction: column;
          .large-text {
            color: #fff;
            text-align: left;
            font-family: "Century Gothic";
            font-size: clamp(2.5rem, 5.5vw, 5.1rem);
            line-height: 1.1;
            font-style: normal;
            font-weight: 700;
            letter-spacing: 5px;
            @media (max-width: 450px) {
              color: #fff;
              text-align: center;
              font-family: "Century Gothic";
              font-size: 55px;
              font-style: normal;
              font-weight: 700;
              line-height: 1.1;
            }
            @media(max-width: 360px){
              font-size: 45px;
            }
          }
          .small-text {
            color: #fff;
            text-align: right;
            font-family: "Century Gothic";
            font-size: clamp(1.05rem, 2.1vw, 2.1rem);
            line-height: 1;
            font-style: normal;
            font-weight: 700;
            margin-top: 10px;
            @media (max-width: 450px) {
              color: #fff;
              text-align: center;
              font-family: "Century Gothic";
              font-size: 22px;
              font-style: normal;
              font-weight: 700;
              line-height: 1.1;
              margin-top: 0px;
            }
          }
        }

        @media (min-width: 1400px) and (max-height: 800px) {
          .large-text {
            font-size: clamp(1.8rem, 3.5vw, 3.6rem);
          }
          line-height: 1.1;
          .small-text {
            font-size: clamp(0.9rem, 1vw, 1.5rem);
          }
        }
      }
    }
    .middle-section {
      justify-content: flex-start;
      padding-left: 20%;
      @media (max-width: 450px) {
        padding-left: 0px;
      }
      .product-image-link {
        display: flex;
        margin-left: -5%;
        .product-image {
          width: 80%;
        }
        @media(max-width: 450px){
          margin-left: 0px;
          justify-content: center;
          .product-image{
            width: 100%;
          }
        }
      }
      .text {
        .large {
          color: #039ea2;
          font-family: "Century Gothic";
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0.9px;
          display: flex;
          flex-direction: column;

          b {
            font-weight: 700;
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
            margin-bottom: 25px;

            b {
              font-size: clamp(1.8rem, 2.6vw, 2.6rem);
            }
          }

          &.no-break {
            display: inline;
          }

          @media (min-width: 1400px) and (max-height: 800px) {
            &.lt-1 {
              font-size: clamp(1.1rem, 1.6vw, 1.6rem);
            }
            &.lt-2 {
              font-size: clamp(1.4rem, 2.1vw, 2.1rem);
            }
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

          @media (min-width: 1400px) and (max-height: 800px) {
            font-size: clamp(0.7rem, 1vw, 0.9rem);
            margin-bottom: 25px;
          }

          @media (max-width: 1366px) {
            font-size: 12px;
            margin-bottom: 20px;
          }
        }

        @media (max-width: 450px) {
          .large.lt-1 {
            color: #039ea2;
            text-align: center;
            font-family: "Century Gothic";
            font-size: 32px;
            font-style: normal;
            font-weight: 400;
            line-height: 1.1;
            margin-bottom: 15px;
          }

          .large.lt-2 {
            color: #039ea2;
            text-align: right;
            font-family: "Century Gothic";
            font-size: 34px;
            font-style: normal;
            font-weight: 400;
            line-height: 1.1;
            margin-bottom: 15px;
            margin-top: -50px;
            .small {
              color: #039ea2;
              text-align: right;
              font-family: "Century Gothic";
              font-size: 32px;
              font-style: normal;
              font-weight: 700;
              line-height: 28px;
              margin-top: 0px;
            }
          }

          p {
            font-size: 12px;
            margin-bottom: 20px;
            text-align: center;
          }
        }
      }
    }
    .bottom-section {
      display: flex;
      padding-left: 20%;
      @media (min-width: 1400px) and (max-height: 800px) {
        margin-top: -15px;
      }

      @media (max-width: 450px) {
        padding-left: 0px;
        justify-content: flex-end;
      }
      p {
        color: #000;
        font-family: "Raleway";
        font-size: clamp(0.9rem, 1vw, 1.1rem);
        line-height: 1.6;
        @media (min-width: 1400px) and (max-height: 800px) {
          font-size: clamp(0.7rem, 0.8vw, 0.8rem);
        }
        @media (max-width: 1366px) {
          font-size: 12px;
        }
        font-style: normal;
        font-weight: 400;
        @media(max-width: 450px){
          text-align: right;
        }
      }
    }
  }
}
</style>
