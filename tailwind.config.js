/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        kanzu: {
          orange: '#F97316',
          dark: '#1E293B',
        },
      },
    },
  },
  plugins: [],
}
