/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        sidebar: {
          DEFAULT: '#0f172a',
          hover: 'rgba(255, 255, 255, 0.1)',
          active: 'rgba(79, 70, 229, 0.15)',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          raised: '#f1f5f9',
        },
        accent: {
          DEFAULT: '#4f46e5',
          hover: '#818cf8',
          glow: 'rgba(79, 70, 229, 0.15)',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#065f46',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#92400e',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#991b1b',
        },
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
          muted: '#94a3b8',
          inverse: '#ffffff',
        },
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        lg: '20px',
        xl: '40px',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.04)',
        'glass-hover': '0 8px 40px rgba(0, 0, 0, 0.08)',
        'ambient': '0 20px 40px rgba(15, 23, 42, 0.06)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.08)',
        'nav': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'button': '0 4px 14px rgba(79, 70, 229, 0.25)',
        'button-hover': '0 6px 20px rgba(79, 70, 229, 0.35)',
        'sidebar': '4px 0 24px rgba(15, 23, 42, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
