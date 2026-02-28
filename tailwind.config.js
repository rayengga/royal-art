/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover))',
          foreground: 'rgb(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive))',
          foreground: 'rgb(var(--destructive-foreground))',
        },
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
        // Custom theme colors for light palette
        'soft-gold': 'rgb(var(--soft-gold))',
        'electric-blue': 'rgb(var(--electric-blue))',
        'warm-beige': 'rgb(var(--warm-beige))',
        'light-brown': 'rgb(var(--light-brown))',
        'dark-gray': 'rgb(var(--dark-gray))',
        'medium-gray': 'rgb(var(--medium-gray))',
        'pure-white': 'rgb(var(--pure-white))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'gentle-glow': {
          '0%, 100%': { 
            boxShadow: '0 2px 8px rgb(var(--soft-gold) / 0.2)' 
          },
          '50%': { 
            boxShadow: '0 4px 16px rgb(var(--soft-gold) / 0.4)' 
          },
        },
        'blue-pulse': {
          '0%, 100%': { 
            boxShadow: '0 2px 8px rgb(var(--electric-blue) / 0.2)' 
          },
          '50%': { 
            boxShadow: '0 4px 16px rgb(var(--electric-blue) / 0.4)' 
          },
        },
        'smooth-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'logo-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'laser-pulse': {
          '0%, 100%': { 
            opacity: '0.8',
            transform: 'scaleY(1)',
          },
          '50%': { 
            opacity: '1',
            transform: 'scaleY(1.3)',
          },
        },
        'premium-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgb(var(--soft-gold) / 0.3), 0 0 20px rgb(var(--electric-blue) / 0.2)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgb(var(--soft-gold) / 0.5), 0 0 30px rgb(var(--electric-blue) / 0.4)',
          },
        },
      },
      animation: {
        'gentle-glow': 'gentle-glow 3s ease-in-out infinite',
        'blue-pulse': 'blue-pulse 2s ease-in-out infinite',
        'smooth-slide': 'smooth-slide 3s linear infinite',
        'logo-spin': 'logo-spin 20s linear infinite',
        'laser-pulse': 'laser-pulse 2s ease-in-out infinite',
        'premium-glow': 'premium-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}