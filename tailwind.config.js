/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(240, 10%, 4%)',
        text: 'hsl(0, 0%, 98%)',
        error: 'hsl(0, 84%, 60%)',
        accent: 'hsl(192, 91%, 54%)',
        border: 'hsl(240, 6%, 20%)',
        primary: 'hsl(262, 83%, 58%)',
        success: 'hsl(142, 76%, 36%)',
        surface: 'hsl(240, 8%, 10%)',
        warning: 'hsl(38, 92%, 50%)',
        'text-muted': 'hsl(240, 5%, 65%)',
        'primary-hover': 'hsl(262, 83%, 65%)',
        'surface-hover': 'hsl(240, 8%, 14%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(240, 10%, 4%, 0.3)',
        'glow': '0 0 40px hsla(262, 83%, 58%, 0.3)',
        'card-hover': '0 8px 24px hsla(240, 10%, 4%, 0.4)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      animation: {
        'slide-in': 'slideIn 400ms cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fadeIn 250ms ease',
        'slide-up': 'slideUp 300ms ease-out',
        'bounce-gentle': 'bounce 1s ease-in-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-30px)' },
          '70%': { transform: 'translateY(-15px)' },
          '90%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}