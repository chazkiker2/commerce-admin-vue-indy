module.exports = {
    root: true,
    env: { node: true },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
        "plugin:vue/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended",
        "prettier",
    ],
    rules: {
        "prettier/prettier": "warn",
        "vue/html-indent": [
            "error",
            4,
            {
                baseIndent: 1,
                alignAttributesVertically: true,
            },
        ],
        "vue/script-indent": [
            "error",
            4,
            {
                baseIndent: 1,
            },
        ],
        "vue/script-setup-uses-vars": "error",
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
    overrides: [
        {
            files: ["*.vue"],
        },
    ],
};
