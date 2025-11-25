module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "error",
    "no-redeclare": "error",
    "react/react-in-jsx-scope": "off", // DESATIVA a necessidade de importar React
  },
  settings: {
    react: {
      version: "detect", // detecta automaticamente a versão do React
    }
  }
};
