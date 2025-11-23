import type { Config } from 'tailwindcss'
import tailwindTypography from '@tailwindcss/typography'

export default <Partial<Config>>{
  content: [
    './app/**/*.{js,ts,vue}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode surface colors
        surface: {
          light: {
            DEFAULT: '#ffffff',
            secondary: '#f8fafc',
            tertiary: '#f1f5f9',
          },
          // Dark mode surface colors
          dark: {
            DEFAULT: '#030712',
            secondary: '#111827',
            tertiary: '#1f2937',
          },
        },
      },
    },
  },
  plugins: [tailwindTypography]
}