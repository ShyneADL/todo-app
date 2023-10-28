/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,jsx}"],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        brightBlue: "hsl(220, 98%, 61%)",
        checkBackground: "linear-gradient(hsl(192, 100%, 67%), hsl(280, 87%, 65%))",
        // ### Light Theme
        veryLightGray: "hsl(0, 0%, 98%)",
        veryLightGrayishBlue: "hsl(236, 33%, 92%)",
        lightGrayishBlue: "hsl(233, 11%, 84%)",
        darkGrayishBlue: "hsl(236, 9%, 61%)",
        veryDarkGrayishBlue: "hsl(235, 19%, 35%)",
        // ### Dark Theme
        veryDarkBlue: "hsl(235, 21%, 11%)",
        veryDarkDesaturatedBlue: "hsl(235, 24%, 19%)",
        lightGrayishBlue2: "hsl(234, 39%, 85%)",
        lightGrayishBlueHover: "hsl(236, 33%, 92%)",
        darkGrayishBlue2: "hsl(234, 11%, 52%)",
        veryDarkGrayishBlue1: "hsl(233, 14%, 35%)",
        veryDarkGrayishBlue2: "hsl(237, 14%, 26%)",
      },
    },
  },
  plugins: [],
};