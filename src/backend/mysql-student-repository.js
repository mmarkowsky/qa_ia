class MysqlStudentRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async initialize() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        identification VARCHAR(255) NOT NULL,
        identification_normalized VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(254) NOT NULL,
        email_normalized VARCHAR(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
        country VARCHAR(255) NOT NULL,
        career VARCHAR(100) NOT NULL,
        birth_date DATE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_student_identification (identification_normalized),
        UNIQUE KEY unique_student_email (email_normalized)
      ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  async list() {
    const [rows] = await this.pool.execute(`
      SELECT
        id,
        identification,
        first_name AS firstName,
        last_name AS lastName,
        email,
        country,
        career,
        DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate
      FROM students
      ORDER BY created_at DESC, id DESC
    `);
    return rows;
  }

  async create(student) {
    try {
      const [result] = await this.pool.execute(`
        INSERT INTO students (
          identification,
          identification_normalized,
          first_name,
          last_name,
          email,
          email_normalized,
          country,
          career,
          birth_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        student.identification,
        student.identification.toLowerCase(),
        student.firstName,
        student.lastName,
        student.email,
        student.email.toLowerCase(),
        student.country,
        student.career,
        student.birthDate
      ]);
      return { ...student, id: String(result.insertId) };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        const field = error.message.includes("unique_student_email") ? "email" : "identification";
        const duplicateError = new Error("Student already exists.");
        duplicateError.code = "DUPLICATE_STUDENT";
        duplicateError.field = field;
        throw duplicateError;
      }
      throw error;
    }
  }
}

module.exports = MysqlStudentRepository;