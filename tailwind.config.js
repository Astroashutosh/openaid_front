/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        openaid: {
          navy: '#172b4c',
          sidebarDark: '#0c1a32',
          warningGold: '#ffa800',
          dark: '#03150D',
          greenDark: '#082A1B',
          forest: '#0c2c23',
          forestLight: '#114234',
          gold: '#D4A72C',
          goldLight: '#F2C14E',
          orange: '#e86710',
          orangeLight: '#fd7e14',
          card: '#ffffff',
          cardDark: '#12372e',
          border: 'rgba(0,0,0,0.06)',
          borderDark: 'rgba(255,255,255,0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 16px rgba(0, 0, 0, 0.04)',
        cardHover: '0 10px 24px rgba(0, 0, 0, 0.08)',
        hero: '0 10px 30px rgba(12, 44, 35, 0.22)',
      }
    },
  },
  plugins: [],
}
