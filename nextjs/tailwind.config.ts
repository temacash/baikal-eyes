import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1117',
        ink2: '#0E151D',
        ink3: '#132030',
        abyss: '#123B50',
        ice: '#A9E5F5',
        iceDeep: '#6FB8CF',
        paper: '#F5F7F8',
        sand: '#C5A77B',
        muted: '#8798A3'
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
};
export default config;
