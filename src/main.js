import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './lang/index'
import copyCode from './directives/copyCode'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.directive('add-copy', copyCode)
app.mount('#app')
