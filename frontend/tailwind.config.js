/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      backgroundImage: {
        "gradient-custom":
          "linear-gradient(135deg, #003747 0%, #0b829c 50%, #0b829c 75%,  	#003747 100%)",
        "gradient-nav":
          "linear-gradient(135deg, rgba(10, 48, 59, 0.9) 0%, rgba(59, 106, 116, 0.9) 50%, rgba(11, 130, 156, 0.9) 75%, rgba(18, 80, 99, 0.9) 100%)",

        "gradient-footer":
          "linear-gradient(135deg, rgba(11, 130, 156, 0.9) 0%, rgba(59, 106, 116, 0.9) 20%,rgba(17, 78, 97, 0.9) 25%, rgba(11, 130, 156, 0.9) 50%, rgba(59, 106, 116, 0.9) 75%, rgba(10, 48, 59, 0.9) 100%)",

        "gradient-focus":
          "linear-gradient(135deg, rgba(53, 105, 119, 0.9) 0%, rgba(47, 84, 92, 0.9) 50%, rgba(11, 130, 156, 0.9) 75%, rgba(62, 104, 117, 0.9) 100%)",
        "gradient-signup":
          "linear-gradient(135deg, #278080 0%, #2a8888 50%, #197275 75%,	#27817d 100%)",
        "gradient-signuphover":
          "linear-gradient(135deg, #339b9b 0%, #34bbbb 50%, #33999c 75%,	#26a39d 100%)",
        "gradient-loginform":
          "linear-gradient(135deg, rgba(14, 79, 100, 0.7) 0%, rgba(24, 106, 124, 0.7) 25%, rgba(18, 108, 128, 0.7) 25%, rgba(13, 69, 87, 0.7) 100%)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
