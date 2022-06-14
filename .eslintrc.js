module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
  rules: {
    'no-console':
      import.meta.process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': import.meta.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
