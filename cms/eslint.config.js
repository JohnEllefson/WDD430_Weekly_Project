// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-config-prettier");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettier, // disables formatting rules
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "prettier/prettier": "error", // show Prettier issues as ESLint errors
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "cms",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "cms",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/prefer-standalone": "off"
    },
  },
  {
    files: ["**/*.html"],
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "prettier/prettier": "error",
    },
  }
);
