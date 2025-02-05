import { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'mobile': {'max': '767px'},
        'desktop': '768px',
      },
    },
  },
  plugins: [],
} satisfies Config;
