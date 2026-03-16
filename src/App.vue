<template>
  <template v-if="isPointsRemaining || conversationChannel === 'liff'">
    <div class="flex h-screen flex-col">
      <Header
        v-bind="setting.title"
        :content="botName"
      />
      <div
        class="grow rounded-b-[20px]"
        :style="chatroomStyle"
      >
        <div class="flex h-full flex-col">
          <div
            ref="messageListRef"
            class="grow overflow-y-auto px-5 py-[18px]"
          >
            <MsgContent
              v-for="(item, index) of messageStack"
              v-bind="{ ...item, ...setting.message }"
              :is-show-feedback-control="index === messageStack.length - 1 && item.isShowFeedback && conversationMode === 1"
              @feedback="handleFeedback($event, item)"
              :is-loading="item.role === 'Bot' && index === messageStack.length - 1 && isMessageGenerating"
            />
          </div>
          <div class="relative px-5 py-[18px]">
            <MsgInput
              :is-stop-process-loading="isStopProcessLoading"
              :is-send-message-loading="isSendMessageLoading"
              :is-message-usage-over-limit="isMessageUsageOverLimit"
              :show-stop-btn="showStopBtn"
              @send-message="handleSendMessage"
              @stop-process="handleStopProcess"
            />
            <button
              v-if="conversationMode === 1 && !isMessageGenerating"
              class="absolute -top-[36px] right-[30px] z-10 cursor-pointer rounded-[20px] border border-primary bg-white px-4 py-2 text-center text-primary"
              @click="resetConfirm.openDialog"
            >
              <p>
                <IconPainter class="mr-1 inline-block h-4 w-4 fill-primary" />
                {{ t(`restartConversation`) }}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
    <FeedbackDialog
      v-if="conversationMode === 1"
      ref="feedbackDialog"
      @submit="handleSubmitFeedbackContent"
    />
    <ResetConfirm
      v-if="conversationMode === 1"
      ref="resetConfirm"
      @confirm="refreshChatSession"
    />
  </template>
  <template v-else>
    <div class="flex h-screen flex-col">
      <Header
        :content="botName"
        class="z-20"
      />
      <div
        :style="chatroomStyle"
        class="flex h-full items-center justify-center"
      >
        <div class="relative h-[490px]">
          <div>
            <img
              class="rounded-[20px]"
              src="./assets/error.png"
              alt="not available"
            />
          </div>
          <div class="absolute bottom-20 w-[384px] justify-center rounded-[20px] bg-white py-10 text-center">
            <div class="text-[#4E5969]">
              <p class="mb-[10px] font-bold">{{ t('errorTitle') }}</p>
              <p>{{ t('errorDescription') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
<script setup>
import Header from '@/components/Header.vue'
import MsgInput from '@/components/MsgInput.vue'
import MsgContent from '@/components/MsgContent.vue'
import { computed, nextTick, onBeforeMount, onMounted, ref } from 'vue'
import useTimezone from '@/composable/useTimezone.js'
import { post, get } from './api/api'
import dayjs from 'dayjs'
import ResetConfirm from '@/components/ResetConfirm.vue'
import FeedbackDialog from '@/components/FeedbackDialog.vue'
import IconPainter from '@/components/icon/IconPainter.vue'
import { v4 as uuidv4 } from 'uuid'
import { useI18n } from 'vue-i18n'
import useWebChatStyle from '@/composable/useWebChatStyle.js'
const apiURL = import.meta.env.VITE_APP_API_URL

const { t, locale } = useI18n({ useScope: 'global' })
onBeforeMount(() => {
  const lang = window.navigator.language
  if (lang.includes('zh')) {
    locale.value = 'zhTw'
  } else {
    locale.value = 'en'
  }
})

// 取得聊天室設定，套入樣式
const { setting, fetchSettingData } = useWebChatStyle()
onBeforeMount(() => {
  fetchSettingData()
})
const chatroomStyle = computed(() => {
  const degree = setting.value.chatroom.background.degree || 45
  const fromColor = setting.value.chatroom.background.fromColor || '#E7EBF1'
  const toColor = setting.value.chatroom.background.toColor || '#E7EBF1'
  return {
    background: `linear-gradient(${degree}deg,  ${fromColor}, ${toColor})`,
    color: setting.value.chatroom.textColor || '#fff'
  }
})
//產生user_identify，先檢查storage內有無
const getUserIdentifier = () => {
  const storedUserIdentifier = window.localStorage.getItem('user_identify')

  if (!storedUserIdentifier) {
    const newIdentifier = uuidv4()
    window.localStorage.setItem('user_identify', newIdentifier)
    return newIdentifier
  }

  return storedUserIdentifier
}
const userIdentify = getUserIdentifier()
const { getTimeWithTimezone } = useTimezone()
const getCurrentTime = () => {
  return getTimeWithTimezone(dayjs()).format('HH:mm')
}
const messageStack = ref([]) //訊息array
const messageListRef = ref(null)
const isMessageGenerating = ref(false)
const botName = ref(t('defaultBotName'))
const chatHistoryId = ref('')
const resetConfirm = ref()
const jwt = ref('')
const scrollToBottom = () => {
  nextTick(() => {
    const element = messageListRef.value
    element.scrollTop = element.scrollHeight
  })
}

const generateMessage = ({ role, name, text, messageId = '', isShowFeedback = false, isLike = null, time = getCurrentTime(), flexMessage }) => {
  return {
    role,
    name,
    text,
    time,
    messageId,
    isShowFeedback,
    isLike,
    flexMessage
  }
}
// 拿交談紀錄
const fetchMessages = async (userIdentify, channelHash) => {
  try {
    const res = await post(`${apiURL}/api/v1/message-api/init-flow`, {
      userId: userIdentify,
      channelId: channelHash,
      channelType: 'webchat'
    })
    jwt.value = res.data.data.jwt
    botName.value = res.data.data.botName
    chatHistoryId.value = res.data.data.chatId

    const messages = res.data.data.messages
    if (!Array.isArray(messages) || messages.length === 0) {
      const msg = generateMessage({
        role: 'Bot',
        name: 'ChatBot',
        text: res.data.data.welcomeMessage
      })
      messageStack.value.push(msg)
    }
    if (messages && messages.length > 0) {
      //判斷是否還有未回覆訊息
      // if (messages[messages.length - 1].isFromUser && !messages[messages.length - 1].isHalt) {
      //   isMessageGenerating.value = true
      // }
      const messageStackValue = messages.map((item) =>
        generateMessage({
          role: item.isFromUser ? 'User' : 'Bot',
          name: item.isFromUser ? 'User' : 'ChatBot',
          text: item.textMessage,
          time: getTimeWithTimezone(item.createdTime).format('HH:mm'),
          messageId: item.id,
          isShowFeedback: !item.isFromUser,
          isLike: item.isLike === undefined ? null : item.isLike,
          flexMessage: item.flexMessage
        })
      )
      messageStack.value.push(...messageStackValue)
    }
    if (!isPointsRemaining) scrollToBottom()
  } catch (error) {
    console.error(error)
  }
}

const isPointsRemaining = ref(true)
const getPointRemainder = async () => {
  try {
    const { data } = await get(`${apiURL}/api/v1/message-api/check-point-usage?channelId=${channelHash.value}`)

    isPointsRemaining.value = data.code === '996600001'
  } catch (error) {
    isPointsRemaining.value = false
    console.error(error)
  }
}

// user 送出訊息
const isMessageUsageOverLimit = ref(false) // 組織用量是否已達上限
const isSendMessageLoading = ref(false)
const showStopBtn = ref(false)
const connectionId = ref('')
const currentMessageId = ref('')
let socket = null

// 從 websocket 接收訊息
const handleSocketReceiveMessage = (eventData) => {
  // 判斷是否訊息還在生成中
  if (!eventData.isDone) {
    // 如是新訊息，新增至訊息列
    if (eventData.isStart) {
      showStopBtn.value = true
      const msg = generateMessage({
        role: 'Bot',
        name: 'ChatBot',
        text: '',
        messageId: currentMessageId.value,
        isShowFeedback: false
      })
      messageStack.value.push(msg)
      scrollToBottom()
    }

    // 圖卡畫面：會有 flexMessages
    if (eventData.flexMessages) {
      const newMessage = generateMessage({
        role: 'Bot',
        name: 'ChatBot',
        text: '',
        messageId: currentMessageId.value,
        isShowFeedback: false,
        flexMessage: eventData.flexMessages
      })
      messageStack.value.push(newMessage)
    } else {
      messageStack.value = messageStack.value.map((item) => {
        if (item.messageId === currentMessageId.value) {
          item.text = item.text + eventData.message
        }
        return item
      })
    }
  } else {
    isMessageGenerating.value = false
    isSendMessageLoading.value = false
    showStopBtn.value = false
    connectionId.value = ''
    currentMessageId.value = ''
    messageStack.value[messageStack.value.length - 1].isShowFeedback = true
    socket.close()
  }
}
const doSocketConnect = async (cb) => {
  if (socket) {
    socket.close()
  }
  socket = new WebSocket(import.meta.env.VITE_SOCKET_URL)
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const isConnectionInitial = !!data.connectionId
    const isMessageReceive = data.message !== undefined
    if (isConnectionInitial) {
      connectionId.value = data.connectionId
      currentMessageId.value = data.messageId
      isMessageGenerating.value = true
      cb()
    }
    if (isMessageReceive) {
      handleSocketReceiveMessage(data)
    }
  }
  socket.onopen = () => {
    socket.send('ping')
  }
  socket.onerror = function (error) {
    console.error('WebSocket Error:', error)
  }
  return socket
}

let controller = new AbortController()
const doSendMessage = async (message = '') => {
  try {
    isSendMessageLoading.value = true

    await post(
      `${apiURL}/api/v1/message-api/send-stream-message`,
      {
        message,
        channelType: 'webchat',
        connectionId: connectionId.value,
        messageId: currentMessageId.value,
        testMode: conversationMode.value
      },
      {
        headers: {
          Authorization: `Bearer ${jwt.value}`
        },
        signal: controller.signal
      }
    )
  } catch (error) {
    const tenantMessageUsageOverLimitCode = '709802010'
    const channelClosedCode = '709802005'
    if (error?.code === tenantMessageUsageOverLimitCode || error?.code === channelClosedCode) {
      isMessageUsageOverLimit.value = true
    }
    connectionId.value = ''
    currentMessageId.value = ''
    isSendMessageLoading.value = false
    isMessageGenerating.value = false
    showStopBtn.value = false
    console.error(error)
  }
}
const handleSendMessage = (content) => {
  doSocketConnect(() => {
    // 將 user 訊息加入訊息列後，滾動到最底部
    const msg = generateMessage({ role: 'User', name: 'User', text: content })
    messageStack.value.push(msg)
    scrollToBottom()
    doSendMessage(content)
  })
}

// 中斷聊天回覆
const isStopProcessLoading = ref(false)
const handleStopProcess = async () => {
  try {
    isStopProcessLoading.value = true
    socket.close()

    await post(
      `${apiURL}/api/v1/message-api/stop-stream-message`,
      {
        connectionId: connectionId.value
      },
      {
        headers: {
          Authorization: `Bearer ${jwt.value}`
        }
      }
    )
    isSendMessageLoading.value = false
    isMessageGenerating.value = false
    showStopBtn.value = false
    connectionId.value = ''
    currentMessageId.value = ''
  } catch (error) {
    console.error(error)
  } finally {
    isStopProcessLoading.value = false
  }
}

// 對話測試相關，依照 query string 判斷是什麼模式
const conversationMode = ref(0) // 對話模式 1:測試模式 2,0:使用者模式
const channelHash = ref(null)
const conversationChannel = ref('') // 對話由誰發起， liff or web
const getQueryString = (searchParams) => {
  const channel = searchParams.get('channel')
  if (channel !== null) {
    conversationChannel.value = channel
  }

  const channelHashParam = searchParams.get('channelHash')
  if (channelHashParam !== null) {
    channelHash.value = channelHashParam
  }

  const mode = searchParams.get('mode')
  if (mode !== null) {
    conversationMode.value = Number(mode)
  }
}
onBeforeMount(async () => {
  const currentUrl = window.location.href
  const urlObj = new URL(currentUrl)
  const params = new URLSearchParams(urlObj.search)
  getQueryString(params)
})

const isFeedbackLoading = ref(false)
const doFeedback = async ({ feedbackContent, isLike, chatHistoryId, messageId }) => {
  try {
    isFeedbackLoading.value = true
    await post(
      `${apiURL}/api/v1/message-api/feedback/create`,
      {
        feedbackContent,
        isLike,
        chatHistoryId,
        messageId
      },
      {
        headers: {
          Authorization: `Bearer ${jwt.value}`
        }
      }
    )
    messageStack.value = messageStack.value.map((item) => {
      if (item.messageId === messageId) {
        item.isLike = isLike
      }
      return item
    })
  } catch (e) {
    console.error(e)
  } finally {
    isFeedbackLoading.value = false
  }
}

const feedbackDialog = ref()
const handleFeedback = (isLike, messageItem) => {
  if (messageItem.isLike !== null) return
  if (isLike) {
    doFeedback({
      feedbackContent: '',
      isLike: true,
      chatHistoryId: chatHistoryId.value,
      messageId: messageItem.messageId
    })
  } else {
    feedbackDialog.value.openDialog({
      feedbackContent: '',
      messageId: messageItem.messageId
    })
  }
}
const handleSubmitFeedbackContent = ({ feedbackContent, messageId }) => {
  doFeedback({
    messageId,
    feedbackContent,
    isLike: false,
    chatHistoryId: chatHistoryId.value
  })
}
const refreshChatSession = () => {
  window.localStorage.removeItem('pusher_channel_name')
  window.localStorage.removeItem('pusherTransportTLS')
  window.localStorage.removeItem('user_identify')
  window.location.reload()
}

onMounted(async () => {
  await getPointRemainder()
  if (isPointsRemaining.value) {
    fetchMessages(userIdentify, channelHash.value)
  }
})
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
