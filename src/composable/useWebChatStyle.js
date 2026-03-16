import { ref } from 'vue'
import axios from 'axios'

export default function () {
  const setting = ref({
    size: 'large',
    embedIcon: null,
    embedContent: null,
    chatroom: {
      background: {
        degree: null,
        fromColor: null,
        toColor: null
      },
      textColor: null
    },
    title: {
      icon: null,
      content: null,
      contentIcon: null,
      textColor: null,
      background: {
        degree: null,
        fromColor: null,
        toColor: null
      }
    },
    message: {
      botIcon: null,
      botMessageBackground: {
        degree: null,
        fromColor: null,
        toColor: null
      },
      botMessageTextColor: null,
      selfMessageBackground: {
        degree: null,
        fromColor: null,
        toColor: null
      },
      selfMessageTextColor: null
    }
  })
  const fetchSettingData = async () => {
    try {
      const urlObj = new URL(window.location.href)
      const channelHash = urlObj.searchParams.get('channelHash')
      if (!channelHash) return
      const data = await axios.get(`${import.meta.env.VITE_S3_BUCKET_URL}/${channelHash}.json`)
      console.log(data)
      setting.value = data.data
    } catch (e) {
      console.error(e)
    }
  }
  return {
    setting,
    fetchSettingData
  }
}
