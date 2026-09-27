# Plano de teste - Registro de estudantes

## Application Overview

Aplicação web de registro acadêmico de estudantes. Permite preencher dados pessoais e acadêmicos, calcula idade a partir da data de nascimento, valida os campos e registra os estudantes em uma tabela com contador. A interface oferece limpeza do formulário e suporte a navegação por teclado. Iniciar cada cenário com um repositório limpo, sem estudantes cadastrados; limpar os dados de teste ao final de cada execução para manter os cenários independentes.

## Test Scenarios

### 1. Cadastro de estudantes

**Seed:** `tests/accessibility/student-registration.spec.js`

#### 1.1. Registrar estudante válido e calcular a idade

**File:** `tests/frontend/student-registration-happy-path.spec.js`

**Steps:**
  1. Abra a página inicial com o repositório de estudantes vazio.
    - expect: O formulário está vazio, o contador mostra 0 e a tabela apresenta o estado vazio.
  2. Preencha Identificación com QA-PLAN-0001, Nombre com Alex, Apellido com Rivera, Correo electrónico com alex.rivera@example.com e País com Argentina.
    - expect: Os valores permanecem nos respectivos campos.
  3. Selecione Ing. Robótica em Carrera e informe uma data de nascimento válida, por exemplo 2000-01-01.
    - expect: A idade calculada é exibida como campo somente leitura e corresponde à idade na data atual.
  4. Clique em Registrar estudiante.
    - expect: É exibida uma confirmação de cadastro.
    - expect: O contador passa a 1 e a tabela contém uma linha com os dados informados, a data e a idade calculada.
    - expect: O formulário é limpo após o sucesso.

#### 1.2. Verificar opções de carreira

**File:** `tests/frontend/student-registration-careers.spec.js`

**Steps:**
  1. Abra a página inicial em estado limpo e abra o seletor Carrera.
    - expect: A opção inicial solicita a seleção de uma carreira e está desabilitada.
    - expect: As opções disponíveis são Ing. Informática, Ing. Electrónica, Ing. Telecomunicaciones, Ing. Robótica e Otra.
  2. Selecione cada opção válida, uma por vez.
    - expect: Cada opção pode ser selecionada e permanece como valor atual do seletor.

### 2. Validações e integridade

**Seed:** `tests/accessibility/student-registration.spec.js`

#### 2.1. Rejeitar campos obrigatórios vazios

**File:** `tests/frontend/student-registration-required-fields.spec.js`

**Steps:**
  1. Abra a página com o repositório vazio e sem preencher nenhum campo.
    - expect: O contador mostra 0 e a tabela permanece vazia.
  2. Clique em Registrar estudiante.
    - expect: Os campos obrigatórios vazios ficam marcados como inválidos e exibem mensagens de validação específicas.
    - expect: É exibido um aviso para revisar os campos.
    - expect: Nenhum estudante é registrado e o contador permanece em 0.

#### 2.2. Rejeitar formatos e valores inválidos

**File:** `tests/frontend/student-registration-invalid-data.spec.js`

**Steps:**
  1. Preencha todos os campos com dados válidos, exceto Correo electrónico, que deve conter correo-invalido.
    - expect: O formulário aceita os valores até o envio.
  2. Clique em Registrar estudiante.
    - expect: O campo de e-mail informa que o endereço é inválido; nenhum registro é criado.
  3. Corrija o e-mail e altere Identificación para conter caracteres especiais ou menos de cinco caracteres; envie novamente.
    - expect: A identificação é rejeitada com a mensagem correspondente; nenhum registro é criado.
  4. Corrija a identificação e informe um Nome ou Apellido com apenas um caractere; envie novamente.
    - expect: O campo de nome inválido é rejeitado por não atingir o mínimo de dois caracteres; nenhum registro é criado.
  5. Corrija os nomes e informe uma data de nascimento futura; envie novamente.
    - expect: A data futura é rejeitada com mensagem de validação e a idade não é apresentada como válida; nenhum registro é criado.
  6. Informe valores válidos em todos os campos e use uma data de nascimento cuja idade faça aniversário hoje.
    - expect: A idade calculada considera corretamente o aniversário na data atual, sem subtrair um ano indevidamente.

#### 2.3. Impedir identificação e e-mail duplicados

**File:** `tests/frontend/student-registration-duplicates.spec.js`

**Steps:**
  1. Com a lista vazia, cadastre um estudante válido usando identificação DUP-PLAN-01 e e-mail dup.plan@example.com.
    - expect: O registro é criado e aparece na tabela.
  2. Tente cadastrar outro estudante válido usando a mesma identificação e um e-mail diferente.
    - expect: O novo cadastro é recusado, a mensagem aponta identificação já registrada e o contador não aumenta.
  3. Tente cadastrar outro estudante válido usando identificação diferente e o e-mail dup.plan@example.com.
    - expect: O novo cadastro é recusado, a mensagem aponta e-mail já registrado e o contador não aumenta.
  4. Repita cada tentativa usando diferenças apenas de maiúsculas/minúsculas na identificação ou no e-mail.
    - expect: As duplicidades continuam sendo detectadas sem distinção entre maiúsculas e minúsculas.

### 3. Interação e acessibilidade

**Seed:** `tests/accessibility/student-registration.spec.js`

#### 3.1. Limpar formulário sem apagar registros existentes

**File:** `tests/frontend/student-registration-clear.spec.js`

**Steps:**
  1. Cadastre um estudante válido e confirme que ele aparece na tabela com contador 1.
    - expect: O registro permanece visível na tabela.
  2. Preencha alguns campos com novos valores, selecione uma carreira e uma data de nascimento.
    - expect: Os valores aparecem no formulário e a idade é calculada.
  3. Clique em Limpiar.
    - expect: Os campos editáveis são esvaziados, Carrera retorna à opção inicial, a idade volta ao estado inicial e os erros do formulário são removidos.
    - expect: O registro previamente cadastrado permanece na tabela e o contador continua em 1.

#### 3.2. Verificar estrutura acessível e navegação por teclado

**File:** `tests/accessibility/student-registration.spec.js`

**Steps:**
  1. Abra a página inicial com o repositório vazio.
    - expect: Existe um título principal h1 e dois títulos h2 para o formulário e a tabela.
    - expect: Todos os campos editáveis têm nomes acessíveis, a tabela tem legenda e o contador expõe seu estado.
  2. A partir do campo Identificación, pressione Tab sucessivamente pelos controles do formulário.
    - expect: O foco segue a ordem Identificación, Nombre, Apellido, Correo electrónico, País, Carrera, Fecha de nacimiento, Limpiar e Registrar estudiante.
    - expect: O foco é visível e não fica preso em nenhum controle.
