/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        mint: '#14b8a6',
        coral: '#fb7185',
        indigo: '#4f46e5',
        violet: '#7c3aed'
      },
      boxShadow: {
        soft: '0 24px 70px rgba(15, 23, 42, 0.12)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.07)',
        'card-md': '0 4px 16px 0 rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.05)',
        glow: '0 8px 40px rgba(79, 70, 229, 0.30), 0 2px 8px rgba(79, 70, 229, 0.18)',
        'ink-glow': '0 8px 32px rgba(79, 70, 229, 0.32), 0 2px 8px rgba(79, 70, 229, 0.20)'
      },
      backgroundImage: {
        'gradient-ink': 'linear-gradient(135deg, #1c2f4e 0%, #14213d 55%, #0e1928 100%)',
        'gradient-hero': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)',
        'gradient-mint': 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
        'gradient-coral': 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)',
        'gradient-indigo': 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans Variable"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
};
