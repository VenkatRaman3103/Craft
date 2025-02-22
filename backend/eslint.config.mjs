import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: {
            parser: tsParser,
            globals: globals.node,
        },
        plugins: { "@typescript-eslint": tseslint },
        rules: {
            ...pluginJs.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" },
            ],
            "no-console": "off",
        },
    },
];
