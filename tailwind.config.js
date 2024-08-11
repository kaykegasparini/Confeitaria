/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans': ['Roboto, sans-serif'],
      'Bebas-Neue': ['Bebas Neue, sans-serif'],
      'Oswald': ['Oswald, sans-serif'],
    },
    extend: {
      backgroundImage:{
        "bgHome": "url('./assets/bg.png')"
      },
      colors: {
          "rosa-claro": "#FADADD",
          "azul-bebê": "#A6C1EE",
          "verde-menta": "#B5EAD7",
          "amarelo-claro": "#FFF4CC",
          "vermelho-cereja": "#E63946",
          'coral': '#FF6F61',
      }
    },
  },
  plugins: [],
}

