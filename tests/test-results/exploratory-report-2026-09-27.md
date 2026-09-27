# Relatório de Testes Exploratórios

- **Data:** 2026-09-27
- **Aplicação:** `http://127.0.0.1:3000/`
- **Agente:** Playwright Exploratory Tester
- **Resultado geral:** Parcial; fluxos não persistentes explorados. O cadastro positivo não foi repetido para evitar criar novos registros no banco persistente.

## Ambiente

- A tentativa de iniciar uma nova instância com `npm start` falhou: MySQL recusou `root` sem senha (`Access denied for user 'root'@'localhost' (using password: NO)`).
- A URL continuou acessível por uma instância que já estava em execução. A página carregou e `GET /api/students` respondeu `200 OK`.
- No início da exploração, a tabela já continha 9 estudantes. Esse estado não foi limpo nem alterado.

## Cenários explorados

| Cenário | Resultado | Evidência |
|---|---|---|
| Carregamento inicial | Passou | Formulário vazio; nove linhas registradas; `GET /api/students` retornou `200`. |
| Envio com campos obrigatórios vazios | Passou | Campos obrigatórios marcados como inválidos, mensagens específicas e aviso geral; contador permaneceu em 9. |
| E-mail malformado | Passou | `correo-invalido` foi mantido no campo e rejeitado com “Ingresa un correo electrónico válido.”; nenhum cadastro ocorreu. |
| Data de nascimento futura | Passou | `2999-01-01` foi rejeitada com “La fecha de nacimiento no puede ser futura.”; idade exibida como “—”; contador permaneceu em 9. |
| Limpar formulário | Passou | Campos, erros e estado de validação foram limpos; os nove registros permaneceram. |
| Navegação por teclado | Parcial | Tab avançou de Identificación para Nombre, percorreu os campos até Fecha de nacimiento e alcançou Registrar estudiante a partir do botão Limpiar. A sequência completa não foi verificada de forma inequívoca. |
| Viewport móvel (375 × 812) | Passou com observação | Formulário virou uma coluna; campos e botões couberam na largura. A tabela excede a largura do viewport e fica disponível para rolagem horizontal. |
| Cadastro válido | Não executado nesta sessão | O cadastro grava no banco e não há ação de exclusão visível. Foi evitada outra gravação, pois já havia dados persistidos. |

## Achado

- **P3 — Recurso de favicon ausente:** ao carregar a aplicação, o navegador solicitou `/favicon.ico` e recebeu `404 Not Found`, registrado como erro no console. Não afetou o carregamento nem os fluxos explorados.

## Efeitos colaterais e limitações

- Nenhum estudante foi criado ou removido nesta exploração. As requisições observadas para a API incluíram `GET /api/students`; não foi observado `POST`.
- O servidor ativo permitiu explorar a aplicação, mas não foi possível iniciar uma instância nova sem configurar credenciais válidas do MySQL.
- A verificação de teclado foi parcial; recomenda-se repetir em uma sessão limpa e acompanhar cada mudança de foco até o último controle.
