# Guia de Comunicação e Suporte: Como Acionar os Agentes de IA no Trello

Este guia orienta os desenvolvedores do projeto (**@andreyrian3** e **@jenniferrebecaalvesdebarros**) sobre como solicitar auxílio, tirar dúvidas e receber suporte técnico da equipe de agentes especialistas de IA durante o desenvolvimento das tarefas.

---

## 💬 1. Como Solicitar Ajuda

O canal oficial para suporte técnico é a **seção de comentários dos cards no quadro Dac (Trello)**.

Quando você encontrar um bloqueio, tiver dúvida sobre a arquitetura, precisar de ajuda para debugar um erro ou necessitar de orientações sobre o design:
1. Abra o card no Trello referente à tarefa em que está trabalhando.
2. Escreva um comentário marcando o `@handle` do especialista desejado (veja a tabela abaixo).
3. Descreva sua dúvida, incluindo trechos de código, logs de erro ou referências de tela.
4. O especialista responderá diretamente no comentário do card com a solução, explicação passo a passo ou snippet de código.

---

## 👥 2. Catálogo de Especialistas e Tipos de Apoio

| Especialista | Menção no Trello | Especialidade | Como pode te ajudar |
| :--- | :--- | :--- | :--- |
| **Dijkstra** | `@dijkstra` | Tech Lead & Arquiteto | • Dúvidas sobre estrutura de pastas, pacotes e padrões de projeto.<br>• Contratos de API (REST/OpenAPI) e modelagem de banco de dados.<br>• Decisões técnicas e resolução de impasses arquiteturais. |
| **Peter** | `@peter` | Backend Sênior (Spring Boot / Java) | • Passo a passo para criação de Controllers, Services, DTOs e Repositories.<br>• Resolução de exceções, erros de compilação e validações (`@Valid`).<br>• Dúvidas de persistência JPA/Hibernate e migrations.<br>• Exemplos práticos de código e implementação de regras de negócio no backend. |
| **Aria** | `@aria` | Frontend Sênior (React / Bootswatch) | • Dúvidas conceituais sobre componentes funcionais React, Hooks e estado.<br>• Dicas de aplicação de classes CSS Bootswatch (Bootstrap 5).<br>• Consumo de endpoints REST via Fetch / Axios. |
| **Iris** | `@iris` | UI/UX Designer (Figma) | • Dúvidas sobre tokens de design (cores, tipografia, espaçamentos, elevações).<br>• Alinhamento sobre comportamentos responsivos (Desktop vs. Mobile).<br>• Estados de componentes (hover, active, disabled) e fluxo dos protótipos no Figma. |
| **QA** | `@qa` | QA Sênior Full Stack | • Esclarecimento sobre critérios de aceitação da User Story.<br>• Auxílio na escrita de testes unitários e de integração.<br>• Pré-avaliação do seu código antes da abertura do Pull Request.<br>• Validação de cenários de borda e regras de formulário. |
| **Atlas** | `@atlas` | Product Manager (PM) | • Dúvidas sobre o escopo, priorização e jornada do usuário final.<br>• Esclarecimento sobre regras de negócio funcionais e requisitos do MVP. |

---

## ⚖️ 3. Dúvidas sobre Escopo ou Regras de Negócio Não Definidas

Caso a sua dúvida envolva uma regra de negócio, comportamento ou decisão de produto que ainda não esteja documentada nas User Stories:
* O agente responderá no comentário informando que o ponto foi encaminhado para alinhamento com o **PO/CTO (@domaragao)**.
* Assim que a liderança definir o direcionamento, a resposta será publicada no próprio card para que você continue o desenvolvimento com total clareza.

---

## 📝 4. Exemplos de Interações no Trello

### Exemplo 1: Dúvida de Backend com `@peter`
**Seu comentário:**
> `@peter Estou implementando o endpoint de cadastro de usuário, mas o Spring está retornando 400 Bad Request sem mensagem clara. Como configuro o @Valid no DTO para detalhar os erros de validação?`

**Resposta do @peter:**
> Explicação de `@RestControllerAdvice` e método `handleMethodArgumentNotValid` com o snippet pronto para inclusão no projeto.

---

### Exemplo 2: Dúvida de Design/Tokens com `@iris`
**Seu comentário:**
> `@iris Qual é a classe Bootswatch e o token de cor para o botão secundário na tela de Recuperação de Senha (1C)?`

**Resposta da @iris:**
> Indicação do token `--color-secondary-action` e da classe `btn btn-outline-primary` com base na especificação do Figma.

---

### Exemplo 3: Dúvida de Testes com `@qa`
**Seu comentário:**
> `@qa No card 014, o critério diz que o token expira em 15 minutos. Como posso estruturar o teste unitário mockando o Clock?`

**Resposta do @qa:**
> Exemplo prático de teste unitário com JUnit 5 e Mockito demonstrando a injeção do `Clock`.

---

## 💡 5. Dicas para Obter Respostas Rápidas e Precisas
1. **Compartilhe o contexto:** Mencione a branch em que está trabalhando e o arquivo em questão.
2. **Envie os erros completos:** Copie a stack trace ou mensagem do console no comentário.
3. **Mencione o especialista correto:** Utilize a tabela da Seção 2 para direcionar ao agente ideal.
