<template>
  <header
    class="rounded-t-[20px] px-5 py-[18px] text-white"
    :style="headerStyle"
  >
    <div class="flex items-center">
      <img
        v-if="icon"
        class="mr-4 w-[48px] object-contain"
        :src="icon"
      />
      <img
        v-if="contentIcon"
        class="mr-4 h-[48px] object-cover"
        :src="contentIcon"
      />
      <p
        v-else
        class="mr-auto grow truncate text-xl"
      >
        {{ content }}
      </p>
      <button
        v-if="isShowClose"
        @click=""
      >
        <img
          class="title-bar-icon"
          src="../assets/close.svg"
          alt=""
          srcset=""
        />
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isShowClose: { type: Boolean, default: false }, // 是否顯示關閉按鈕
  background: {
    type: Object,
    default: () => ({
      degree: null,
      fromColor: null,
      toColor: null
    })
  },
  textColor: { type: String, default: null },
  icon: { type: String, default: null },
  content: { type: String, default: null },
  contentIcon: { type: String, default: null }
})

const headerStyle = computed(() => {
  const degree = props.background.degree || 90
  const fromColor = props.background.fromColor || '#0F5AD6'
  const toColor = props.background.toColor || '#5E9BE6'
  return {
    background: `linear-gradient(${degree}deg,  ${fromColor}, ${toColor})`,
    color: props.textColor || '#fff'
  }
})
</script>

<style lang="scss" scoped></style>
