<template>
  <div
    v-if="isVisible"
    class="fixed top-0 z-20 h-screen w-full bg-mask"
  >
    <div class="absolute left-1/2 top-1/2 w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-6 py-4">
      <h1 class="mb-5 text-lg font-semibold">{{ t('feedbackTitle') }}</h1>
      <div class="relative mb-6">
        <textarea
          :value="data.feedbackContent"
          class="h-[300px] w-full resize-none rounded-lg border p-4 focus:border-primary"
          maxlength="100"
          @input="handleInput($event)"
        ></textarea>
        <p class="absolute bottom-6 left-5 rounded-[30px] bg-chatBg px-2 py-0.5 text-xs text-disabled-300">{{ data.feedbackContent.length }} / 100</p>
      </div>
      <div class="text-right">
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
          {{ t('send') }}
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
const data = ref({
  feedbackContent: '',
  messageId: ''
})
const openDialog = ({ feedbackContent = '', messageId }) => {
  isVisible.value = true
  data.value = {
    feedbackContent,
    messageId
  }
}
const handleClose = () => {
  isVisible.value = false
  data.value.feedbackContent = ''
}
defineExpose({
  openDialog
})
const emit = defineEmits(['submit'])

const handleInput = (e) => {
  if (e.target.value.length === 101) return
  data.value.feedbackContent = e.target.value
}
const handleSubmit = () => {
  emit('submit', data.value)
  handleClose()
}
</script>

<style lang="scss" scoped>
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
