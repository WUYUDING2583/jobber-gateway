import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "**/logs",
    "**/*.log",
    "**/npm-debug.log*",
    "**/yarn-debug.log*",
    "**/yarn-error.log*",
    "**/lerna-debug.log*",
    "**/.pnpm-debug.log*",
    "**/report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json",
    "**/pids",
    "**/*.pid",
    "**/*.seed",
    "**/*.pid.lock",
    "**/lib-cov",
    "**/coverage",
    "**/*.lcov",
    "**/.nyc_output",
    "**/.grunt",
    "**/bower_components",
    "**/.lock-wscript",
    "build/Release",
    "**/node_modules/",
    "**/jspm_packages/",
    "**/web_modules/",
    "**/*.tsbuildinfo",
    "**/.npm",
    "**/.eslintcache",
    "**/.stylelintcache",
    "**/.rpt2_cache/",
    "**/.rts2_cache_cjs/",
    "**/.rts2_cache_es/",
    "**/.rts2_cache_umd/",
    "**/.node_repl_history",
    "**/*.tgz",
    "**/.yarn-integrity",
    "**/.env",
    "**/.env.development.local",
    "**/.env.test.local",
    "**/.env.production.local",
    "**/.env.local",
    "**/.cache",
    "**/.parcel-cache",
    "**/.next",
    "**/out",
    "**/.nuxt",
    "**/dist",
    "**/.cache/",
    ".vuepress/dist",
    "**/.temp",
    "**/.docusaurus",
    "**/.serverless/",
    "**/.fusebox/",
    "**/.dynamodb/",
    "**/.tern-port",
    "**/.vscode-test",
    ".yarn/cache",
    ".yarn/unplugged",
    ".yarn/build-state.yml",
    ".yarn/install-state.gz",
    "**/.pnp.*",
    "**/.webpack/",
    "**/.svelte-kit",
    "**/Dockerfile",
    "**/Dockerfile.dev",
    "**/.dockerignore",
    "**/.npmrc",
    "**/Jenkinsfile",
]), {
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
    )),

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        "no-multiple-empty-lines": [2, {
            max: 2,
        }],

        semi: [2, "always"],
        curly: ["warn"],
        "prefer-template": ["warn"],

        "space-before-function-paren": [0, {
            anonymous: "always",
            named: "always",
        }],

        camelcase: 0,
        "no-return-assign": 0,
        quotes: ["error", "single"],
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "import/no-unresolved": 0,

        "import/order": ["warn", {
            groups: [
                "builtin",
                "external",
                "internal",
                "parent",
                "sibling",
                "index",
                "type",
                "object",
            ],

            "newlines-between": "always",
        }],
    },
}]);