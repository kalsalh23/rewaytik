/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#428177',
          light: '#edebe0',
          dark: '#054239',
          darker: '#002623',
        },
        accent: {
          DEFAULT: '#b9a779',
          dark: '#988561',
        },
        secondary: {
          DEFAULT: '#161616',
          light: '#3d3a3b',
        },
        background: {
          DEFAULT: '#edebe0',
          card: '#ffffff',
        },
        border: '#d4cfc0',
        muted: {
          DEFAULT: '#edebe0',
          foreground: '#3d3a3b',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#161616',
        },
        success: '#428177',
        warning: '#b9a779',
        error: '#6b1f2a',
        info: '#054239',
      },
      fontFamily: {
        sans: ['Readex Pro', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
