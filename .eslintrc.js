module.exports = {
	env: {
		browser: true,
		es6: true,
		"jest/globals": true
	},
	extends: "eslint:recommended",
	plugins: ["prettier", "jest"],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly"
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module"
	},
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		complexity: ["error", 5],
		"max-depth": ["warn", 4],
		"max-statements": ["warn", 10]
	},
	overrides: [
		{
			files: ["babel.config.js", "jest.config.js"],
			rules: {
				"no-undef": "off"
			}
		}
	]
};
