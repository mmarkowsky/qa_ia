const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
  e2e: {
    baseUrl: "http://127.0.0.1:3000",
    specPattern: "tests/frontend/**/*.cy.js",
    supportFile: "tests/frontend/e2e.js",
    viewportWidth: 1280,
    viewportHeight: 900
  }
});