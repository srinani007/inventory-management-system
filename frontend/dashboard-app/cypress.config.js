import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // match your Vite dev URL
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,          // or true if you have a support file
  },
})
