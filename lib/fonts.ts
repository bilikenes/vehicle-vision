import localFont from "next/font/local";

/**
 * Temporary display source approved for development in docs/DECISIONS.md.
 * Replace this one path when the final licensed display asset is selected.
 */
export const displayFont = localFont({
  src: "../public/fonts/temporary/eclipse-space-display.woff2",
  display: "swap",
  fallback: ["Arial Narrow", "Helvetica Neue", "sans-serif"],
  variable: "--font-display",
  weight: "400",
});
