// spec: specs/student-registration-test-plan.md
// seed: tests/accessibility/student-registration.spec.js

import { test, expect } from '@playwright/test';

test.describe('Cadastro de estudantes', () => {
  test('Registrar estudante válido e calcular a idade', async ({ page }) => {
    // 1. Abra a página inicial com o repositório de estudantes vazio.
    await page.goto('/');

    const identificationField = page.getByRole('textbox', { name: 'Identificación' });
    const firstNameField = page.getByRole('textbox', { name: 'Nombre' });
    const lastNameField = page.getByRole('textbox', { name: 'Apellido' });
    const emailField = page.getByRole('textbox', { name: 'Correo electrónico' });
    const countryField = page.getByRole('textbox', { name: 'País' });
    const careerField = page.getByRole('combobox', { name: 'Carrera' });
    const birthDateField = page.getByRole('textbox', { name: 'Fecha de nacimiento' });
    const ageField = page.getByRole('textbox', { name: 'Edad calculada' });
    const dataRows = page.getByRole('row').filter({ has: page.getByRole('cell') });
    const initialRowCount = await dataRows.count();
    const uniqueSuffix = Date.now();
    const identification = `QA-PLAN-${uniqueSuffix}`;
    const email = `alex.rivera.${uniqueSuffix}@example.com`;

    await expect(identificationField).toHaveValue('');
    await expect(firstNameField).toHaveValue('');
    await expect(lastNameField).toHaveValue('');
    await expect(emailField).toHaveValue('');
    await expect(countryField).toHaveValue('');
    await expect(careerField).toHaveValue('');
    await expect(birthDateField).toHaveValue('');
    await expect(ageField).toHaveValue('—');

    // 2. Preencha Identificación com QA-PLAN-0001, Nombre com Alex, Apellido com Rivera, Correo electrónico com alex.rivera@example.com e País com Argentina.
    await identificationField.fill(identification);
    await firstNameField.fill('Alex');
    await lastNameField.fill('Rivera');
    await emailField.fill(email);
    await countryField.fill('Argentina');

    await expect(identificationField).toHaveValue(identification);
    await expect(firstNameField).toHaveValue('Alex');
    await expect(lastNameField).toHaveValue('Rivera');
    await expect(emailField).toHaveValue(email);
    await expect(countryField).toHaveValue('Argentina');

    // 3. Selecione Ing. Robótica em Carrera e informe uma data de nascimento válida, por exemplo 2000-01-01.
    const birthDate = new Date(2000, 0, 1);
    const today = new Date();
    const expectedAge = today.getFullYear() - birthDate.getFullYear() - (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0
    );

    await careerField.selectOption('Ing. Robótica');
    await birthDateField.fill('2000-01-01');

    await expect(careerField).toHaveValue('Ing. Robótica');
    await expect(ageField).toHaveAttribute('readonly', '');
    await expect(ageField).toHaveValue(String(expectedAge));

    // 4. Clique em Registrar estudiante.
    await page.getByRole('button', { name: 'Registrar estudiante' }).click();

    await expect(page.getByRole('status').filter({ hasText: 'Estudiante Alex Rivera registrado correctamente.' })).toBeVisible();
    await expect(page.getByRole('status', { name: `${initialRowCount + 1} estudiantes registrados` })).toBeVisible();
    await expect(dataRows).toHaveCount(initialRowCount + 1);

    const studentRow = dataRows.filter({ hasText: identification });
    await expect(studentRow).toHaveCount(1);
    await expect(studentRow.getByRole('cell')).toHaveText([
      identification,
      'Alex',
      'Rivera',
      email,
      'Argentina',
      'Ing. Robótica',
      '01/01/2000',
      String(expectedAge)
    ]);

    await expect(identificationField).toHaveValue('');
    await expect(firstNameField).toHaveValue('');
    await expect(lastNameField).toHaveValue('');
    await expect(emailField).toHaveValue('');
    await expect(countryField).toHaveValue('');
    await expect(careerField).toHaveValue('');
    await expect(birthDateField).toHaveValue('');
    await expect(ageField).toHaveValue('—');
  });
});