/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        border: "#F5F5F5",
        input: "#F5F5F5",
        ring: "#F7A600",
        background: "#FFFFFF",
        foreground: "#212121",
        primary: {
          DEFAULT: "#F7A600",
          foreground: "#FFFFFF",
          hover: "#E69500",
        },
        secondary: {
          DEFAULT: "#212121",
          foreground: "#FFFFFF",
          hover: "#333333",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "#F5F5F5",
          foreground: "#212121",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#212121",
        },
        card: {
          DEFAULT: "#FAFAFA",
          foreground: "#212121",
        },
        status: {
          active: "#2ECC71",
          pending: "#F39C12",
          coming: "#2980B9",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
