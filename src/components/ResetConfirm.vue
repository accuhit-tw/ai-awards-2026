<template>
  <div
    v-if="isVisible"
    class="dialog"
  >
    <div class="dialog-wrapper">
      <h1 class="wrapper-title">{{ t('restartConversation') }}</h1>
      <div class="wrapper-content">
        <p>{{ t('confirmTitle') }}</p>
        <p>{{ t('confirmDesc') }}</p>
      </div>
      <div class="wrapper-footer">
        <button
          class="wrapper-button wrapper-button--cancel"
          @click="handleClose"
        >
          {{ t('cancel') }}
        </button>
        <button
          class="wrapper-button wrapper-button--submit"
          @click="handleSubmit"
        >
          {{ t('confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const isVisible = ref(false)
const openDialog = () => {
  isVisible.value = true
}
const handleClose = () => {
  isVisible.value = false
}
defineExpose({
  openDialog
})
const emit = defineEmits(['confirm'])
const handleSubmit = () => {
  emit('confirm')
  handleClose()
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.dialog {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: #093b8766;
  z-index: 20;
  top: 0;
}
.dialog-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 380px;
  background: white;
  border-radius: 8px;
  padding: 16px 24px;
}

.wrapper-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.wrapper-content {
  position: relative;
  color: #86909c;
  margin-bottom: 16px;
  p {
    margin: 4px 0px;
  }
}

.wrapper-footer {
  text-align: right;
}
.wrapper-button {
  padding: 12px 40px;
  border: 1px solid #0f5ad6;
  border-radius: 8px;
  cursor: pointer;
  &--submit {
    background: #0f5ad6;
    color: white;
  }
  &--cancel {
    margin-right: 1rem;
    background: white;
    color: #0f5ad6;
  }
}
</style>
