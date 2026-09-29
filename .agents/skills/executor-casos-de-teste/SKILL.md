---
name: executor-casos-de-teste
description: >-
  Executa casos de teste documentados em arquivos Markdown (.md) da pasta resultados,
  interagindo com a aplicação via automação/browser (Playwright/MCP), capturando screenshots
  de cada validação e gerando um relatório HTML completo com dashboard, evidências visuais
  e status de cada caso de teste. Use sempre que o usuário solicitar executar, rodar ou validar
  casos de teste a partir de arquivos da pasta resultados.
---

# Executor de Casos de Teste com Evidências Visuais e Relatório HTML

Esta skill orienta o agente na **execução sistemática e validação de casos de teste** que estejam documentados em arquivos Markdown (`.md`) dentro do diretório `resultados/`. Ao término da execução, a skill garante a gravação de capturas de tela (screenshots) de cada validação e a geração de um **relatório HTML moderno e interativo**.

---

## 1. Princípios Fundamentais

1. **Fidelidade Estrita ao Caso de Teste**: Os passos e massas de dados devem seguir rigorosamente o que está especificado no arquivo `.md` de entrada.
2. **Evidência Obrigatória por Validação**: Toda asserção ou passo crítico deve possuir screenshot correspondente registrado em disco.
3. **Imparcialidade e Precisão no Status**:
   - `PASS`: O resultado esperado foi estritamente satisfeito na aplicação.
   - `FAIL`: O comportamento da aplicação divergiu do resultado esperado ou ocorreu erro visível.
   - `BLOCKED`: O teste não pôde ser executado devido a indisponibilidade, falha de pré-condição ou bloqueio impeditivo.
4. **Relatório Autossuficiente**: O arquivo HTML gerado deve referenciar os screenshots por caminhos relativos para funcionar em qualquer navegador sem quebrar imagens.

---

## 2. Fluxo de Trabalho Passo a Passo

```text
[Arquivo .md em resultados/]
        │
        ▼
1. Leitura e Parse dos Casos de Teste (CTs)
        │
        ▼
2. Preparação de Diretórios e Verificação do Ambiente
   (resultados/execucoes/<id_execucao>/screenshots/)
        │
        ▼
3. Execução dos Passos no Navegador / Sistema
   (Navegação, cliques, digitação, asserções visuais)
        │
        ▼
4. Captura e Salvamento de Screenshots
   (Nome padronizado por CT e momento da validação)
        │
        ▼
5. Compilação dos Resultados (JSON)
        │
        ▼
6. Geração do Relatório HTML Interativo
        │
        ▼
[Apresentação ao Usuário com Links Clicáveis]
```

---

## 3. Instruções Detalhadas de Execução

### Passo 1: Leitura e Análise da Entrada (`resultados/*.md`)
1. Localize o arquivo de casos de teste:
   - Se o usuário especificou o nome do arquivo (ex: `resultados/CT-uniwebpro-registro-estudiantes.md`), utilize-o diretamente.
   - Se não especificou, liste os arquivos em `resultados/` e utilize o arquivo mais recente ou pergunte qual executar.
2. Leia o arquivo com a ferramenta `view_file` e extraia para cada caso de teste:
   - **ID**: Ex: `CT-001`
   - **Título**: Descrição da ação/teste
   - **Critério Relacionado**: Ex: `CA-01`
   - **Pré-condições e Massa de Dados**
   - **Passos de Execução**: Sequência ordenada de ações
   - **Resultado Esperado**: O que deve ser validado na interface ou sistema.

---

### Passo 2: Estrutura de Pastas da Execução
Gere um identificador único de execução com base na data/hora ou no nome do teste:
- Identificador sugerido: `execucao-YYYY-MM-DD_HH-mm-ss` ou `<nome-do-arquivo>-execucao`
- Estrutura de diretórios a criar em `resultados/`:

```text
resultados/
└── execucoes/
    └── <id_execucao>/
        ├── screenshots/
        ├── dados-execucao.json
        └── relatorio-execucao.html
```

Comando de criação:
```bash
mkdir -p resultados/execucoes/<id_execucao>/screenshots
```

---

### Passo 3: Execução e Coleta de Evidências

A execução pode ocorrer de duas maneiras principais:

#### Opção A: Execução Interativa via Ferramentas Playwright MCP (Recomendado para flexibilidade)
Utilize as ferramentas do MCP Playwright (`call_mcp_tool` no servidor `playwright`):
1. **Navegar**: `browser_navigate` para a URL do sistema (ex: `http://127.0.0.1:3000`).
2. **Interagir**:
   - `browser_fill_form` ou `browser_type` para preencher campos com os dados de teste exatos.
   - `browser_click` para botões e links.
3. **Capturar Screenshots**:
   - Chame a ferramenta de captura salvando o arquivo dentro de:
     `resultados/execucoes/<id_execucao>/screenshots/<CT-ID>_<seq>_<acao>.png`
   - Padronização de nomes:
     - `CT-001_01_tela_inicial.png`
     - `CT-002_01_formulario_aberto.png`
     - `CT-003_01_dados_preenchidos.png`
     - `CT-003_02_registro_confirmado.png`

#### Opção B: Execução Automatizada via Script Playwright / Node
Se preferir rodar toda a suíte de forma determinística ou headless:
- Gere um script temporário em `scratch/` ou execute via Playwright/Node com captura configurada em `page.screenshot({ path: '...' })`.

---

### Passo 4: Registro dos Dados de Validação

Durante e após a execução de cada caso de teste, registre:
- **Status final**: `PASS`, `FAIL` ou `BLOCKED`.
- **Resultado Obtido**: O que de fato aconteceu (ex: "Mensagem 'Estudante cadastrado com sucesso' exibida e linha visível na tabela").
- **Observações / Erros**: Em caso de falha, anote o seletor não encontrado, o erro no console ou a discrepância de texto.
- **Lista de Screenshots**: Caminho relativo (`screenshots/<nome>.png`) e legenda explicativa.

Salve esses dados consolidados no arquivo `resultados/execucoes/<id_execucao>/dados-execucao.json`.

---

### Passo 5: Geração do Relatório HTML

Execute o script de geração já disponível na skill para compilar o HTML:

```bash
node .agents/skills/executor-casos-de-teste/scripts/generate_report.js \
  resultados/execucoes/<id_execucao>/dados-execucao.json \
  resultados/execucoes/<id_execucao>/relatorio-execucao.html
```

> **Nota**: O script utiliza o template localizado em `.agents/skills/executor-casos-de-teste/resources/template-relatorio.html`. Ele gera um dashboard com KPIs, filtros dinâmicos e galeria com visualizador de screenshots em modal.

---

### Passo 6: Apresentação dos Resultados

Ao concluir, informe no chat:
1. **Resumo Executivo**:
   - Total de testes executados, quantidade de aprovados (`PASS`), reprovados (`FAIL`) e bloqueados (`BLOCKED`).
   - Taxa de sucesso percentual.
2. **Destaques e Anomalias**:
   - Caso haja falhas, explique com clareza a discrepância encontrada.
3. **Links Clicáveis Obrigatórios**:
   - Link para o arquivo HTML: `[Visualizar Relatório HTML](file:///home/maxi/git/qa_ia/resultados/execucoes/<id_execucao>/relatorio-execucao.html)`
   - Link para a pasta de evidências: `[Pasta de Screenshots](file:///home/maxi/git/qa_ia/resultados/execucoes/<id_execucao>/screenshots)`
