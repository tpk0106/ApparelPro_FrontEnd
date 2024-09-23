/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#881A55",
        "Antique-bronze": "#665d1e",
        "ligh-white": "#rgb(255,25,,255,0.18)",
      },
    },
    borderColor: (theme) => ({
      ...theme("colors"),
      // default: theme("colors.gray.300", "currentColor"),
      primary: "#996666",
      secondary: "#ffed4a",
      danger: "#e3342f",
    }),
    backgroundColor: (theme) => ({
      ...theme("colors"),
      // default: theme("colors.gray.300", "currentColor"),
      primary: "#996666",
      secondary: "#ffed4a",
      danger: "#e3342f",
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      // default: theme("colors.gray.300", "currentColor"),
      primary: "#000000",
      secondary: "#ffed4a",
      danger: "#e3342f",
    }),
  },
  plugins: [],
  corePlugins: { preflight: false }, // to disable iailwind and enable primeng
  // prefix: "tw-",
};
