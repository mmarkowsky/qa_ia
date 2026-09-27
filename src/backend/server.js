const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const StudentLogic = require("../shared/student-logic.js");
const MysqlStudentRepository = require("./mysql-student-repository.js");

const MAX_BODY_BYTES = 16 * 1024;
const staticFiles = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/student-logic.js": ["../shared/student-logic.js", "text/javascript; charset=utf-8"]
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(data));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let bodyTooLarge = false;
    request.setEncoding("utf8");
    request.on("data", chunk => {
      if (bodyTooLarge) return;
      body += chunk;
      bodyTooLarge = Buffer.byteLength(body) > MAX_BODY_BYTES;
    });
    request.on("end", () => {
      if (bodyTooLarge) {
        reject(Object.assign(new Error("La solicitud supera el tamaño permitido."), { statusCode: 413 }));
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error("El cuerpo debe ser JSON válido."), { statusCode: 400 }));
      }
    });
    request.on("error", reject);
  });
}

function stringValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toStudentRecord(record) {
  const date = StudentLogic.parseLocalDate(record.birthDate);
  return {
    id: String(record.id),
    identification: record.identification,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    country: record.country,
    career: record.career,
    birthDate: record.birthDate,
    age: date ? StudentLogic.calculateAge(date) : null
  };
}

function createApplicationServer({ repository, rootDirectory = path.join(__dirname, "../frontend") }) {
  return http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");

    if (requestUrl.pathname === "/api/health" && request.method === "GET") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (requestUrl.pathname === "/api/students" && request.method === "GET") {
      try {
        const students = await repository.list();
        sendJson(response, 200, students.map(toStudentRecord));
      } catch (error) {
        console.error("Failed to list students:", error);
        sendJson(response, 500, { error: "No fue posible consultar los estudiantes." });
      }
      return;
    }

    if (requestUrl.pathname === "/api/students" && request.method === "POST") {
      if (!request.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
        sendJson(response, 415, { error: "El contenido debe enviarse como JSON." });
        return;
      }

      try {
        const body = await readJsonBody(request);
        if (!body || typeof body !== "object" || Array.isArray(body)) {
          sendJson(response, 400, { error: "El cuerpo debe contener los datos de un estudiante." });
          return;
        }

        const student = {
          identification: stringValue(body.identification),
          firstName: stringValue(body.firstName),
          lastName: stringValue(body.lastName),
          email: stringValue(body.email),
          country: stringValue(body.country),
          career: stringValue(body.career),
          birthDate: stringValue(body.birthDate)
        };
        const validation = StudentLogic.validateStudent(student);
        if (!validation.isValid) {
          sendJson(response, 400, {
            error: "Revisa los campos señalados antes de registrar al estudiante.",
            fieldErrors: validation.errors
          });
          return;
        }

        const record = await repository.create(student);
        sendJson(response, 201, toStudentRecord(record));
      } catch (error) {
        if (error.code === "DUPLICATE_STUDENT") {
          const field = error.field;
          const message = field === "email"
            ? "Este correo electrónico ya está registrado."
            : "Esta identificación ya está registrada.";
          sendJson(response, 409, {
            error: message,
            fieldErrors: field ? { [field]: message } : {}
          });
          return;
        }
        if (error.statusCode) {
          sendJson(response, error.statusCode, { error: error.message });
          return;
        }
        console.error("Failed to create student:", error);
        sendJson(response, 500, { error: "No fue posible guardar al estudiante." });
      }
      return;
    }

    if (requestUrl.pathname.startsWith("/api/")) {
      sendJson(response, 404, { error: "Ruta de API no encontrada." });
      return;
    }

    if (request.method !== "GET") {
      response.writeHead(405, { Allow: "GET" });
      response.end("Método no permitido.");
      return;
    }

    const staticFile = staticFiles[requestUrl.pathname];
    if (!staticFile) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("No encontrado.");
      return;
    }

    try {
      const content = await fs.promises.readFile(path.join(rootDirectory, staticFile[0]));
      response.writeHead(200, {
        "Content-Type": staticFile[1],
        "X-Content-Type-Options": "nosniff"
      });
      response.end(content);
    } catch (error) {
      console.error("Failed to serve static file:", error);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("No fue posible cargar la página.");
    }
  });
}

async function startServer() {
  let createPool;
  try {
    ({ createPool } = require("mysql2/promise"));
  } catch {
    throw new Error("Falta el driver MySQL. Ejecuta npm install antes de iniciar el servidor.");
  }

  const pool = createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "academic_registry",
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
    charset: "utf8mb4",
    dateStrings: true
  });
  const repository = new MysqlStudentRepository(pool);
  await pool.query("SELECT 1");
  await repository.initialize();

  const server = createApplicationServer({ repository });
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "127.0.0.1";
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });
  server.once("close", () => pool.end());
  console.log(`Academic registry listening at http://${host}:${port}`);
  return server;
}

if (require.main === module) {
  startServer().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { createApplicationServer, startServer };