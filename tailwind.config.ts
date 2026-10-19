import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        page: "var(--page-background)",
        surface: "var(--surface)",
        navy: "var(--primary-navy)",
        "deep-navy": "var(--deep-navy)",
        teal: "var(--brand-teal)",
        "dark-teal": "var(--dark-teal)",
        "light-teal": "var(--light-teal)",
        orange: "var(--brand-orange)",
        "light-orange": "var(--light-orange)",
        ink: "var(--main-text)",
        "muted-ink": "var(--muted-text)",
        "brand-border": "var(--neutral-border)",
        error: "var(--error)",
        whatsapp: "var(--whatsapp)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
