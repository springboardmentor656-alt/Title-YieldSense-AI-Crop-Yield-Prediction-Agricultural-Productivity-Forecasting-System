import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // "Field ledger" palette — earthy, warm, refined.
        paper: "#F5F1E6", // warm ivory-paper background
        ink: "#221D14", // warm near-black text
        canopy: "#4C7A3D", // primary growth green
        canopyDeep: "#35592A",
        wheat: "#D9A441", // data/metric accent
        clay: "#B5502E", // sparing alert/warning tone
        horizonTop: "#8C6A3F", // topsoil band
        horizonMid: "#5E4A31", // subsoil band
        horizonLow: "#33301F", // bedrock band
        line: "#E3DBC6", // hairline dividers
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [],
};
export default config;
