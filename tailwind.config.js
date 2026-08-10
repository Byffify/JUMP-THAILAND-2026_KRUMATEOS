/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FAAA48',
        peach: '#FFDDAC',
        dark: '#2F0F03',
        cream: '#FFFDF9',
        line: '#F2E9DE',
        muted: '#6E4A33',
        soft: '#FBF3E8',
      },
      fontFamily: {
        sans: ['"Prompt"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(47,15,3,0.04), 0 4px 16px rgba(47,15,3,0.05)',
        lift: '0 2px 6px rgba(47,15,3,0.08), 0 12px 28px rgba(47,15,3,0.10)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};