module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins: ['compat', 'import'],
  extends: ['standard', 'plugin:compat/recommended', 'plugin:import/recommended'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }],
    'import/extensions': ['error', 'always'],
    'import/no-unresolved': ['error', { ignore: ['^https://cdn\\.skypack\\.dev/pin'] }]
  }
}
