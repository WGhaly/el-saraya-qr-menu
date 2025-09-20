import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Saraya Wooden Pattern Theme - Based on provided colors
        // #ea744c, #7c3419, #f5ab56, #ae6c37, #fb8b63
        primary: {
          50: '#fef8f5',
          100: '#fef1ea',
          200: '#fde1d3',
          300: '#fbc9b3',
          400: '#f8a684',
          500: '#f5ab56', // Light golden wood (#f5ab56)
          600: '#ea744c', // Warm coral wood (#ea744c)
          700: '#ae6c37', // Medium brown wood (#ae6c37)
          800: '#7c3419', // Deep brown wood (#7c3419)
          900: '#5c2712',
          950: '#3d1a0b',
        },
        secondary: {
          50: '#fef9f6',
          100: '#fef2ec',
          200: '#fde4d6',
          300: '#fcccb7',
          400: '#faa78b',
          500: '#fb8b63', // Warm peach wood (#fb8b63)
          600: '#ea744c', // Warm coral wood (#ea744c)
          700: '#ae6c37', // Medium brown wood (#ae6c37)
          800: '#7c3419', // Deep brown wood (#7c3419)
          900: '#5c2712',
        },
        wood: {
          50: '#fef8f5',
          100: '#fef1ea',
          200: '#fde1d3',
          300: '#fbc9b3',
          400: '#f8a684',
          500: '#f5ab56', // Light golden wood
          600: '#ea744c', // Warm coral wood
          700: '#ae6c37', // Medium brown wood
          800: '#7c3419', // Deep brown wood
          900: '#5c2712',
        },
        accent: {
          light: '#fb8b63', // Warm peach accent
          DEFAULT: '#ea744c', // Coral accent
          dark: '#7c3419', // Deep brown accent
        },
        background: {
          DEFAULT: '#ffffff',
          wood: '#fef8f5', // Lightest wood tone
          card: '#fef1ea', // Card background
          warm: '#fde1d3', // Warm background
        },
        text: {
          primary: '#3d1a0b', // Darkest brown for maximum readability
          secondary: '#7c3419', // Deep brown for secondary text
          light: '#ae6c37', // Medium brown for light text
          white: '#ffffff',
          accent: '#ea744c', // Coral for accent text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        wood: ['Merriweather', 'serif'],
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'wood-grain': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23f5ab56\" fill-opacity=\"0.08\"%3E%3Cpath d=\"M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm-20-2c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z\"/%3E%3C/g%3E%3C/svg%3E')",
        'gradient-wood': 'linear-gradient(135deg, #fef8f5 0%, #fde1d3 100%)',
        'gradient-primary': 'linear-gradient(135deg, #7c3419 0%, #f5ab56 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fb8b63 0%, #ea744c 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f5ab56 0%, #fb8b63 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'wood': '0 4px 6px -1px rgba(124, 52, 25, 0.15), 0 2px 4px -1px rgba(124, 52, 25, 0.1)',
        'wood-lg': '0 10px 15px -3px rgba(124, 52, 25, 0.15), 0 4px 6px -2px rgba(124, 52, 25, 0.08)',
        'warm': '0 4px 6px -1px rgba(234, 116, 76, 0.12), 0 2px 4px -1px rgba(234, 116, 76, 0.08)',
        'accent': '0 4px 6px -1px rgba(251, 139, 99, 0.12), 0 2px 4px -1px rgba(251, 139, 99, 0.08)',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    },
  },
  plugins: [],
};

export default config;