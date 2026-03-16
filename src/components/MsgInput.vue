<template>
  <div
    ref="inputWrapper"
    class="flex"
  >
    <textarea
      v-model="content"
      ref="textareaEl"
      class="mr-4 max-h-[90px] min-h-[42px] grow resize-none overflow-y-auto rounded-xl px-4 py-2 text-black shadow-[0_0_0_1px] shadow-transparent outline-none hover:shadow-disabled-100 focus:shadow-primary disabled:bg-disabled-50 disabled:shadow-transparent"
      rows="1"
      :placeholder="computePlaceholder"
      :disabled="isSendMessageLoading || isMessageUsageOverLimit"
      @input="resizeTextarea"
      @paste="resizeTextarea"
      @cut="resizeTextarea"
      @compositionstart="setComposition(true)"
      @compositionend="setComposition(false)"
      @keydown.enter.prevent="sendMessage"
    />

    <button
      v-if="!showStopBtn"
      :disabled="isSendMessageLoading"
      :class="[content.length > 0 ? 'text-primary' : 'text-disabled-200']"
      class="self-end rounded-xl bg-white p-2"
      @click="sendMessage"
    >
      <IconRefresh
        v-if="isMessageUsageOverLimit"
        class=""
      />
      <IconSend
        v-else
        class=""
      />
    </button>
    <button
      v-else
      class="self-end rounded-xl border border-primary bg-white p-2 text-primary"
      :disabled="isStopProcessLoading"
      @click="stopProcess"
    >
      <div class="m-1 h-4 w-4 rounded-sm bg-primary"></div>
    </button>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import IconSend from '@/components/icon/IconSend.vue'
import { useI18n } from 'vue-i18n'
import IconRefresh from './icon/IconRefresh.vue'
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
  isStopProcessLoading: { type: Boolean, default: false },
  isSendMessageLoading: { type: Boolean, default: false },
  isMessageUsageOverLimit: { type: Boolean, default: false },
  showStopBtn: { type: Boolean, default: false }
})
const emit = defineEmits(['send-message', 'stop-process'])
const textareaEl = ref()
const resizeTextarea = () => {
  textareaEl.value.style.height = '0px'
  if (textareaEl.value.scrollHeight > 90) {
    textareaEl.value.style.height = '90px'
  } else if (textareaEl.value.scrollHeight < 42) {
    textareaEl.value.style.height = '42px'
  } else {
    textareaEl.value.style.height = `${textareaEl.value.scrollHeight}px`
  }
}

const computePlaceholder = computed(() => {
  if (props.isMessageUsageOverLimit) {
    return t('messageUsageOverLimit')
  }
  return props.isSendMessageLoading ? t('loadingInputPlaceholder') : t('inputPlaceholder')
})
const content = ref('')
const isComposition = ref(false)
const setComposition = (val) => {
  isComposition.value = val
}

const sendMessage = () => {
  if (props.isMessageUsageOverLimit) {
    location.reload()
  }
  if (content.value.length === 0 || isComposition.value) {
    return
  }
  emit('send-message', content.value)
  content.value = ''
  nextTick(() => {
    resizeTextarea()
  })
}
const stopProcess = () => {
  emit('stop-process')
}
</script>

<style lang="scss" scoped>
textarea::-webkit-scrollbar {
  display: none;
}
</style>
