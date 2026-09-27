class StudentRegistrationPage {
  selectors = {
    form: "#student-form",
    identification: "#identification",
    firstName: "#first-name",
    lastName: "#last-name",
    email: "#email",
    country: "#country",
    career: "#career",
    birthDate: "#birth-date",
    age: "#age",
    clearButton: "#clear-button",
    submitButton: "#student-form button[type='submit']",
    status: "#status-message",
    studentRows: "#student-list tr",
    studentCount: "#student-count",
    emptyState: "#empty-state",
    formGrid: ".form-grid"
  };

  fieldError(field) {
    const errorIds = {
      identification: "identification-error",
      firstName: "first-name-error",
      lastName: "last-name-error",
      email: "email-error",
      country: "country-error",
      career: "career-error",
      birthDate: "birth-date-error"
    };
    return cy.get(`#${errorIds[field]}`);
  }

  visit() {
    cy.visit("/");
    cy.wait("@listStudents");
  }

  fillStudent(student) {
    cy.get(this.selectors.identification).clear().type(student.identification);
    cy.get(this.selectors.firstName).clear().type(student.firstName);
    cy.get(this.selectors.lastName).clear().type(student.lastName);
    cy.get(this.selectors.email).clear().type(student.email);
    cy.get(this.selectors.country).clear().type(student.country);
    cy.get(this.selectors.career).select(student.career);
    cy.get(this.selectors.birthDate).clear().type(student.birthDate);
  }

  submit() {
    cy.get(this.selectors.submitButton).click();
  }

  clear() {
    cy.get(this.selectors.clearButton).click();
  }

  rowCells(rowIndex = 0) {
    return cy.get(this.selectors.studentRows).eq(rowIndex).find("td");
  }

  calculateAge(isoDate, today = new Date()) {
    const [year, month, day] = isoDate.split("-").map(Number);
    let age = today.getFullYear() - year;
    if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) age -= 1;
    return age;
  }

  localIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

module.exports = new StudentRegistrationPage();