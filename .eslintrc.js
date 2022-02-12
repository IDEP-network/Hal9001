module.exports = {
  parser:  "@typescript-eslint/parser",
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin',  "@typescript-eslint",
  "airbnb-typescript/base"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      "airbnb",
      "airbnb-typescript"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-var': ['error'],
    'prefer-destructuring': ['warn']
  }
  }