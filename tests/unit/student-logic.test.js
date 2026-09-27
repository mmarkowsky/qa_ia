const test = require("node:test");
const assert = require("node:assert/strict");
const logic = require("../../src/shared/student-logic.js");

const today = new Date(2026, 8, 25);
const validStudent = {
  identification: "AB-12345",
  firstName: "José María",
  lastName: "Muñoz",
  email: "jose@example.edu",
  country: "Colombia",
  career: "Ing. Informática",
  birthDate: "2000-09-25"
};

test("identification is required and accepts alphanumeric values and hyphens from 5 characters", async t => {
  await t.test("accepts an alphanumeric identification", () => {
    assert.equal(logic.validateIdentification("AB-12345"), "");
  });
  await t.test("rejects an empty identification", () => {
    assert.match(logic.validateIdentification("  "), /obligatorio|Ingresa/);
  });
  await t.test("rejects values shorter than 5 characters", () => {
    assert.match(logic.validateIdentification("A123"), /5 caracteres/);
  });
  await t.test("rejects symbols outside the allowed format", () => {
    assert.match(logic.validateIdentification("AB_123"), /solo letras, números o guiones/);
  });
});

test("names require at least two letters and support accents, spaces, apostrophes and hyphens", async t => {
  await t.test("accepts accented Spanish names", () => {
    assert.equal(logic.validatePersonName("José María", "El nombre"), "");
    assert.equal(logic.validatePersonName("Muñoz-Pérez", "El apellido"), "");
  });
  await t.test("rejects missing, short, and numeric names", () => {
    assert.notEqual(logic.validatePersonName("", "El nombre"), "");
    assert.match(logic.validatePersonName("A", "El nombre"), /2 caracteres/);
    assert.match(logic.validatePersonName("Ana2", "El nombre"), /solo puede contener/);
  });
});

test("email requires a valid address", () => {
  assert.equal(logic.validateEmail("ana@example.edu"), "");
  assert.notEqual(logic.validateEmail(""), "");
  assert.match(logic.validateEmail("ana@correo"), /válido/);
});

test("country and career are required and career must be an available option", () => {
  assert.notEqual(logic.validateRequired("", "Ingresa el país."), "");
  assert.equal(logic.validateRequired("Chile", "Ingresa el país."), "");
  assert.notEqual(logic.validateCareer(""), "");
  assert.notEqual(logic.validateCareer("Medicina"), "");
  for (const career of logic.careers) assert.equal(logic.validateCareer(career), "");
});

test("birth date rejects missing, malformed, impossible and future dates", async t => {
  await t.test("rejects an empty date", () => {
    assert.notEqual(logic.validateBirthDate("", today), "");
  });
  await t.test("rejects malformed and impossible dates", () => {
    assert.notEqual(logic.validateBirthDate("25/09/2000", today), "");
    assert.notEqual(logic.validateBirthDate("2001-02-29", today), "");
  });
  await t.test("rejects a date after today and accepts today", () => {
    assert.match(logic.validateBirthDate("2026-09-26", today), /no puede ser futura/);
    assert.equal(logic.validateBirthDate("2026-09-25", today), "");
  });
});

test("age calculation respects whether the birthday has occurred this year", () => {
  assert.equal(logic.calculateAge(new Date(2000, 8, 25), today), 26);
  assert.equal(logic.calculateAge(new Date(2000, 8, 26), today), 25);
  assert.equal(logic.calculateAge(new Date(2000, 8, 24), today), 26);
});

test("date parser only accepts real ISO calendar dates", () => {
  assert.equal(logic.parseLocalDate("2000-02-29").getDate(), 29);
  assert.equal(logic.parseLocalDate("2001-02-29"), null);
  assert.equal(logic.parseLocalDate("2000-2-09"), null);
});

test("complete valid student passes and receives a calculated age", () => {
  const result = logic.validateStudent(validStudent, [], today);
  assert.equal(result.isValid, true);
  assert.equal(result.age, 26);
  assert.ok(Object.values(result.errors).every(message => message === ""));
});

test("student validation reports all missing required fields", () => {
  const result = logic.validateStudent({}, [], today);
  assert.equal(result.isValid, false);
  assert.deepEqual(Object.keys(result.errors), [
    "identification", "first-name", "last-name", "email", "country", "career", "birth-date"
  ]);
  assert.equal(result.age, null);
});

test("duplicate identification and email are blocked without case sensitivity", () => {
  const registered = [{ identification: "AB-12345", email: "jose@example.edu" }];
  const result = logic.validateStudent({
    ...validStudent,
    identification: "ab-12345",
    email: "JOSE@example.edu"
  }, registered, today);
  assert.equal(result.isValid, false);
  assert.match(result.errors.identification, /ya está registrada/);
  assert.match(result.errors.email, /ya está registrado/);
});

test("invalid or future birth dates do not produce an age", () => {
  for (const birthDate of ["", "2026-09-26", "2001-02-29"]) {
    const result = logic.validateStudent({ ...validStudent, birthDate }, [], today);
    assert.equal(result.age, null);
    assert.notEqual(result.errors["birth-date"], "");
  }
});