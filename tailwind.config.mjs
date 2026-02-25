/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        poi: {
          base: "#1b1e28",
          back: "#171922",
          panel: "#232735",
          text: "#a6accd",
          focus: "#e4f0fb",
          blue: "#89ddff",
          green: "#addb67",
          pink: "#bae67e",
          border: "#303446",
        }
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', 'Meiryo', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
