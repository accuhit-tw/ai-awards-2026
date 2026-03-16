import { createI18n } from 'vue-i18n'
const i18n = createI18n({
  legacy: false,
  locale: 'zhTw',
  fallbackLocale: 'zhTw',
  globalInjection: true,
  messages: {
    zhTw: {
      restartConversation: '重新對話',
      defaultBotName: '智能機器人名稱',
      confirmTitle: '您確定要重新對話嗎？',
      confirmDesc: '重要提示：重新對話後，先前對話將會被全數清空。',
      cancel: '取消',
      confirm: '確定',
      send: '送出',
      inputPlaceholder: '請輸入問題',
      loadingInputPlaceholder: '正在翻找知識庫...',
      feedbackTitle: '請留下您的評論',
      messageUsageOverLimit: '很抱歉，目前暫時停止服務。',
      errorTitle: '目前暫時無法提供服務！',
      errorDescription: '如有緊急需求，請聯繫客服人員',
      errorButtonText: '我瞭解了，關閉視窗'
    },
    en: {
      restartConversation: 'Restart Conversation',
      defaultBotName: 'Default Bot Name',
      confirmTitle: 'Are you sure you want to restart the conversation?',
      confirmDesc: 'Important: Restarting the conversation will clear all previous messages.',
      cancel: 'Cancel',
      confirm: 'Confirm',
      send: 'Send',
      inputPlaceholder: 'Please enter your question',
      loadingInputPlaceholder: 'Searching the knowledge base...',
      feedbackTitle: 'Please leave your feedback',
      messageUsageOverLimit: 'Sorry, the service is temporarily suspended!',
      errorTitle: 'Service is temporarily unavailable',
      errorDescription: 'If you have an urgent need, please contact customer support',
      errorButtonText: 'Got it, close the window'
    }
  },
  numberFormats: {
    zhTw: {
      decimal: {
        style: 'decimal',
        maximumFractionDigits: 3
      }
    },
    en: {
      decimal: {
        style: 'decimal',
        maximumFractionDigits: 3
      }
    }
  }
})
export default i18n
