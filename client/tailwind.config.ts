import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        light: {
          sidebar: 'rgba(245, 246, 250, 1)',
          background: 'rgba(255, 255, 255, 1)',
          main: 'rgba(31, 100, 255, 1)',
          mainText: 'rgba(22, 21, 28, 1)',
          redBackground: 'rgba(255, 240, 240, 1)',
          redText: 'rgba(228, 29, 29, 1)',
          smallText: 'rgba(156, 154, 165, 1)',
          smallBackgroundText: 'rgba(162, 161, 168, 1)',
          bodyBackground: 'rgba(31, 100, 255, 0.1)',
          purpleText: 'rgba(113, 82, 243, 1)',
          purpleBackground: 'rgba(113, 82, 243, 0.1)',
          yellowText: 'rgba(239, 190, 18, 1)',
          yellowBackground: 'rgba(239, 190, 18, 0.1)',
          greenText: 'rgba(63, 194, 138, 1)',
          greenBackground: 'rgba(63, 194, 138, 0.1)',
        },
        dark: {
          sidebar: 'rgba(29, 28, 35, 1)',
          background: 'rgba(22, 21, 28, 1)',
          main: 'rgba(31, 100, 255, 1)',
          mainText: 'rgba(245, 246, 250, 1)',
          redBackground: 'rgba(255, 240, 240, 1)',
          redText: 'rgba(228, 29, 29, 1)',
          smallText: 'rgba(156, 154, 165, 1)',
          smallBackgroundText: 'rgba(162, 161, 168, 1)',
          bodyBackground: 'rgba(31, 100, 255, 0.1)',
          purpleText: 'rgba(113, 82, 243, 1)',
          purpleBackground: 'rgba(113, 82, 243, 0.1)',
          yellowText: 'rgba(239, 190, 18, 1)',
          yellowBackground: 'rgba(239, 190, 18, 0.1)',
          greenText: 'rgba(63, 194, 138, 1)',
          greenBackground: 'rgba(63, 194, 138, 0.1)',
        },
      }
    },
  },
  plugins: [],
};
export default config;
