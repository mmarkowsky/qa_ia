# Casos de Teste: UniWebPro - Registro de Estudiantes

Documento de especificação de casos de teste gerado com base estrita na História de Usuário fornecida, seguindo os padrões da skill `gerador-casos-de-teste`.

---

## 1. Resumo da História de Usuário Analisada

- **ID / Título da US**: UniWebPro - Registro de Estudiantes
- **Ator Principal**: Administrador del sistema
- **Objetivo da US**: Registrar um estudante no módulo de Estudantes para gerenciar admissões e manter os dados pessoais ordenados.
- **Anexos Analisados**: Nenhum anexo adicional (mockups, OpenAPI ou regras complementares) foi fornecido juntamente à US.

### Critérios de Aceitação Mapeados:
- **CA-01**: Ao entrar no módulo de Estudantes, é exibida a seção "Registro de Estudiantes" com o botão "Registrar Estudiante", o campo de busca e a tabela de resultados.
- **CA-02**: Ao clicar em "Registrar Estudiante", abre-se um formulário que permite preencher ao menos: *Nombre del estudiante*, *Documento*, *Carrera*, *Contacto*, *Email*.
- **CA-03**: Ao salvar o registro, o novo estudante aparece na lista de resultados e pode ser encontrado utilizando o buscador por *Nombre* ou por *Documento*.

---

## 2. Matriz de Rastreabilidade

| ID do Critério | Descrição Resumida | Casos de Teste Vinculados |
| :------------- | :----------------- | :------------------------ |
| **CA-01**      | Exibição dos elementos da seção "Registro de Estudiantes" | `CT-001` |
| **CA-02**      | Abertura e presença dos campos no formulário de registro | `CT-002` |
| **CA-03**      | Gravação de estudante e exibição na listagem | `CT-003` |
| **CA-03**      | Localização do estudante via busca por Nome | `CT-004` |
| **CA-03**      | Localização do estudante via busca por Documento | `CT-005` |

---

## 3. Especificação dos Casos de Teste Acionáveis

### CT-001 - Visualização dos Elementos Iniciais do Módulo de Estudantes
- **Critério Relacionado**: `CA-01`
- **Prioridade**: Alta
- **Tipo de Teste**: UI / Estrutural
- **Pré-condições**:
  - Usuário autenticado com perfil de "Administrador del sistema".
- **Passos de Execução**:
  1. Acessar o sistema UniWebPro.
  2. Navegar até o módulo "Estudiantes".
  3. Observar os elementos visíveis na página.
- **Resultado Esperado**:
  - A seção "Registro de Estudiantes" está visível.
  - O botão "Registrar Estudiante" está presente e habilitado.
  - O campo de busca (buscador) está visível.
  - A tabela de resultados está visível.
- **Pós-condições**:
  - O usuário permanece na tela inicial do módulo de Estudantes.

---

### CT-002 - Abertura e Campos Obrigatórios Mínimos do Formulário de Registro
- **Critério Relacionado**: `CA-02`
- **Prioridade**: Alta
- **Tipo de Teste**: Funcional / Interface
- **Pré-condições**:
  - Usuário administrador na seção "Registro de Estudiantes" do módulo de Estudantes.
- **Passos de Execução**:
  1. Clicar no botão "Registrar Estudiante".
  2. Verificar os campos disponibilizados no formulário exibido.
- **Resultado Esperado**:
  - O formulário de registro é exibido (modal ou página dedicada).
  - Estão disponíveis para preenchimento os campos:
    - *Nombre del estudiante*
    - *Documento*
    - *Carrera*
    - *Contacto*
    - *Email*
- **Pós-condições**:
  - Formulário aberto e pronto para inserção de dados.

---

### CT-003 - Cadastro de Novo Estudante com Sucesso (Caminho Feliz)
- **Critério Relacionado**: `CA-03`
- **Prioridade**: Alta
- **Tipo de Teste**: Funcional / E2E
- **Pré-condições**:
  - Formulário de registro de estudante aberto.
- **Massa de Dados de Teste**:
  - *Nombre del estudiante*: `"Carlos Mendez"`
  - *Documento*: `"DOC-98765432"`
  - *Carrera*: `"Ingeniería de Sistemas"`
  - *Contacto*: `"+55 11 99999-8888"`
  - *Email*: `"carlos.mendez@uniwebpro.edu"`
- **Passos de Execução**:
  1. No formulário de registro, preencher o campo *Nombre del estudiante* com `"Carlos Mendez"`.
  2. Preencher o campo *Documento* com `"DOC-98765432"`.
  3. Preencher o campo *Carrera* com `"Ingeniería de Sistemas"`.
  4. Preencher o campo *Contacto* com `"+55 11 99999-8888"`.
  5. Preencher o campo *Email* com `"carlos.mendez@uniwebpro.edu"`.
  6. Acionar a ação de salvar o registro (botão Guardar/Salvar).
- **Resultado Esperado**:
  - O registro é salvo com sucesso.
  - O estudante `"Carlos Mendez"` com documento `"DOC-98765432"` passa a constar na tabela de resultados da lista de estudantes.
- **Pós-condições**:
  - O novo estudante permanece persistido e visível na listagem.

---

### CT-004 - Busca de Estudante Cadastrado por Nome
- **Critério Relacionado**: `CA-03`
- **Prioridade**: Alta
- **Tipo de Teste**: Funcional / Busca
- **Pré-condições**:
  - Estudante `"Mariana Silva"` com documento `"DOC-11223344"` previamente cadastrado e salvo no sistema.
  - Usuário na seção "Registro de Estudiantes".
- **Massa de Dados de Teste**:
  - Termo de busca: `"Mariana Silva"`
- **Passos de Execução**:
  1. Localizar o campo de busca no módulo de Estudantes.
  2. Inserir o termo `"Mariana Silva"`.
  3. Executar a busca (pressionar Enter ou clicar no ícone/botão de busca, se houver).
- **Resultado Esperado**:
  - A tabela de resultados filtra e apresenta o registro da estudante `"Mariana Silva"`.
- **Pós-condições**:
  - A listagem exibe o resultado compatível com o nome pesquisado.

---

### CT-005 - Busca de Estudante Cadastrado por Documento
- **Critério Relacionado**: `CA-03`
- **Prioridade**: Alta
- **Tipo de Teste**: Funcional / Busca
- **Pré-condições**:
  - Estudante `"Lucas Pereira"` com documento `"DOC-55667788"` previamente cadastrado e salvo no sistema.
  - Usuário na seção "Registro de Estudiantes".
- **Massa de Dados de Teste**:
  - Termo de busca: `"DOC-55667788"`
- **Passos de Execução**:
  1. Localizar o campo de busca no módulo de Estudantes.
  2. Inserir o termo `"DOC-55667788"`.
  3. Executar a busca (pressionar Enter ou clicar no ícone/botão de busca, se houver).
- **Resultado Esperado**:
  - A tabela de resultados filtra e apresenta o registro do estudante correspondente ao documento `"DOC-55667788"`.
- **Pós-condições**:
  - A listagem exibe o estudante vinculado ao documento pesquisado.

---

## 4. Dúvidas e Lacunas de Requisitos Identificadas (Gaps)

Em estrita conformidade com os princípios da skill, foram identificadas as seguintes indefinições na História de Usuário que necessitam de alinhamento com o Product Owner / Tech Lead:

1. **Obrigatoriedade e Formatos de Campos**:
   - A US cita que o formulário *"permite ingresar al menos"* os 5 campos, mas não especifica quais deles são de preenchimento obrigatório e quais são opcionais.
   - Não há especificação de máscara ou regex para os campos *Documento*, *Contacto* e *Email*.
2. **Duplicidade de Registros**:
   - Não foi definido o comportamento esperado ao tentar cadastrar um estudante com um *Documento* ou *Email* que já existe na base (deve bloquear? Exibir alerta? Permitir?).
3. **Mecanismo e Sensibilidade do Buscador**:
   - O buscador é acionado automaticamente conforme a digitação (*debounce*), ao pressionar *Enter*, ou há um botão "Buscar"?
   - A busca por nome é estrita (*exact match*) ou por correspondência parcial (*contains/like*, insensível a maiúsculas/minúsculas e acentos)?
4. **Tratamento de Cancelamento e Fechamento**:
   - Não foi especificado se o formulário possui ação de "Cancelar" ou "Fechar" descartando as alterações sem salvar.
