/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['"Helvetica Neue"', 'Inter', 'system-ui', 'sans-serif'],
        accent: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: '#2a2f36',
        muted: '#667085',
        panel: '#f7f8fb',
        border: '#e2e4ea',
        accent: '#2b4c7e',
      },
      boxShadow: {
        soft: '0 15px 40px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  plugins: [],
}
