module.exports = {
  extends: ['plugin:adonis/typescriptApp', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
  },
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
}
