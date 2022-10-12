const fs = require('fs')

const folders = fs
  .readdirSync('.', { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

const isCI = process.env.CI === 'true'
const isDev = !isCI && process.env.NODE_ENV === 'development'
const severity = isDev ? 'warn' : 'error'

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:editorconfig/all',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'plugin:@next/next/recommended',
  ],
  plugins: [
    'editorconfig',
    'immer',
    'simple-import-sort',
    'import',
    'prettier',
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    semi: ['error', 'never'],
    curly: ['error', 'multi-line'],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsForRegex: ['^draft', 'state'],
      },
    ],

    'react/jsx-wrap-multilines': [
      'error',
      {
        prop: 'ignore',
      },
    ],
    'react/jsx-props-no-spreading': 0,
    'react/state-in-constructor': ['error', 'never'],
    'react/function-component-definition': [
      'error', {
        namedComponents: ['arrow-function', 'function-declaration', 'function-expression'],
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/prop-types': 0,
    'react/require-default-props': 0,

    'prettier/prettier': severity,

    'immer/no-update-map': 'error',

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/extensions': 0,
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        'simple-import-sort/imports': [
          severity,
          {
            groups: [
              // Side effect imports.
              ['^\\u0000'],
              // Packages. `react` related packages come first.
              // Things that start with a letter (or digit or underscore), or `@` followed by a
              // letter.
              ['^react', '^vue', '^@?\\w'],
              // Absolute imports and Relative imports.
              [`^(${folders.join('|')})(/.*|$)`, '^\\.'],
              // Relative imports.
              // Anything that starts with a dot.
              ['^\\.'],
            ],
          },
        ],
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {},
    },
  },
}
