// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...storybook.configs["flat/recommended"],
  {
    rules: {
      // Change these from errors to warnings to avoid build failures
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off", 
      "react/no-unescaped-entities": "warn",
      "jsx-a11y/alt-text": "warn",
      // Disable the problematic rules that's causing context.getScope errors
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/no-var-requires": "off",
      // Make other warnings non-blocking
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  {
    files: ["components/ui/*.tsx"],
    rules: {
      // Disable newer TypeScript ESLint rules that are not available in this version for UI components
      "@typescript-eslint/no-empty-object-type": "off"
    }
  }
];

export default eslintConfig;
