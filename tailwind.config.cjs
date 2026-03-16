/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F5AD6',
        primaryLighten: '#5E9BE6',
        disabled: {
          50: '#f2f3f5',
          100: '#E4E7ED',
          200: '#A9AEB8',
          300: '#4e5969'
        },
        chatBg: '#E7EBF1',
        mask: '#093B8766'
      },
      fontFamily: {
        'noto-sans': ['Noto Sans TC', 'sans-serif']
      }
    }
  },
  plugins: []
}
