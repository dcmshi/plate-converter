/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Barbell hardware, iron plates and accents. These were inline hex values
      // duplicating the zinc ramp; kg plate colours stay in constants.ts because
      // they are Eleiko's published colour standard, not a design choice.
      colors: {
        bar: {
          collar: '#71717a',
          shaft:  '#52525b',
          endcap: '#3f3f46',
          shelf:  '#52525b',
        },
        plate: {
          iron:  '#52525b',
          rim:   '#71717a',
          label: '#d4d4d8',
        },
        accent: {
          exact:   '#fbbf24',
          success: '#34d399',
        },
      },
    },
  },
  plugins: [],
}
