const studentPage = require("./pages/student-registration-page");

describe("Registro académico de estudiantes", () => {
  beforeEach(() => {
    cy.stubStudentList();
    studentPage.visit();
  });

  it("muestra los campos obligatorios, carreras, edad de solo lectura y las ocho columnas de la tabla", () => {
    const fields = ["identification", "firstName", "lastName", "email", "country", "career", "birthDate"];
    fields.forEach(field => cy.get(studentPage.selectors[field]).should("have.attr", "required"));
    cy.get(studentPage.selectors.age).should("have.attr", "readonly");
    cy.get(studentPage.selectors.age).should("have.value", "—");
    cy.get(studentPage.selectors.career).find("option").then(options => {
      expect([...options].map(option => option.textContent.trim())).to.deep.equal([
        "Selecciona una carrera",
        "Ing. Informática",
        "Ing. Electrónica",
        "Ing. Telecomunicaciones",
        "Ing. Robótica",
        "Otra"
      ]);
    });
    cy.get("table thead th").should("have.length", 8);
    cy.get("#status-message").should("have.attr", "aria-live", "polite");
    cy.get(studentPage.selectors.emptyState).should("be.visible");
  });

  it("muestra un error accesible en cada campo requerido y no envía datos inválidos", () => {
    cy.intercept("POST", "**/api/students").as("createStudent");
    studentPage.submit();

    ["identification", "firstName", "lastName", "email", "country", "career", "birthDate"].forEach(field => {
      studentPage.fieldError(field).should("not.be.empty");
      cy.get(studentPage.selectors[field]).should("have.attr", "aria-invalid", "true");
    });
    cy.get(studentPage.selectors.status).should("contain.text", "Revisa los campos");
    cy.get(studentPage.selectors.studentRows).should("not.exist");
    cy.get("@createStudent.all").should("have.length", 0);
  });

  it("rechaza identificaciones cortas o con caracteres no permitidos", () => {
    cy.intercept("POST", "**/api/students").as("createStudent");
    cy.fillStudentForm({ identification: "A_12" });
    studentPage.submit();
    studentPage.fieldError("identification").should("contain.text", "solo letras, números o guiones");
    cy.get(studentPage.selectors.identification).clear().type("A123");
    studentPage.submit();
    studentPage.fieldError("identification").should("contain.text", "al menos 5 caracteres");
    cy.get(studentPage.selectors.studentRows).should("not.exist");
    cy.get("@createStudent.all").should("have.length", 0);
  });

  it("acepta nombres con tildes y ñ, y rechaza números en nombre o apellido", () => {
    cy.fillStudentForm({ firstName: "María José", lastName: "Muñoz" });
    cy.get(studentPage.selectors.firstName).focus().blur();
    studentPage.fieldError("firstName").should("be.empty");
    cy.get(studentPage.selectors.lastName).clear().type("Pérez2").blur();
    studentPage.fieldError("lastName").should("contain.text", "solo puede contener letras");
  });

  it("valida el formato del correo electrónico", () => {
    cy.fillStudentForm({ email: "correo-invalido" });
    studentPage.submit();
    studentPage.fieldError("email").should("contain.text", "correo electrónico válido");
  });

  it("calcula la edad al cambiar la fecha y limpia la edad para una fecha futura", () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 20);
    const birthDate = studentPage.localIsoDate(birthday);
    cy.get(studentPage.selectors.birthDate).type(birthDate);
    cy.get(studentPage.selectors.age).should("have.value", "20");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    cy.get(studentPage.selectors.birthDate).clear().type(studentPage.localIsoDate(tomorrow));
    cy.get(studentPage.selectors.age).should("have.value", "—");
    studentPage.fieldError("birthDate").should("contain.text", "no puede ser futura");
  });

  it("registra un estudiante válido, anuncia el éxito y agrega las ocho columnas", () => {
    cy.stubStudentCreation();
    cy.fillStudentForm();
    studentPage.submit();

    cy.wait("@createStudent").its("request.body").should("include", {
      identification: "QA-20260925",
      firstName: "María José",
      lastName: "Muñoz Pérez",
      email: "maria.jose@example.edu",
      country: "Colombia",
      career: "Ing. Informática",
      birthDate: "2000-01-01"
    });
    cy.get(studentPage.selectors.status).should("have.attr", "class").and("include", "success");
    cy.get(studentPage.selectors.status).should("contain.text", "registrado correctamente");
    cy.get(studentPage.selectors.studentCount).should("have.text", "1");
    studentPage.rowCells().should("have.length", 8).then(cells => {
      expect([...cells].map(cell => cell.textContent.trim())).to.deep.equal([
        "QA-20260925",
        "María José",
        "Muñoz Pérez",
        "maria.jose@example.edu",
        "Colombia",
        "Ing. Informática",
        "01/01/2000",
        String(studentPage.calculateAge("2000-01-01"))
      ]);
    });
  });

  it("impide registrar una identificación duplicada, ignorando mayúsculas", () => {
    cy.stubStudentList([{
      id: "existing-1",
      identification: "QA-20260925",
      firstName: "María",
      lastName: "Pérez",
      email: "existing@example.edu",
      country: "Chile",
      career: "Ing. Robótica",
      birthDate: "2000-01-01",
      age: 26
    }]);
    studentPage.visit();
    cy.intercept("POST", "**/api/students").as("createStudent");
    cy.fillStudentForm({ identification: "qa-20260925", email: "new@example.edu" });
    studentPage.submit();
    studentPage.fieldError("identification").should("contain.text", "ya está registrada");
    cy.get(studentPage.selectors.studentRows).should("have.length", 1);
    cy.get("@createStudent.all").should("have.length", 0);
  });

  it("impide registrar un correo duplicado, ignorando mayúsculas", () => {
    cy.stubStudentList([{
      id: "existing-2",
      identification: "EXIST-12345",
      firstName: "Ana",
      lastName: "López",
      email: "maria.jose@example.edu",
      country: "Perú",
      career: "Ing. Electrónica",
      birthDate: "2001-01-01",
      age: 25
    }]);
    studentPage.visit();
    cy.intercept("POST", "**/api/students").as("createStudent");
    cy.fillStudentForm({ identification: "NEW-12345", email: "MARIA.JOSE@example.edu" });
    studentPage.submit();
    studentPage.fieldError("email").should("contain.text", "ya está registrado");
    cy.get(studentPage.selectors.studentRows).should("have.length", 1);
    cy.get("@createStudent.all").should("have.length", 0);
  });

  it("limpia campos, errores y mensajes sin borrar los registros", () => {
    cy.stubStudentCreation();
    cy.fillStudentForm();
    studentPage.submit();
    cy.wait("@createStudent");
    cy.get(studentPage.selectors.studentRows).should("have.length", 1);

    cy.get(studentPage.selectors.identification).type("bad_").blur();
    studentPage.fieldError("identification").should("not.be.empty");
    cy.get(studentPage.selectors.status).should("be.visible");
    studentPage.clear();

    cy.get(studentPage.selectors.form).find("input:not([readonly])").each(input => cy.wrap(input).should("have.value", ""));
    cy.get(studentPage.selectors.career).should("have.prop", "selectedIndex", 0);
    cy.get(studentPage.selectors.age).should("have.value", "—");
    cy.get(studentPage.selectors.status).should("not.have.class", "visible");
    studentPage.fieldError("identification").should("be.empty");
    cy.get(studentPage.selectors.studentRows).should("have.length", 1);
  });

  it("mantiene el formulario usable y sin desbordamiento horizontal en móvil", () => {
    cy.viewport(375, 812);
    cy.get(studentPage.selectors.formGrid).should("be.visible").then(grid => {
      const columns = getComputedStyle(grid[0]).gridTemplateColumns.split(" ");
      expect(columns).to.have.length(1);
    });
    cy.get(studentPage.selectors.submitButton).should("be.visible");
    cy.get("body").should(element => {
      expect(element[0].scrollWidth).to.be.at.most(Cypress.config("viewportWidth"));
    });
  });
});