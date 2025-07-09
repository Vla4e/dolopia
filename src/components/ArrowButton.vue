<template>
  <router-link :to="routePath" class="arrow-button">
    <Dropdown v-if="showDropdown" @selectionChange="switchText" />
    <span v-if="buttonText !== ''" class="text">{{ buttonText }}</span>
    <img
      v-show="showArrow"
      :class="arrowDirection"
      src="@/assets/button-arrow.png"
      class="arrow"
    />
  </router-link>
</template>

<script setup>
import Dropdown from "./Dropdown/Dropdown.vue";
import { onMounted, ref } from "vue";
import { goToRoute } from "@/helpers/goToRoute";

let buttonText = ref("");
const switchText = (selected) => {
  // console.log("selected", selected);
  buttonText.value = selected;
};

const props = defineProps({
  buttonText: {
    type: String,
    required: false,
    default: "",
  },
  routePath: {
    type: String,
    required: true,
  },
  showArrow: {
    type: Boolean,
    required: false,
    default: true,
  },
  showDropdown: {
    type: Boolean,
    required: false,
    default: true,
  },
  arrowDirection: {
    type: String,
    required: false,
    default: "right",
  },
});

// import router from "@/router";
// // function goToRoute(routePath) {
// //   // console.log("Trying to go to", routePath);
// //   if (routePath === "/home") {
// //     router.replace({ path: "/" }).catch((e) => {
// //       // console.log("Navigation error:", e);
// //       console.error(e);
// //     });
// //   } else {
// //     router.push(routePath).catch((e) => {
// //       // console.log("ERROR?", e);
// //       console.error(e);
// //     });
// //   }
// // }

onMounted(() => {
  // console.log("PROPS:", props.buttonText);
  buttonText.value = props.buttonText;
});
</script>

<style lang="scss" scoped>
.arrow-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
    transition: transform 0.2s ease-in-out;
    &:hover {
      transform: translateX(5px);
      .arrow{
      transform: translateX(5px);
      }
    }
  .text {
    font-size: 20px;
    color: black;
    margin-left: 5px;
    margin-right: 10px;
    min-width: 40%;
    text-align: center;
  }
  .arrow {
    // align-self: flex-end;
    // max-width: 50%;
    max-width: 80px;
    margin-top: 5px;
    cursor: pointer;
    transition: transform 0.2s ease-out;
    &.left {
      transform: rotate(180deg);
      &:hover {
        transform: rotate(180deg) scale(110%);
      }
    }
  }
}
</style>
