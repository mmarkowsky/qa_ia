const test = require("node:test");
const assert = require("node:assert/strict");
const { createApplicationServer } = require("../../src/backend/server.js");

class MemoryStudentRepository {
  constructor() {
    this.students = [];
    this.nextId = 1;
  }

  async list() {
    return [...this.students].reverse();
  }

  async create(student) {
    if (this.students.some(existing => existing.identification.toLowerCase() === student.identification.toLowerCase())) {
      throw Object.assign(new Error("Duplicate identification"), { code: "DUPLICATE_STUDENT", field: "identification" });
    }
    if (this.students.some(existing => existing.email.toLowerCase() === student.email.toLowerCase())) {
      throw Object.assign(new Error("Duplicate email"), { code: "DUPLICATE_STUDENT", field: "email" });
    }
    const record = { ...student, id: String(this.nextId++) };
    this.students.push(record);
    return record;
  }
}

const validStudent = {
  identification: "AB-12345",
  firstName: "José",
  lastName: "Muñoz",
  email: "jose@example.edu",
  country: "Colombia",
  career: "Ing. Informática",
  birthDate: "2000-01-01"
};

let server;
let repository;
let baseUrl;

test.before(async () => {
  repository = new MemoryStudentRepository();
  server = createApplicationServer({ repository });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test.beforeEach(() => {
  repository.students = [];
  repository.nextId = 1;
});

test("GET /api/students returns the stored students", async () => {
  const response = await fetch(`${baseUrl}/api/students`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), []);
});

test("POST /api/students validates and persists a student", async () => {
  const response = await fetch(`${baseUrl}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validStudent)
  });
  const created = await response.json();
  assert.equal(response.status, 201);
  assert.equal(created.identification, validStudent.identification);
  assert.equal(created.age, new Date().getFullYear() - 2000);
  assert.equal(repository.students.length, 1);

  const listed = await fetch(`${baseUrl}/api/students`);
  assert.equal((await listed.json()).length, 1);
});

test("POST rejects invalid student fields without writing to the repository", async () => {
  const response = await fetch(`${baseUrl}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...validStudent, email: "not-an-email", birthDate: "2999-01-01" })
  });
  const result = await response.json();
  assert.equal(response.status, 400);
  assert.ok(result.fieldErrors.email);
  assert.ok(result.fieldErrors["birth-date"]);
  assert.equal(repository.students.length, 0);
});

test("POST rejects duplicate identification without case sensitivity", async () => {
  await createStudent(validStudent);
  const response = await createStudent({ ...validStudent, identification: "ab-12345", email: "other@example.edu" });
  const result = await response.json();
  assert.equal(response.status, 409);
  assert.ok(result.fieldErrors.identification);
  assert.equal(repository.students.length, 1);
});

test("POST rejects duplicate email without case sensitivity", async () => {
  await createStudent(validStudent);
  const response = await createStudent({ ...validStudent, identification: "CD-67890", email: "JOSE@example.edu" });
  const result = await response.json();
  assert.equal(response.status, 409);
  assert.ok(result.fieldErrors.email);
  assert.equal(repository.students.length, 1);
});

test("POST rejects malformed JSON and non-JSON requests", async () => {
  const malformed = await fetch(`${baseUrl}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{"
  });
  assert.equal(malformed.status, 400);

  const wrongContentType = await fetch(`${baseUrl}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "{}"
  });
  assert.equal(wrongContentType.status, 415);
});

test("GET / serves the static registration page and its client logic", async () => {
  const response = await fetch(baseUrl);
  const page = await response.text();
  assert.equal(response.status, 200);
  assert.match(page, /student-logic\.js/);
  assert.match(page, /id="student-form"/);
});

function createStudent(student) {
  return fetch(`${baseUrl}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });
}