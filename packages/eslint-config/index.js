module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],

  parser: "@typescript-eslint/parser",

  ignorePatterns: ['.eslintrc.js'],

  plugins: ["@typescript-eslint/eslint-plugin"],

  root: true,
};
