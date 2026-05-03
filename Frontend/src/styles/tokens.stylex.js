import * as stylex from "@stylexjs/stylex"

// Design tokens — single source of truth for colors, spacing, radii, shadows
export const tokens = stylex.defineVars({
  // Brand
  colorRed600:   "#dc2626",
  colorRed700:   "#b91c1c",
  colorRed500:   "#ef4444",
  colorRed50:    "#fef2f2",
  colorRed100:   "#fee2e2",
  colorRed300:   "#fca5a5",

  // Neutrals
  colorBlack:    "#000000",
  colorGray900:  "#111827",
  colorGray800:  "#1f2937",
  colorGray700:  "#374151",
  colorGray600:  "#4b5563",
  colorGray500:  "#6b7280",
  colorGray400:  "#9ca3af",
  colorGray300:  "#d1d5db",
  colorGray200:  "#e5e7eb",
  colorGray100:  "#f3f4f6",
  colorGray50:   "#f9fafb",
  colorWhite:    "#ffffff",

  // Blue (external news accent)
  colorBlue600:  "#2563eb",
  colorBlue700:  "#1d4ed8",
  colorBlue100:  "#dbeafe",
  colorBlue50:   "#eff6ff",
  colorBlue300:  "#93c5fd",

  // Green
  colorGreen600: "#16a34a",
  colorGreen700: "#15803d",
  colorGreen100: "#dcfce7",
  colorGreen50:  "#f0fdf4",
  colorGreen400: "#4ade80",

  // Yellow
  colorYellow100: "#fef9c3",
  colorYellow300: "#fde047",
  colorYellow800: "#854d0e",

  // Orange
  colorOrange500: "#f97316",
  colorOrange600: "#ea580c",
  colorOrange50:  "#fff7ed",

  // Purple
  colorPurple500: "#a855f7",
  colorPurple600: "#9333ea",
  colorPurple50:  "#faf5ff",

  // Spacing
  space1:  "4px",
  space2:  "8px",
  space3:  "12px",
  space4:  "16px",
  space5:  "20px",
  space6:  "24px",
  space8:  "32px",
  space10: "40px",
  space12: "48px",
  space16: "64px",
  space20: "80px",

  // Radii
  radiusSm:   "6px",
  radiusMd:   "8px",
  radiusLg:   "12px",
  radiusXl:   "16px",
  radius2xl:  "20px",
  radius3xl:  "24px",
  radiusFull: "9999px",

  // Shadows
  shadowSm:  "0 1px 2px 0 rgba(0,0,0,0.05)",
  shadowMd:  "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
  shadowLg:  "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
  shadowXl:  "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",

  // Typography
  textXs:   "12px",
  textSm:   "14px",
  textBase: "16px",
  textLg:   "18px",
  textXl:   "20px",
  text2xl:  "24px",
  text3xl:  "30px",
  text4xl:  "36px",
  text5xl:  "48px",
  text6xl:  "60px",

  fontWeightNormal:    "400",
  fontWeightMedium:    "500",
  fontWeightSemibold:  "600",
  fontWeightBold:      "700",
  fontWeightExtrabold: "800",

  lineHeightTight:  "1.25",
  lineHeightNormal: "1.5",
  lineHeightRelaxed:"1.625",
})
