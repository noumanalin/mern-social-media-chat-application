// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      darkMode: 'class',
      colors: {
        primary: 'var(--color-primary)',
        'primary-variant': 'var(--color-primary-variant)',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      
    },
  },
  plugins: [],
}
