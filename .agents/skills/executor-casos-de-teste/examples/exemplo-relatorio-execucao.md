# Exemplo de Estrutura de Execução e Dados

Este exemplo ilustra como os dados de execução são organizados pela skill `executor-casos-de-teste` antes e durante a geração do relatório HTML.

---

## 1. Estrutura de Pastas Gerada na Execução

```text
resultados/
├── CT-uniwebpro-registro-estudiantes.md
└── execucoes/
    └── execucao-2026-09-28_15-30-00/
        ├── screenshots/
        │   ├── CT-001_01_tela_inicial.png
        │   ├── CT-002_01_formulario_aberto.png
        │   ├── CT-003_01_preenchimento.png
        │   ├── CT-003_02_registro_salvo.png
        │   ├── CT-004_01_busca_nome.png
        │   └── CT-005_01_busca_documento.png
        ├── dados-execucao.json
        └── relatorio-execucao.html
```

---

## 2. Exemplo do Arquivo JSON de Entrada (`dados-execucao.json`)

```json
{
  "title": "Execução de Testes: UniWebPro - Registro de Estudiantes",
  "sourceFile": "resultados/CT-uniwebpro-registro-estudiantes.md",
  "executionDate": "28/09/2026 15:30:00",
  "targetUrl": "http://127.0.0.1:3000",
  "executor": "Agente QA Antigravity",
  "testCases": [
    {
      "id": "CT-001",
      "title": "Visualização dos Elementos Iniciais do Módulo de Estudantes",
      "criterion": "CA-01",
      "status": "PASS",
      "steps": [
        "Acessar o sistema UniWebPro",
        "Navegar até o módulo Estudantes",
        "Observar os elementos visíveis na página"
      ],
      "expectedResult": "Seção 'Registro de Estudiantes', botão 'Registrar Estudiante', campo de busca e tabela visíveis.",
      "actualResult": "Todos os elementos encontrados e interativos na tela.",
      "notes": "Tempo de carregamento: 120ms.",
      "screenshots": [
        {
          "path": "screenshots/CT-001_01_tela_inicial.png",
          "caption": "Visão geral da tela inicial do módulo de estudantes"
        }
      ]
    },
    {
      "id": "CT-002",
      "title": "Abertura e Campos Obrigatórios Mínimos do Formulário de Registro",
      "criterion": "CA-02",
      "status": "PASS",
      "steps": [
        "Clicar no botão 'Registrar Estudiante'",
        "Verificar os campos disponibilizados no formulário exibido"
      ],
      "expectedResult": "Formulário aberto com campos: Nombre, Documento, Carrera, Contacto, Email.",
      "actualResult": "Modal exibido com os 5 campos especificados presentes.",
      "screenshots": [
        {
          "path": "screenshots/CT-002_01_formulario_aberto.png",
          "caption": "Formulário de registro com todos os campos visíveis"
        }
      ]
    }
  ]
}
```
