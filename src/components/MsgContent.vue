<template>
  <div
    class="mb-4 flex gap-2"
    :class="msgContentWrapperStyle"
  >
    <div
      v-if="isBotMsg"
      class="shrink-0"
    >
      <img
        :src="computeBotIcon"
        class="h-[48px] w-[48px]"
        alt="botIcon"
        srcset=""
      />
    </div>
    <div class="overflow-hidden">
      <template v-if="isLoading">
        <div
          class="mb-2 w-fit whitespace-pre-wrap break-all rounded-[20px] px-4 py-3"
          :class="msgContentStyle"
          :style="messageInlineStyle"
        >
          <div
            ref="contentRef"
            class="markdown-body"
            v-add-copy
            v-html="computedHtmlContent"
          />
          <Loading
            v-if="isLoading"
            class="py-1.5"
          />
        </div>
      </template>
      <template v-else>
        <template v-if="!!props.text">
          <div
            class="mb-2 w-fit rounded-[20px] px-4 py-3 whitespace-pre-wrap break-all"
            :class="msgContentStyle"
            :style="messageInlineStyle"
          >
            <div
              ref="contentRef"
              class="markdown-body"
              v-add-copy
              v-html="computedHtmlContent"
            />
          </div>
        </template>
        <template v-else>
          <div class="mb-2 flex w-full gap-4 overflow-x-auto">
            <div v-for="product in props.flexMessage">
              <PictureCard
                :product-data="product"
                :message-style="messageInlineStyle"
              />
            </div>
          </div>
        </template>
      </template>
      <div class="flex">
        <p
          class="mx-1 grow text-xs text-disabled-300"
          :class="{
            'text-right': isUserMsg
          }"
        >
          {{ time }}
        </p>
        <FeedbackBtnGroup
          class="ml-4"
          v-if="isShowFeedbackControl"
          :is-like="isLike"
          @feedback="handleFeedback"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick, ref } from 'vue'
import Loading from '@/components/Loading.vue'
import defaultBotIcon from '../assets/icon.svg'
import FeedbackBtnGroup from '@/components/FeedbackBtnGroup.vue'
import PictureCard from '@/components/PictureCard.vue'
import MarkdownIt from 'markdown-it'
import HighLight from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const props = defineProps({
  role: { type: String },
  name: { type: String },
  text: { type: [String, null] },
  flexMessage: { type: [Array, null] },
  time: { type: String },
  messageId: { type: String },
  isShowFeedback: { type: Boolean },
  isLike: { type: [Boolean, null] },
  isLoading: { type: Boolean, default: false },
  isShowFeedbackControl: { type: Boolean },
  botIcon: { type: String, default: null },
  botMessageBackground: { type: Object, default: () => ({ degree: null, fromColor: null, toColor: null }) },
  botMessageTextColor: { type: String, default: null },
  selfMessageBackground: { type: Object, default: () => ({ degree: null, fromColor: null, toColor: null }) },
  selfMessageTextColor: { type: String, default: null }
})

const computeBotIcon = computed(() => {
  return props.botIcon || defaultBotIcon
})
const botMessageStyle = computed(() => {
  const degree = props.botMessageBackground.degree || 90
  const fromColor = props.botMessageBackground.fromColor || '#fff'
  const toColor = props.botMessageBackground.toColor || '#fff'
  return {
    background: `linear-gradient(${degree}deg,  ${fromColor}, ${toColor})`,
    color: props.botMessageTextColor || '#000'
  }
})
const selfMessageStyle = computed(() => {
  const degree = props.selfMessageBackground.degree || 90
  const fromColor = props.selfMessageBackground.fromColor || '#0F5AD6'
  const toColor = props.selfMessageBackground.toColor || '#0F5AD6'
  return {
    background: `linear-gradient(${degree}deg,  ${fromColor}, ${toColor})`,
    color: props.selfMessageTextColor || '#fff'
  }
})

const emit = defineEmits(['feedback'])
const isUserMsg = computed(() => props.role === 'User')
const isBotMsg = computed(() => props.role === 'Bot')
const msgContentWrapperStyle = computed(() => {
  if (isUserMsg.value) {
    return 'justify-end'
  }
  return ''
})
const msgContentStyle = computed(() => {
  if (isUserMsg.value) {
    return 'max-w-80'
  }
  return 'max-w-[80%]'
})
const messageInlineStyle = computed(() => {
  return isUserMsg.value ? selfMessageStyle.value : botMessageStyle.value
})

const handleFeedback = (isLike) => {
  emit('feedback', isLike)
}

// 判斷是否為 markdown 格式的語法
const handleIsMarkdown = (text) => {
  // 檢查是否包含 Markdown 表格（必須同時有表頭列和分隔列）
  const hasTableHeader = /\|.+\|/.test(text)
  const hasTableSeparator = /\|\s*[-:]+\s*\|/.test(text)
  const isTable = hasTableHeader && hasTableSeparator
  
  return /(^#)|(\n#)|(^- )|(\n- )|(\*\*|__|\*|_|~~)/.test(text) || isTable
}

const md = new MarkdownIt({
  html: false,
  highlight: (str, lang) => {
    if (lang && HighLight.getLanguage(lang)) {
      return '<pre class="hljs"><code>' + HighLight.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code></pre>'
    }
  }
})
const computedHtmlContent = computed(() => {
  const isMarkdown = handleIsMarkdown(props.text)

  let message = props.text

  if (isMarkdown) {
    // 使用佔位符方案處理 <br> 標籤(保持 html: false 安全性,同時支援表格內換行)
    // 步驟1: 將 <br> 替換為唯一佔位符(避免被 Markdown 解析破壞表格結構)
    const BR_PLACEHOLDER = '⚡⚡LINEBREAK⚡⚡'
    let text = props.text.replace(/<br\s*\/?>/gi, BR_PLACEHOLDER)
    
    // 步驟2: 渲染 Markdown(此時表格結構完整)
    message = md.render(text)
    
    // 步驟3: 將佔位符替換回 <br> 標籤(只有 <br> 會被渲染為 HTML)
    message = message.replace(new RegExp(BR_PLACEHOLDER, 'g'), '<br>')
    
    // 為表格加上捲動容器
    message = message.replace(/(<table>[\s\S]*?<\/table>)/g, '<div class="table-wrapper">$1</div>')
  } else {
    const urlRegex = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
    message = message.replace(urlRegex, (match) => {
      const linkStyle = props.role === 'User' ? 'text-white hover:text-blue-500' : 'text-blue-700 hover:text-blue-500'
      return `<a href="${match}" target="_blank" class="${linkStyle}">${match}</a>`
    })

    message = message
      .split('\n')
      .map((line) => `<div>${line}</div>`)
      .join('')
  }

  return message
})

const contentRef = ref(null)
// fix: 完善如果找不到對應的 language 情況
const highlightCode = () => {
  nextTick(() => {
    contentRef.value.querySelectorAll('pre code[class*="language-"]').forEach((block) => {
      if (!block.hasAttribute('data-highlighted')) {
        HighLight.highlightElement(block)
      }
    })
  })
}

onMounted(highlightCode)
</script>
