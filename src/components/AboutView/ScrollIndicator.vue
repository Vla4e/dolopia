<template>
  <div :class="phaseId >= disappearAtPhaseId ? 'scrolled' : ''" class="scroll-indicator">
    <span>Scroll down to continue</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#131313"
      class="bi bi-chevron-down chevron"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
      />
    </svg>
  </div>
</template>

<script setup>

const props = defineProps({
  disappearAtPhaseId: {
    type: Number,
    required: false,
    default: 1
  },
  phaseId: {
    type: Number,
    required: false,
    default: 0
  }
})

</script>

<style lang="scss" scoped>
.scroll-indicator {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: "Kugile";
  z-index: 10;
  cursor: pointer;
  .chevron {
    width: 20px;
    height: 20px;
    stroke: white;
    margin-top: 10px;
    animation: bounce 1.5s infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  transition: all 0.5s ease;
  &.scrolled{
    opacity: 0;
    // transform: scale(1.1);
    letter-spacing: 4px;
  }
}
</style>