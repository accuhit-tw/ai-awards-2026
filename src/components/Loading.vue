<template>
  <div class="flex justify-center">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@keyframes wave {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }

  0% {
    opacity: 0;
  }
}
.dot {
  width: 12px;
  height: 12px;
  background-color: #c9cdd4;
  border-radius: 50%;
  margin: 0 4px;
  animation: wave 0.9s infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.3s;
}
.dot:nth-child(3) {
  animation-delay: 0.6s;
}
</style>
