module.exports = {
  root: true, // Make sure eslint picks up the config at the root of the directory
  env: {
    commonjs: true,
    amd: true, // Enables require() and define() as global variables as per the amd spec.
    node: true, // Enables Node.js global variables and Node.js scoping.
    es2021: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2021, // Use the latest ecmascript standard
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],

  rules: {
    'node/no-unpublished-import': 'off',
    'eslint/explicit-module-boundary-types': 'off',
    'eslint/no-explicit-any': 'off',
    'eslint/ban-ts-comment': 'off',

    'object-shorthand': ['warn', 'always'],

    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-named-as-default': 'off',

    'node/exports-style': ['error', 'module.exports'],
    'node/file-extension-in-import': ['error', 'always', { '.js': 'never', '.ts': 'never' }],
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/console': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'node/prefer-global/url-search-params': ['error', 'always'],
    'node/prefer-global/url': ['error', 'always'],
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        version: '>=14.0.0',
        ignores: ['modules'],
      },
    ],
    'node/no-missing-import': 'off', // because there is issue for new JS standard

    'no-nested-ternary': 'warn',
    'no-underscore-dangle': 'off', // because mongoDb
    'no-async-promise-executor': 'warn',
    'no-prototype-builtins': 'off',
    'no-plusplus': 'off',
    'no-return-assign': 'warn',
    'no-var': 'error',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    //! Only for development
    // 'no-console': 'off',

    'no-unused-vars': 'off',
    'node/no-extraneous-import': 'off',
  },
};
