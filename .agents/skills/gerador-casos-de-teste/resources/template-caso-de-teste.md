# Template Padrão de Casos de Teste

Utilize a estrutura abaixo para documentar os casos de teste gerados a partir da História de Usuário e anexos.

---

## 1. Resumo da História de Usuário Analisada

- **ID / Título da US**: `[Ex: US-101 - Cadastro de Novo Fornecedor]`
- **Ator Principal**: `[Ex: Administrador Financeiro]`
- **Objetivo da US**: `[Ex: Permitir o cadastro de novos fornecedores com validação de CNPJ]`
- **Anexos Analisados**: `[Ex: Mockup Figma tela 02, Swagger endpoint POST /api/v1/fornecedores]`

---

## 2. Matriz de Critérios de Aceitação (Rastreabilidade)

| ID do Critério | Descrição Resumida do Critério / Regra de Negócio | Casos de Teste Vinculados |
| :------------- | :------------------------------------------------ | :------------------------ |
| **CA-01**      | [Descrição do critério conforme a US]             | CT-001, CT-002            |
| **CA-02**      | [Descrição da validação ou regra de erro]          | CT-003                    |

---

## 3. Especificação dos Casos de Teste

### Caso de Teste: [CT-001] - [Título Claro do Teste]

- **Critério Relacionado**: `[Ex: CA-01]`
- **Prioridade**: `[Alta | Média | Baixa]`
- **Tipo de Teste**: `[Caminho Feliz | Caminho Alternativo | Negativo / Validação | API | UI]`
- **Pré-condições**:
  - [Estado prévio do sistema, login necessário, dados já existentes]
- **Massa de Dados / Entradas**:
  - `campo_1`: `"valor válido"`
  - `campo_2`: `"123456"`
- **Passos de Execução**:
  1. Acesse o menu/tela `[...]`.
  2. Preencha o campo `[...]` com o valor `[...]`.
  3. Clique no botão `[...]`.
- **Resultado Esperado**:
  - O sistema deve exibir a mensagem de sucesso `"[texto conforme US/anexo]"`.
  - [Ou o endpoint deve retornar HTTP 201 Created com payload compatível com a documentação].
- **Pós-condições**:
  - [Estado resultante no sistema, ex: registro visível na listagem].

---

## 4. Gaps / Dúvidas de Requisitos Identificados

Liste aqui pontos que **não estão explícitos** na História de Usuário ou anexos e que requerem alinhamento:

1. `[Ex: O anexo do Figma mostra um campo "Telefone Secundário", mas a US não menciona se é obrigatório ou opcional.]`
2. `[Ex: O Swagger documenta retorno 422, mas a US não especifica a mensagem exata exibida na interface.]`
