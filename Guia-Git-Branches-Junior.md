# Guia Prático de Git e Fluxo de Branches — Time Classdoor

**Público-alvo:** Desenvolvedores Júnior (@andreyrian3 e @jenniferrebecaalvesdebarros) e Toda a Equipe de Engenharia  
**Projeto:** Classdoor (Frontend & Backend)  
**Autor:** @Dijkstra (Tech Lead)  
**Data:** 2026-09-01  
**Repositório Base:** `Gabriel-Aragao/classdoor-frontend`  

---

## 🎯 1. Visão Geral do Nosso Fluxo (Git Flow Simplificado)

Para manter o código seguro, organizado e sem conflitos, adotamos o seguinte modelo de branches:

- **`main`**: Código em produção (estável, testado e aprovado). Ninguém commita direto na `main`.
- **`dev`**: Branch principal de desenvolvimento e integração contínua. **Todas as novas tarefas saem da `dev` e retornam para a `dev` via Pull Request (PR)**.
- **`feature/dac-<id>-<descricao-curta>`**: Suas branches de trabalho individual criadas a partir da `dev`.

```text
       (Criação da Feature)
 [dev] ───────────────> [feature/dac-005-tela-login]
   │                               │
   │                        (Desenvolve & Commita)
   │                               │
   │                          (Abre PR)
   │                               ▼
 [dev] <────────── (Aprovação @qa) ┘
```

---

## 🚀 2. Passo a Passo Prático: Do Início da Task ao Pull Request

### Passo 1: Atualizar a sua branch `dev` local
Antes de começar qualquer tarefa nova, garanta que sua máquina tenha a versão mais recente da `dev`:

```bash
# 1. Vá para a branch dev
git checkout dev

# 2. Baixe as últimas atualizações do repositório remoto
git pull origin dev
```

---

### Passo 2: Criar sua branch de trabalho
O nome da sua branch **DEVE** seguir o padrão oficial do projeto:  
`feature/dac-<id>-<descricao-curta>`

Exemplos:
- `feature/dac-005-tela-login`
- `feature/dac-006-cadastro-usuario`
- `feature/dac-007-busca-professores`

Para criar e entrar na nova branch a partir da `dev`:

```bash
git checkout -b feature/dac-005-tela-login
```

---

### Passo 3: Desenvolver e Commitar no Padrão da Equipe
Faça as alterações necessárias no código (seguindo React 19 + JS puro + Bootswatch).

Ao commitar, utilize o **padrão obrigatório de mensagens**:  
`[seu_identificador] - tipo: descrição clara da alteração`

Exemplos de commits:
```bash
# Exemplo para o Andrey:
git add .
git commit -m "[andrey] - feat: adicionar formulario de cadastro com validacao bootswatch"

# Exemplo para a Jennifer:
git add .
git commit -m "[jennifer] - feat: implementar tela de login e integracao com api de auth"

# Exemplo de correção de bug / ajuste:
git commit -m "[andrey] - fix: ajustar responsividade dos inputs no mobile"
```

> 💡 **Tipos comuns de commits:**
> - `feat:` Nova funcionalidade ou componente.
> - `fix:` Correção de bug ou erro.
> - `style:` Ajustes puramente visuais/CSS sem alterar lógica.
> - `refactor:` Melhoria de código sem alterar comportamento.
> - `docs:` Alterações em documentação ou comentários.

---

### Passo 4: Publicar sua branch no GitHub
Após terminar e testar seu código localmente (`npm run build` e `npm run lint` passando com zero erros):

```bash
git push -u origin feature/dac-005-tela-login
```

---

### Passo 5: Abrir o Pull Request (PR) apontando para a `dev`
1. Acesse o repositório no GitHub: `https://github.com/Gabriel-Aragao/classdoor-frontend`
2. Clique no botão verde **"Compare & pull request"**.
3. ⚠️ **ATENÇÃO CRÍTICA (Base Repository):**
   - **`base branch`**: selecione **`dev`** *(NÃO selecione `main`)*.
   - **`compare branch`**: selecione a sua branch (ex: `feature/dac-005-tela-login`).
4. **Título do PR:** `[DAC-<ID>] Título descritivo da tarefa` (ex: `[DAC-005] Implementação da Tela de Login`).
5. **Descrição do PR:** Preencha o resumo do que foi feito e liste os critérios de aceite atendidos:
   ```markdown
   ## 📌 Resumo da Entrega
   Implementada a tela de login utilizando React 19 e componentes Bootswatch.

   ## ✅ Critérios de Aceite Atendidos
   - [x] Formulário com campos de E-mail, Senha e Lembrar-me
   - [x] Validação visual de campos obrigatórios
   - [x] Integração com endpoint POST /api/v1/auth/login
   - [x] npm run build e npm run lint aprovados
   ```
6. Clique em **"Create pull request"**.

---

### Passo 6: Notificar no Trello e Aguardar o Review do @qa
1. Vá até o card correspondente no quadro **Dac** do Trello.
2. Mova o card para a coluna **"Review"**.
3. Adicione um comentário no card marcando seu identificador e o link do PR:
   ```text
   @Nome (Função): Tarefa concluída e PR #XX aberto apontando para a branch dev.
   Link do PR: https://github.com/Gabriel-Aragao/classdoor-frontend/pull/XX
   Critérios de aceite validados e build 100% verde. Pronto para review do @QA (Quality Assurance).
   ```
4. O **@qa** realizará o review oficial (8 pilares de qualidade). 
   - Se aprovado: o @qa autoriza o merge na `dev` e move o card para **Done**.
   - Se houver ajustes: o @qa apontará as correções no card e você fará novos commits na sua mesma branch.

---

## 🛠️ 3. Dicas de Ouro & Comandos Úteis

| Situação | Comando |
| :--- | :--- |
| Ver em qual branch você está | `git status` ou `git branch` |
| Descartar alterações não salvas | `git restore .` |
| Trazer atualizações da dev para sua feature | `git checkout dev && git pull && git checkout sua-branch && git merge dev` |
| Ver histórico resumido de commits | `git log --oneline -n 5` |

---

Se tiverem qualquer dúvida técnica sobre arquitetura, contratos de API ou Git, podem me acionar (@dijkstra) a qualquer momento no Bot Chat! Boa codificação a todos! 🚀
