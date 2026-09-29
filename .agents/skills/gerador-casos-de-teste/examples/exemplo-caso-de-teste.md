# Exemplo Prático: Geração de Casos de Teste a partir de História de Usuário

Este documento serve como referência de como a skill processa a entrada (História de Usuário + Anexo) e produz uma suíte de casos de teste acionáveis com fidelidade estrita.

---

## 1. Exemplo de Entrada Fornecida

### História de Usuário:
> **US-42**: Recuperação de Senha por E-mail
>
> **Como** usuário cadastrado no portal,  
> **Quero** solicitar a recuperação da minha senha informando meu e-mail,  
> **Para que** eu possa redefinir meu acesso caso o tenha esquecido.
>
> **Critérios de Aceitação**:
> - **CA-01**: O formulário deve conter apenas o campo de e-mail e o botão "Enviar link de recuperação".
> - **CA-02**: Se o e-mail informado for válido e cadastrado, enviar link de redefinição com validade de 2 horas e exibir a mensagem: *"E-mail enviado! Verifique sua caixa de entrada."*.
> - **CA-03**: Se o e-mail não estiver cadastrado, por segurança, exibir a mesma mensagem: *"E-mail enviado! Verifique sua caixa de entrada."* (prevenção de enumeração de contas).
> - **CA-04**: Se o formato do e-mail for inválido, desabilitar o envio e exibir inline: *"Insira um formato de e-mail válido"*.
> - **CA-05**: Limite de 3 solicitações por e-mail a cada 15 minutos. Na 4ª tentativa, retornar erro HTTP 429 e exibir mensagem: *"Muitas tentativas. Tente novamente em 15 minutos."*.

### Anexos Fornecidos:
- **Mockup (Figma Tela REC-01)**: Campo de texto rotulado "E-mail cadastrado", placeholder `exemplo@dominio.com`, botão azul "Enviar link de recuperação".
- **Contrato de API**: `POST /api/v1/auth/forgot-password`
  - Request: `{"email": "string"}`
  - Responses: `200 OK` (corpo `{ "message": "Email sent" }`), `400 Bad Request`, `429 Too Many Requests`.

---

## 2. Saída Gerada Pela Skill

### Matriz de Rastreabilidade

| Critério de Aceite | Descrição | Casos de Teste Vinculados |
| :----------------- | :-------- | :------------------------ |
| **CA-01** | Componentes da tela conforme mockup | `CT-001` |
| **CA-02** | E-mail válido e cadastrado | `CT-002` |
| **CA-03** | E-mail não cadastrado (Prevenção de enumeração) | `CT-003` |
| **CA-04** | Formato de e-mail inválido | `CT-004` |
| **CA-05** | Limite de requisições (Rate Limit) | `CT-005` |

---

### Casos de Teste Detalhados

#### CT-001 - Validação dos Elementos da Interface de Recuperação de Senha
- **Critério Relacionado**: `CA-01`
- **Prioridade**: Média
- **Tipo de Teste**: UI / Estrutural
- **Pré-condições**:
  - Aplicação aberta na tela de login.
- **Passos de Execução**:
  1. Clicar no link "Esqueci minha senha".
  2. Verificar a presença dos elementos na tela conforme o Mockup REC-01.
- **Resultado Esperado**:
  - Exibir campo com rótulo "E-mail cadastrado" e placeholder `exemplo@dominio.com`.
  - Exibir botão com texto exato "Enviar link de recuperação".

---

#### CT-002 - Solicitação de Recuperação com E-mail Cadastrado (Caminho Feliz)
- **Critério Relacionado**: `CA-02`
- **Prioridade**: Alta
- **Tipo de Teste**: Funcional / E2E
- **Pré-condições**:
  - Usuário com e-mail `usuario.ativo@empresa.com` previamente cadastrado na base.
- **Passos de Execução**:
  1. Acessar a tela de recuperação de senha.
  2. Inserir `usuario.ativo@empresa.com` no campo "E-mail cadastrado".
  3. Clicar em "Enviar link de recuperação".
- **Resultado Esperado**:
  - A requisição `POST /api/v1/auth/forgot-password` é enviada com status 200.
  - Mensagem na tela: *"E-mail enviado! Verifique sua caixa de entrada."*.
  - Link de recuperação gerado com expiração de 2 horas.

---

#### CT-003 - Solicitação de Recuperação com E-mail Não Cadastrado (Segurança)
- **Critério Relacionado**: `CA-03`
- **Prioridade**: Alta
- **Tipo de Teste**: Segurança / Regra de Negócio
- **Pré-condições**:
  - E-mail `inexistente@empresa.com` garantidamente não cadastrado no sistema.
- **Passos de Execução**:
  1. Acessar a tela de recuperação de senha.
  2. Preencher com `inexistente@empresa.com`.
  3. Clicar em "Enviar link de recuperação".
- **Resultado Esperado**:
  - O sistema exibe exatamente a mensagem: *"E-mail enviado! Verifique sua caixa de entrada."*.
  - Nenhum vazamento de informação indicando que a conta não existe.

---

#### CT-004 - Validação de Formato de E-mail Inválido
- **Critério Relacionado**: `CA-04`
- **Prioridade**: Média
- **Tipo de Teste**: Validação de Campo / Negativo
- **Pré-condições**:
  - Tela de recuperação de senha carregada.
- **Passos de Execução**:
  1. No campo de e-mail, digitar `usuario_sem_arroba.com`.
  2. Observar o estado do botão de envio e mensagem auxiliar.
- **Resultado Esperado**:
  - Exibir mensagem inline: *"Insira um formato de e-mail válido"*.
  - Botão "Enviar link de recuperação" permanece desabilitado, impedindo a submissão.

---

#### CT-005 - Bloqueio por Limite de Tentativas (Rate Limiting)
- **Critério Relacionado**: `CA-05`
- **Prioridade**: Alta
- **Tipo de Teste**: Limite / Segurança / API
- **Pré-condições**:
  - E-mail válido cadastrado no sistema.
- **Passos de Execução**:
  1. Realizar 3 envios consecutivos para o mesmo e-mail no intervalo inferior a 15 minutos.
  2. Realizar a 4ª tentativa de envio com o mesmo e-mail.
- **Resultado Esperado**:
  - Na 4ª tentativa, a API responde HTTP 429 Too Many Requests.
  - A interface exibe: *"Muitas tentativas. Tente novamente em 15 minutos."*.

---

### Lacunas e Dúvidas Identificadas (Gaps)
1. **Comportamento de Espaços em Branco**: A US e o Swagger não especificam se espaços antes ou depois do e-mail (ex: `" email@dominio.com "`) devem sofrer `trim()` automático antes da validação.
2. **Sensibilidade a Maiúsculas/Minúsculas (Case Sensitivity)**: Confirmar se `Usuario@Dominio.com` é tratado como idêntico a `usuario@dominio.com`.
