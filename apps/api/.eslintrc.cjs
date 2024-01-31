module.exports = {
  extends: '@adonisjs/eslint-config/app',
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
}
