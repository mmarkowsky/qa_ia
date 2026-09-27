const studentRegistrationPage = require("./pages/student-registration-page");

Cypress.Commands.add("fillStudentForm", (overrides = {}) => {
  studentRegistrationPage.fillStudent({
    identification: "QA-20260925",
    firstName: "María José",
    lastName: "Muñoz Pérez",
    email: "maria.jose@example.edu",
    country: "Colombia",
    career: "Ing. Informática",
    birthDate: "2000-01-01",
    ...overrides
  });
});

Cypress.Commands.add("stubStudentList", (students = []) => {
  cy.intercept("GET", "**/api/students", {
    statusCode: 200,
    body: students
  }).as("listStudents");
});

Cypress.Commands.add("stubStudentCreation", () => {
  cy.intercept("POST", "**/api/students", request => {
    request.reply({
      statusCode: 201,
      body: {
        ...request.body,
        id: "cypress-student",
        age: studentRegistrationPage.calculateAge(request.body.birthDate)
      }
    });
  }).as("createStudent");
});