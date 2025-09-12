<script setup>
</script>

<template>
  <div class="skeleton-container">
    <div class="skeleton-left-panel">
      <div class="skeleton-block title"></div>
      <div class="skeleton-block line"></div>
      <div class="skeleton-block line short"></div>
      <div class="skeleton-block line medium"></div>
    </div>
    <div class="skeleton-right-panel">
      </div>

    <div class="skeleton-block arrow top-left"></div>
    <div class="skeleton-block arrow bottom-right"></div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton-block {
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}


.skeleton-block::before {
  content: "";
  position: absolute;
  top: 0;
  left: -150px;
  height: 100%;
  width: 150px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(100vw + 300px)); // applies to entire viewport + 300px for safety
  }
}

.skeleton-container {
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
  background-color: #f5f5f5;
}

.skeleton-left-panel,
.skeleton-right-panel {
  width: 50%;
  height: 100%;
  padding: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.skeleton-right-panel {
  background-color: #eeeeee;
}

.skeleton-block.title {
  width: 60%;
  height: 40px;
  margin-bottom: 24px;
}

.skeleton-block.line {
  width: 90%;
  height: 16px;
  margin-bottom: 12px;
}

.skeleton-block.line.short {
  width: 70%;
}
.skeleton-block.line.medium {
  width: 80%;
}

.skeleton-block.arrow {
  position: absolute;
  width: 150px;
  height: 40px;
  z-index: 2;
}

.skeleton-block.arrow.top-left {
  top: 20vh;
  left: 5%;
}

.skeleton-block.arrow.bottom-right {
  bottom: 5vh;
  right: 4vw;
}
</style>