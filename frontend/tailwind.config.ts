import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        field: "#f5f7ef",
        canopy: "#1f3d2b",
        soil: "#8a5f3d",
        sun: "#f4b740",
        water: "#2b7a78",
        ink: "#17211b"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 33, 27, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
