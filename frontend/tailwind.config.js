module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          800: "#1e2029", // Dark background color
          600: "#4b5563", // Border color
        },
        blue: {
          500: "#3b82f6", // Focus ring color
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
