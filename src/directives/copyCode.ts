import { Directive } from 'vue'

const copyCode: Directive = {
  mounted(el: HTMLElement) {
    addCopyButton(el)
  },
  updated(el: HTMLElement) {
    addCopyButton(el)
  }
}

const addCopyButton = (el: HTMLElement) => {
  const codeBlocks = el.querySelectorAll('pre code')
  codeBlocks.forEach((codeEl) => {
    const parentElement = codeEl.parentElement
    if (parentElement) {
      parentElement.style.position = 'relative'
      if (parentElement.querySelector('.copy-btn')) return

      const White = '#ffffff'
      const Primary = '#0F5AD6'
      const iconHTML = (color: string): string => {
        return `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="20px" fill="${color}"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>`
      }

      const btn = document.createElement('button')
      btn.innerHTML = iconHTML(White)
      btn.style.position = 'absolute'
      btn.style.top = '3px'
      btn.style.right = '5px'
      btn.style.cursor = 'pointer'

      btn.addEventListener('click', () => {
        const text = codeEl.textContent || ''
        navigator.clipboard
          .writeText(text)
          .then(() => {
            btn.innerHTML = iconHTML(Primary)
            setTimeout(() => {
              btn.innerHTML = iconHTML(White)
            }, 500)
          })
          .catch((err) => {
            console.error('複製失敗:', err)
          })
      })

      parentElement.appendChild(btn)
    }
  })
}

export default copyCode
