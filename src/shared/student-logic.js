(function (root) {
  const careers = [
    "Ing. Informática",
    "Ing. Electrónica",
    "Ing. Telecomunicaciones",
    "Ing. Robótica",
    "Otra"
  ];

  function validateIdentification(value) {
    const identification = value.trim();
    if (!identification) return "Ingresa la identificación.";
    if (!/^[a-zA-Z0-9-]+$/.test(identification)) return "Usa solo letras, números o guiones.";
    if (identification.length < 5) return "La identificación debe tener al menos 5 caracteres.";
    return "";
  }

  function validatePersonName(value, label) {
    const name = value.trim();
    if (!name) return `${label} es obligatorio.`;
    if (name.length < 2) return `${label} debe tener al menos 2 caracteres.`;
    return /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(name) ? "" : `${label} solo puede contener letras y espacios.`;
  }

  function validateEmail(value) {
    const email = value.trim();
    if (!email) return "Ingresa el correo electrónico.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Ingresa un correo electrónico válido.";
  }

  function validateRequired(value, message) {
    return value.trim() ? "" : message;
  }

  function validateCareer(value) {
    return careers.includes(value) ? "" : "Selecciona una carrera válida.";
  }

  function parseLocalDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(0);
    date.setHours(0, 0, 0, 0);
    date.setFullYear(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  }

  function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  function validateBirthDate(value, today = new Date()) {
    if (!value) return "Selecciona la fecha de nacimiento.";
    const date = parseLocalDate(value);
    if (!date) return "Ingresa una fecha válida.";
    return date > startOfDay(today) ? "La fecha de nacimiento no puede ser futura." : "";
  }

  function calculateAge(date, today = new Date()) {
    let age = today.getFullYear() - date.getFullYear();
    const beforeBirthday = today.getMonth() < date.getMonth() ||
      (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
    if (beforeBirthday) age -= 1;
    return age;
  }

  function validateStudent(student, registeredStudents = [], today = new Date()) {
    const errors = {
      identification: validateIdentification(student.identification || ""),
      "first-name": validatePersonName(student.firstName || "", "El nombre"),
      "last-name": validatePersonName(student.lastName || "", "El apellido"),
      email: validateEmail(student.email || ""),
      country: validateRequired(student.country || "", "Ingresa el país."),
      career: validateCareer(student.career || ""),
      "birth-date": validateBirthDate(student.birthDate || "", today)
    };

    if (!errors.identification && registeredStudents.some(existing =>
      existing.identification.toLowerCase() === student.identification.trim().toLowerCase())) {
      errors.identification = "Esta identificación ya está registrada.";
    }
    if (!errors.email && registeredStudents.some(existing =>
      existing.email.toLowerCase() === student.email.trim().toLowerCase())) {
      errors.email = "Este correo electrónico ya está registrado.";
    }

    const date = parseLocalDate(student.birthDate || "");
    return {
      errors,
      age: errors["birth-date"] ? null : calculateAge(date, today),
      isValid: Object.values(errors).every(message => !message)
    };
  }

  const api = {
    careers,
    calculateAge,
    parseLocalDate,
    validateBirthDate,
    validateCareer,
    validateEmail,
    validateIdentification,
    validatePersonName,
    validateRequired,
    validateStudent
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.StudentLogic = api;
})(globalThis);