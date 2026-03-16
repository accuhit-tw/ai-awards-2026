<template>
  <div class="hint-wrapper">
    <transition-group name="fade">
      <div v-for="item of messageQueue" :key="item.uuid" class="message-hints">
        <img
            class="message-hints-icon"
            src="../assets/warning-filled.svg"
            alt="Messaging"
            srcset=""
        />
        <span class="message-hints-text">{{ item.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
defineProps({
  message: String
})
import { ref } from 'vue'

const messageQueue = ref([])
let timer = null

// Start the timer to remove the message
const startTimer = () => {
  timer = setTimeout(removeMessage, 1000)
}

// Remove message from the queue, and start the timer again if there are more messages
const removeMessage = () => {
  messageQueue.value.pop()
  if (messageQueue.value.length > 0) {
    startTimer()
  } else {
    timer = null
  }
}

// Add message to the queue, and start the timer if it's the first message
const addMessage = (msg) => {
  messageQueue.value.unshift({ message: msg, uuid: Date.now() + Math.floor(Math.random() * 1000) })
  if (!timer) {
    startTimer()
  }
}
defineExpose({
  addMessage
})
</script>

<style lang="scss" scoped>
.hint-wrapper {
  position: absolute;
  top: 13vh;
  width: 80%;
  margin: 0px 25px;
}
.message-hints {
  padding: 20px;
  background: #fff7e8;
  border: 1px solid #ff9700;
  border-radius: 4px;
  width: 100%;
  transition: opacity 0.5s;
  margin-bottom: 8px;

  .message-hints-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    position: relative;
    top: 3px;
  }

  .message-hints-text {
    color: #ff7d00;
    font-family: Noto Sans;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.14px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>