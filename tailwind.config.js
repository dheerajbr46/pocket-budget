/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213d',
        paper: '#f8fafc',
        mint: '#14b8a6',
        coral: '#fb7185'
      },
      boxShadow: {
        soft: '0 24px 70px rgba(15, 23, 42, 0.12)',
        card: '0 2px 16px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
        glow: '0 8px 40px rgba(20, 184, 166, 0.22), 0 2px 8px rgba(20, 184, 166, 0.12)',
        'ink-glow': '0 8px 32px rgba(20, 33, 61, 0.28), 0 2px 8px rgba(20, 33, 61, 0.16)'
      },
      backgroundImage: {
        'gradient-ink': 'linear-gradient(135deg, #1c2f4e 0%, #14213d 55%, #0e1928 100%)',
        'gradient-mint': 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
        'gradient-coral': 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)'
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
};
