import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        // Primary Palette
        "lex-navy": "var(--lex-navy)",
        "lex-gold": "var(--lex-gold)",
        "lex-steel": "var(--lex-steel)",
        "lex-smoke": "var(--lex-smoke)",
        // Extended Palette
        "lex-gold-light": "var(--lex-gold-light)",
        "lex-slate": "var(--lex-slate)",
        "lex-indigo": "var(--lex-indigo)",
        "lex-silver": "var(--lex-silver)",
        "lex-ash": "var(--lex-ash)",
        // Semantic Colours
        "lex-success": "var(--lex-success)",
        "lex-warning": "var(--lex-warning)",
        "lex-error": "var(--lex-error)",
        "lex-info": "var(--lex-info)",
        "lex-teal": "var(--lex-teal)",
        // Admin Dashboard Palette
        "lex-obsidian": "var(--lex-obsidian)",
        "lex-admin-dark": "var(--lex-admin-dark)",
        "lex-panel-bg": "var(--lex-panel-bg)",
        "lex-content-area": "var(--lex-content-area)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-lato)", "system-ui", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
        tabular: ["var(--font-lato)", "system-ui", "sans-serif"], // Assuming tabular nums applied via font-variant-numeric
      },
      transitionTimingFunction: {
        "lex-enter": "cubic-bezier(0.0, 0.0, 0.2, 1)",
        "lex-exit": "cubic-bezier(0.4, 0, 1, 1)",
        "lex-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
        "lex-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "lex-slow": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      transitionDuration: {
        "instant": "50ms",
        "fast": "150ms",
        "normal": "250ms",
        "slow": "400ms",
        "slower": "600ms",
        "dramatic": "900ms", // 900ms - 1200ms
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
