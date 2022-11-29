export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'primary-dark',
    values: [
      {
        name: 'primary-dark',
        value: "#373c50"
      },
      {
        name: "light",
        value: "#9ea2b5"
      }
    ]
  }
}