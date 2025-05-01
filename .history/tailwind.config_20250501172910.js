/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Assuming components folder exists
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Map the 'mono' key used in layout.tsx (font-mono) to our CSS variable
        mono: ['var(--font-roboto-mono)', 'monospace'], 
        // Keep Outfit mapped if needed for specific classes like font-outfit
        outfit: ['var(--font-outfit)', 'sans-serif'], 
        // Ensure 'sans' uses the default (which we aren't setting here, letting it fall back or be set elsewhere if needed)
        // Or explicitly map sans to a fallback if desired: 
        // sans: ['var(--font-roboto-mono)', 'sans-serif'], // If you wanted mono as sans too, but we want mono
      },
      // Add other theme extensions here if needed
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
    },
  },
  plugins: [],
}; 