// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginImport from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: eslintPluginImport,
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/order': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. node 内置模块
            ['^node:', '^dotenv/config$'],

            // 2. nest 和第三方包
            ['^@nestjs(/.*)?$', '^@?\\w'],

            // 3. 项目内部绝对导入 / 路径别名
            ['^src/', '^@/'],

            // 4. parent imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

            // 5. sibling / index imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
