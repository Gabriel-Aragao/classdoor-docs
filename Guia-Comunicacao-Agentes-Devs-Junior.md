# Guia de Comunicação e Suporte: Agentes de IA & Desenvolvedores

Este guia define as diretrizes, papéis e fluxos de interação entre os desenvolvedores júnior não-agentes (**@andreyrian3** e **@jenniferrebecaalvesdebarros**) e a equipe de agentes especialistas do ecossistema XIUD/Hermes.

---

## 1. Visão Geral e Canal de Comunicação

O canal oficial de suporte operacional para os desenvolvedores é a **seção de comentários dos cards no Trello**.
Quando um desenvolvedor tiver dúvidas, precisar de auxílio passo a passo ou necessitar de pequenas correções de código, ele pode acionar diretamente o agente especialista marcando o `@handle` correspondente no comentário do card.

### Como funciona o fluxo:
1. O desenvolvedor escreve um comentário no card do Trello marcando o agente (ex: `@peter pode me ajudar com a validação deste DTO?`).
2. O **@dispatcher** intercepta o comentário no Trello e encaminha a demanda ao agente correspondente.
3. O agente analisa o contexto da tarefa, o repositório/branch e responde diretamente no card com a orientação ou código.

---

## 2. Regra Crítica de Incerteza e Escalonamento (Fallback para o PO/CTO)

> ⚠️ **REGRA DE OURO PARA TODOS OS AGENTES:**
> Caso o agente **não tenha certeza absoluta** da resposta, encontre ambiguidade no escopo ou a ação envolva uma decisão de produto/arquitetura não documentada:
> 
> 1. **No Trello:** O agente deve responder imediatamente ao desenvolvedor informando:
>    > *"Essa questão necessita de alinhamento com o PO/CTO (@domaragao). Vou acioná-lo para definirmos o direcionamento exato."*
> 2. **No Telegram:** O agente deve enviar uma notificação para o **@domaragao** via **@friday** (@hermes), detalhando a dúvida, o desenvolvedor solicitante e o link do card correspondente.

---

## 3. Catálogo de Agentes, Responsabilidades e Tipos de Apoio

| Agente | Handle Trello | Especialidade | Tipos de Auxílio Prestados |
| :--- | :--- | :--- | :--- |
| **Dijkstra** | `@dijkstra` | Tech Lead & Arquiteto | - Dúvidas sobre arquitetura geral e divisão de módulos.<br>- Definição de padrões de projeto e estrutura de diretórios.<br>- Contratos de API (OpenAPI/Swagger) e modelagem relacional.<br>- Resolução de impasses técnicos conceituais. |
| **Peter** | `@peter` | Backend Sênior (Spring Boot / Java & Django) | - Passo a passo para criação de Controllers, Services, DTOs e Repositories.<br>- Depuração de erros de compilação, exceções e logs no Spring Boot.<br>- Orientação para queries JPA/Hibernate e migrations Liquibase/Flyway.<br>- Suporte na implementação de regras de negócio no backend. |
| **Aria** | `@aria` | Frontend Sênior (React / Bootswatch) | - *Nota:* Atuação sob demanda em tasks atribuídas a @domaragao.<br>- Dúvidas sobre componentes funcionais React, Hooks e gerenciamento de estado.<br>- Integração com classes e estilos Bootswatch (Bootstrap 5).<br>- Consumo de APIs REST via Fetch/Axios. |
| **Iris** | `@iris` | UI/UX Designer (Penpot & Design System) | - Dúvidas sobre tokens de cores, tipografia, grids e espaçamentos.<br>- Alinhamento sobre comportamentos responsivos (Desktop vs. Mobile).<br>- Esclarecimento sobre estados de componentes (hover, focus, disabled).<br>- Exportação e fornecimento de assets/ícones do Penpot. |
| **QA** | `@qa` | QA Sênior Full Stack | - Esclarecimento sobre critérios de aceite e regras de negócio da User Story.<br>- Auxílio na escrita de testes unitários e de integração.<br>- Pré-validação de código antes da abertura de Pull Request (PR).<br>- Diagnóstico de cenários de borda e validações de input. |
| **Atlas** | `@atlas` | Gerente de Produto (PM) | - Esclarecimento sobre regras de negócio e objetivos da User Story.<br>- Fatiamento de escopo e priorização de requisitos.<br>- Dúvidas sobre o fluxo funcional do usuário final. |
| **Dispatcher** | `@dispatcher` | Trello Router | - Roteador central: monitora e distribui menções do Trello aos agentes. |
| **Friday** | `@friday` / `@hermes` | Hub Central / Secretária | - Notificações diretas ao PO/CTO (@domaragao) no Telegram em caso de impedimentos e dúvidas de escopo. |

---

## 4. Exemplos Práticos de Interação

### Exemplo 1: Dúvida de Backend com `@peter`
**Comentário do Dev (@andreyrian3):**
> `@peter Estou implementando o endpoint de cadastro de usuário, mas o Spring está retornando 400 Bad Request sem mensagem clara. Como configuro o @Valid no DTO para detalhar os erros de validação?`

**Resposta do @peter:**
> `@andreyrian3 Para capturar e formatar os erros de validação com @Valid, você precisa:
> 1. Garantir as anotações no DTO (ex: \`@NotBlank(message = "O email é obrigatório")\`).
> 2. Criar ou estender um \`@RestControllerAdvice\` com o método \`handleMethodArgumentNotValid\`.
> Segue o snippet de exemplo para o nosso padrão de retorno:
> \`\`\`java
> @ExceptionHandler(MethodArgumentNotValidException.class)
> public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) { ... }
> \`\`\``

---

### Exemplo 2: Dúvida de Design/Tokens com `@iris`
**Comentário da Dev (@jenniferrebecaalvesdebarros):**
> `@iris Qual é o token de cor e a classe Bootswatch para o botão de ação secundária na tela de Recuperação de Senha (1C)?`

**Resposta da @iris:**
> `@jenniferrebecaalvesdebarros Na tela 1C utilizamos o token \`--color-secondary-action\` (#6C757D). No nosso tema Bootswatch, você deve utilizar a classe \`btn btn-outline-primary\` para ações secundárias ou \`btn btn-link\` para o botão 'Voltar ao login'. O protótipo pode ser consultado na página Mobile do Penpot.`

---

### Exemplo 3: Dúvida de Critérios de Aceite com `@qa`
**Comentário do Dev (@andreyrian3):**
> `@qa No card DAC-14, o critério de aceite diz que o token expira em 15 minutos. Devo testar isso via teste de unidade mockando o Clock?`

**Resposta do @qa:**
> `@andreyrian3 Exato! Recomendamos injetar um \`Clock\` no serviço para testar o cenário de token válido e token expirado sem depender de \`Thread.sleep\`. Se precisar, posso fornecer a estrutura do teste de unidade com JUnit 5 e Mockito.`

---

### Exemplo 4: Cenário com Incerteza (Fallback para o PO via `@friday`)
**Comentário do Dev (@jenniferrebecaalvesdebarros):**
> `@atlas O usuário deve conseguir reenviar o email de recuperação sem limite de tentativas ou devemos implementar um rate limit de 3 tentativas por hora?`

**Resposta do @atlas no Trello:**
> `@jenniferrebecaalvesdebarros Essa regra de rate limit de recuperação não está fechada na US02. Essa decisão precisa de alinhamento com o PO/CTO (@domaragao). Vou acioná-lo imediatamente para definirmos o direcionamento exato.`

**Ação de background do @atlas:**
> Envia mensagem via `message_agent` para `@hermes` solicitando envio de alerta no Telegram para @domaragao com a pergunta e o link do card.

---

## 5. Boas Práticas para os Desenvolvedores
1. **Seja específico:** Inclua trecho de código, logs de erro ou print do comportamento inesperado.
2. **Indique a branch:** Informe em qual branch (`feature/dac-<id>-desc`) a dúvida está ocorrendo.
3. **Mencione o agente correto:** Use a tabela acima para direcionar a pergunta ao especialista adequado.
