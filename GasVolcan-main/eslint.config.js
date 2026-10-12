import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // docs/legacy es el código HTML+JS original: se conserva como referencia, no se revisa.
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results', 'docs']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Archivos que se ejecutan en Node (configuración y pruebas E2E con Playwright).
    files: ['*.config.js', 'e2e/**/*.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // Los archivos de prueba no exportan componentes, así que no aplica esta regla.
    files: ['**/*.test.{js,jsx}'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
