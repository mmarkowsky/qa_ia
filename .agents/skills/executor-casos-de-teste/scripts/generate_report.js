#!/usr/bin/env node

/**
 * Script auxiliar para geração de relatório HTML com screenshots a partir de dados de execução em JSON.
 * Uso: node generate_report.js <caminho-dados.json> <caminho-saida.html>
 */

const fs = require('fs');
const path = require('path');

function generateHtmlReport(dataPath, outputPath) {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const templatePath = path.resolve(__dirname, '../resources/template-relatorio.html');
  let template = fs.readFileSync(templatePath, 'utf-8');

  const total = data.testCases ? data.testCases.length : 0;
  const pass = data.testCases ? data.testCases.filter(t => t.status.toLowerCase() === 'pass').length : 0;
  const fail = data.testCases ? data.testCases.filter(t => t.status.toLowerCase() === 'fail').length : 0;
  const blocked = data.testCases ? data.testCases.filter(t => t.status.toLowerCase() === 'blocked').length : 0;
  const successRate = total > 0 ? ((pass / total) * 100).toFixed(1) : 0;

  // Montar HTML dos casos de teste
  let casesHtml = '';
  (data.testCases || []).forEach(tc => {
    const statusClass = tc.status.toLowerCase();
    const statusLabel = statusClass === 'pass' ? 'PASSOU' : (statusClass === 'fail' ? 'FALHOU' : 'BLOQUEADO');

    let stepsHtml = '';
    if (tc.steps && tc.steps.length > 0) {
      stepsHtml = '<ol class="step-list">' + tc.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('') + '</ol>';
    } else {
      stepsHtml = '<p style="color: var(--text-muted);">Nenhum passo detalhado.</p>';
    }

    let screenshotsHtml = '';
    if (tc.screenshots && tc.screenshots.length > 0) {
      screenshotsHtml = '<div class="tc-section"><div class="tc-section-title">Evidências / Screenshots</div><div class="screenshots-grid">' +
        tc.screenshots.map(sc => `
          <div class="screenshot-item" onclick="openModal('${escapeHtml(sc.path)}')">
            <img src="${escapeHtml(sc.path)}" alt="${escapeHtml(sc.caption || 'Screenshot')}" loading="lazy">
            <div class="screenshot-caption" title="${escapeHtml(sc.caption || sc.path)}">${escapeHtml(sc.caption || sc.path)}</div>
          </div>
        `).join('') +
        '</div></div>';
    }

    casesHtml += `
      <div class="tc-card status-${statusClass}">
        <div class="tc-header">
          <div class="tc-title-wrapper">
            <span class="tc-id">${escapeHtml(tc.id)}</span>
            <span class="tc-title">${escapeHtml(tc.title)}</span>
          </div>
          <span class="status-badge badge-${statusClass}">${statusLabel}</span>
        </div>
        <div class="tc-body">
          <div class="tc-section">
            <div class="tc-section-title">Critério / Rastreabilidade</div>
            <p style="font-size: 0.95rem; color: #cbd5e1;">${escapeHtml(tc.criterion || 'N/A')}</p>
          </div>
          <div class="tc-section">
            <div class="tc-section-title">Passos Executados</div>
            ${stepsHtml}
          </div>
          <div class="tc-section">
            <div class="tc-section-title">Validação do Resultado</div>
            <div class="validation-box">
              <div class="validation-row">
                <span class="validation-label">Esperado:</span>
                <span>${escapeHtml(tc.expectedResult || 'N/A')}</span>
              </div>
              <div class="validation-row">
                <span class="validation-label">Obtido:</span>
                <span style="color: ${statusClass === 'pass' ? '#4ade80' : '#f87171'}; font-weight: 500;">
                  ${escapeHtml(tc.actualResult || 'N/A')}
                </span>
              </div>
              ${tc.notes ? `
              <div class="validation-row">
                <span class="validation-label">Observações:</span>
                <span>${escapeHtml(tc.notes)}</span>
              </div>` : ''}
            </div>
          </div>
          ${screenshotsHtml}
        </div>
      </div>
    `;
  });

  template = template
    .replace(/{{TITULO_RELATORIO}}/g, escapeHtml(data.title || 'Execução de Casos de Teste'))
    .replace(/{{ARQUIVO_ORIGEM}}/g, escapeHtml(data.sourceFile || 'resultados/*.md'))
    .replace(/{{DATA_EXECUCAO}}/g, escapeHtml(data.executionDate || new Date().toLocaleString('pt-BR')))
    .replace(/{{AMBIENTE_URL}}/g, escapeHtml(data.targetUrl || 'http://127.0.0.1:3000'))
    .replace(/{{EXECUTOR}}/g, escapeHtml(data.executor || 'Agente QA Antigravity'))
    .replace(/{{TOTAL_TESTES}}/g, total)
    .replace(/{{TOTAL_PASS}}/g, pass)
    .replace(/{{TOTAL_FAIL}}/g, fail)
    .replace(/{{TOTAL_BLOCKED}}/g, blocked)
    .replace(/{{TAXA_SUCESSO}}/g, successRate)
    .replace(/{{CASOS_DE_TESTE_HTML}}/g, casesHtml);

  // Garantir diretório de saída
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, template, 'utf-8');
  console.log(`Relatório HTML gerado com sucesso em: ${outputPath}`);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Uso: node generate_report.js <caminho-dados.json> <caminho-saida.html>');
  process.exit(1);
}

generateHtmlReport(args[0], args[1]);
