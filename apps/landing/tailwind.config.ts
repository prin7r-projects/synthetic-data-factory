import type { Config } from "tailwindcss";

/**
 * [FOUNDRY7_TAILWIND] Locked tokens for the synthetic-data-factory landing.
 * Source of truth for the Mintset palette + type pair. Mirrored in
 * `app/globals.css` and documented in /DESIGN.md sections 4-6.
 *
 * Brand: precision foundry / steel mill / laboratory
 * Palette: graphite + slag + sodium + ember + cool-steel + signal-yellow
 * Type: Inter Display (display) + Inter (body) + JetBrains Mono (schema)
 */

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", md: "2.5rem" }
    },
    extend: {
      colors: {
        // Surfaces
        graphite: "#0E1013",
        slag: "#1A1D22",
        billet: "#22262C",
        // Sodium-white paper
        sodium: "#FAFAF8",
        "sodium-2": "#F0EFEC",
        // Inks
        ink: "#0E1013",
        "ink-2": "#3A3F47",
        ash: "#7E8A95",
        // Signals
        ember: "#E25822",     // carbon-orange = primary action / heat
        "ember-2": "#B7401C", // pressed
        flux: "#F2C94C",      // signal-yellow = caution / live indicator
        weld: "#3FA48A",      // verified / pass
        scarlet: "#C03A3A"    // error / fail
      },
      fontFamily: {
        display: ["'Inter Display'", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "Menlo", "monospace"]
      },
      maxWidth: {
        prose: "1200px"
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        md: "4px",
        full: "9999px"
      },
      boxShadow: {
        masthead: "0 1px 0 0 rgba(14,16,19,.08)",
        chip: "inset 0 0 0 1px rgba(14,16,19,.12)",
        emberglow: "0 0 0 1px #E25822, 0 0 24px -6px #E25822aa"
      },
      letterSpacing: {
        tightest: "-0.018em",
        ledger: "0.18em",
        stencil: "0.22em"
      },
      fontSize: {
        display: ["108px", { lineHeight: "0.94", letterSpacing: "-0.024em" }],
        masthead: ["56px", { lineHeight: "1.0", letterSpacing: "-0.014em" }],
        runner: ["13px", { lineHeight: "1.2", letterSpacing: "0.18em" }]
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".35" }
        },
        flow: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "32px 0" }
        }
      },
      animation: {
        pulse: "pulse 1.6s ease-in-out infinite",
        flow: "flow 1.8s linear infinite"
      },
      backgroundImage: {
        "tape-orange":
          "repeating-linear-gradient(135deg, #E25822 0 12px, #0E1013 12px 24px)"
      }
    }
  },
  plugins: []
};

export default config;
