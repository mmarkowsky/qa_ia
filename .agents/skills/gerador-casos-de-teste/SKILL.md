---
name: gerador-casos-de-teste
description: >-
  Gera casos de teste acionáveis exclusivamente a partir de Histórias de Usuário (User Stories)
  e seus anexos (mockups, especificações de API, regras de negócio e critérios de aceitação).
  Use esta skill sempre que o usuário solicitar a criação, especificação, estruturação ou desenho
  de cenários e casos de teste baseados em requisitos de Histórias de Usuário.
---

# Gerador de Casos de Teste Acionáveis

Esta skill orienta o agente na geração rigorosa de casos de teste acionáveis, baseando-se **estritamente** na História de Usuário (User Story - US) e em seus anexos fornecidos. O objetivo é assegurar máxima cobertura, clareza operacional para os QAs e ausência total de alucinações ou premissas não validadas.

---

## 1. Princípios Fundamentais

1. **Fidelidade Estrita à Entrada**: Apenas requisitos, regras de negócio e critérios expressos na História de Usuário e anexos devem ser transformados em testes. Não assuma comportamentos que não estejam documentados.
2. **Casos Acionáveis**: Cada passo deve ser reproduzível por qualquer membro do time, com ações claras, dados de teste necessários e resultados esperados inequívocos.
3. **Identificação de Lacunas e Bloqueios**: Se houver ambiguidades, regras conflitantes ou informações essenciais ausentes nos anexos/critérios, registre-as explicitamente como *Dúvidas/Gaps Identificados* antes de concluir.

---

## 2. Análise Detalhada das Entradas (Input Analysis)

Antes de gerar os casos de teste, o agente deve dissecar as entradas obrigatórias e opcionais:

### Entradas Requeridas:
- **História de Usuário (User Story)**:
  - Formato padrão: *Como [ator], Eu quero [ação/funcionalidade], Para que [benefício/valor]*
  - Contexto e escopo da funcionalidade.
- **Critérios de Aceitação (Acceptance Criteria)**:
  - Lista de regras, condições em Gherkin (`Dado / Quando / Então`) ou checklists de regras de negócio.

### Anexos e Entradas Complementares (quando fornecidos):
- **Mockups / Telas / Figma / Imagens**: Elementos visuais, fluxos de navegação, campos obrigatórios, mensagens de validação e estados de componentes (desabilitado, erro, loading).
- **Especificações de API / Contratos (OpenAPI, Swagger, cURL, JSON)**: Endpoints, métodos HTTP, headers, payloads de requisição/resposta, códigos de status esperados (200, 400, 401, 403, 404, 422, 500).
- **Regras de Negócio / Tabelas de Decisão**: Fórmulas, limites de valores, restrições de permissão por perfil de usuário.

---

## 3. Fluxo de Trabalho Passo a Passo

```text
[Entrada: US + Anexos]
       │
       ▼
1. Validação de Completude das Entradas
       │
       ▼
2. Mapeamento de Regras & Matriz de Cobertura
   (Caminho Feliz, Exceções, Limites, Perfis)
       │
       ▼
3. Elaboração dos Casos de Teste Acionáveis
   (Passo a passo ou BDD, dados concretos, resultado esperado)
       │
       ▼
4. Validação de Fidelidade (Sem suposições externas)
       │
       ▼
5. Gravação em Arquivo Markdown
   (Salvar em resultados/<nome-do-arquivo>.md)
       │
       ▼
[Saída Formatada com Link do Arquivo Gerado]
```

### Passo 1: Análise e Verificação de Inconsistências
1. Leia toda a História de Usuário e cada anexo com atenção minuciosa.
2. Mapeie cada critério de aceite com um identificador único (ex: `CA-01`, `CA-02`).
3. Se faltar informação crítica para executar o teste (ex: formato de um campo, comportamento de erro não especificado), anote em uma seção dedicada de *Dúvidas e Lacunas de Requisito*.

### Passo 2: Categorização dos Tipos de Teste
Para cada critério de aceite, mapeie as seguintes categorias:
- **Caminho Feliz (Positive / Happy Path)**: O fluxo ideal em que tudo ocorre conforme esperado.
- **Caminho Alternativo (Alternative Flows)**: Fluxos secundários válidos previstos na regra.
- **Cenários Negativos e Tratamento de Erro (Negative / Error Handling)**: Entradas inválidas, campos obrigatórios em branco, payloads mal formatados, limites ultrapassados.
- **Validação de Limites (Boundary Value Analysis)**: Valores mínimos, máximos e limites imediatos (quando aplicável).
- **Permissões / Perfis**: Diferentes comportamentos baseados no tipo de ator definido na US.

### Passo 3: Estruturação dos Casos de Teste
Consulte o template oficial em [template-caso-de-teste.md](./resources/template-caso-de-teste.md).

Cada caso de teste gerado deve conter:
- **ID do Caso**: Código identificador único (ex: `CT-001`).
- **Título Descritivo**: Claro e objetivo, indicando o objetivo do teste.
- **Critério de Aceite Relacionado**: Rastreabilidade com a US (ex: `CA-01`).
- **Prioridade**: Alta / Média / Baixa (baseada no impacto do critério de aceite).
- **Tipo de Teste**: Funcional, Regra de Negócio, Validação de UI, Validação de API, etc.
- **Pré-condições**: Estado inicial do sistema, usuário autenticado, massa de dados necessária.
- **Dados de Entrada / Teste**: Valores exatos extraídos da US ou exemplos aderentes aos anexos (ex: payloads, parâmetros).
- **Passos de Execução**: Lista numerada de ações acionáveis sem ambiguidades.
- **Resultado Esperado**: O que o sistema deve apresentar ou retornar com base estrita no critério.
- **Pós-condições**: Estado final do sistema (ex: registro salvo no banco, sessão encerrada).

### Passo 4: Gravação Obrigatória em `resultados/`
**Regra de Saída**: Os casos de teste gerados **não devem ficar restritos apenas à mensagem de chat**. Eles **DEVEM ser gravados em disco** em um arquivo Markdown (`.md`) dentro do diretório `resultados/`.

1. **Diretório de Destino**: `resultados/` (garantir que a pasta exista na raiz do workspace).
2. **Convenção de Nome do Arquivo**:
   - `resultados/CT-<identificador-ou-slug-da-us>.md`
   - Exemplos: `resultados/CT-US-42-recuperacao-senha.md`, `resultados/CT-cadastro-usuario.md`.
3. **Conteúdo do Arquivo**: Deve conter a especificação completa gerada (Resumo da US, Matriz de Rastreabilidade, todos os Casos de Teste detalhados e a lista de Dúvidas/Gaps).
4. **Retorno ao Usuário**: Após salvar o arquivo, o agente deve exibir uma resposta concisa informando o caminho do arquivo gerado (com link no formato `[caminho](file:///...)`) e um sumário executivo da cobertura obtida.

---

## 4. Recursos e Exemplos

- **Template de Caso de Teste**: [template-caso-de-teste.md](./resources/template-caso-de-teste.md)
- **Exemplo Prático Completo**: [exemplo-caso-de-teste.md](./examples/exemplo-caso-de-teste.md)

---

## 5. Regras de Qualidade e Boas Práticas

- **Persistência Obrigatória em Arquivo**: Sempre salve a saída em `resultados/<nome-do-arquivo>.md`.
- **Nunca invente regras**: Se a História de Usuário não diz se um campo aceita caracteres especiais, aponte isso como um ponto a ser esclarecido com o PO/Tech Lead, em vez de assumir um comportamento.
- **Linguagem direta e imperativa nos passos**: "Acesse a tela...", "Preencha o campo X com o valor Y...", "Clique no botão Z...".
- **Facilidade de automação**: Estruture os passos de forma que possam ser facilmente convertidos em testes automatizados (Playwright, Cypress, Jest, etc.).
- **Rastreabilidade**: Ao final da entrega, apresente um resumo de cobertura vinculando cada critério de aceitação aos IDs dos casos de teste gerados.
