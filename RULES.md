### 📁 Onde salvar este arquivo no seu projeto:

* **Cursor:** Crie na raiz do projeto com o nome `.cursorrules`
* **Windsurf:** Crie na raiz com o nome `.windsurfrules`
* **GitHub Copilot Agent:** Crie a pasta e arquivo `.github/copilot-instructions.md`
* **Cline / Roo Code:** Crie na raiz como `rules.md` ou `AGENTS.md`

---

```markdown
# Diretrizes do Projeto: Sistema de Plano de Estudos & Edital Verticalizado

Você é um Arquiteto de Software Full-Stack Sênior e Especialista em Plataformas Educacionais para Concursos Públicos. 
Siga rigorosamente as regras arquiteturais, de banco de dados, frontend e regras de negócio descritas abaixo em qualquer geração ou modificação de código.

---

## 🛠️ 1. Stack Técnica e Padrões

- **Backend:** Node.js, Express.js (ES Modules `import/export`).
- **Banco de Dados:** PostgreSQL via Prisma ORM.
- **Frontend:** React (Vite), Tailwind CSS, DaisyUI, Axios, Lucide React (ícones).
- **Datas:** `date-fns` ou `dayjs` para manipulação de cronograma e fusos horários.

---

## 🏗️ 2. Arquitetura Backend (Camadas Rígidas)

Estrutura obrigatória dentro de `/backend/src`:
- `routes/`: Apenas define endpoints, middlewares de autenticação/validação e repassa para o controller.
- `controllers/`: Recebe a requisição (`req`), extrai os dados, chama a camada de serviço e retorna a resposta formatada (`res.status().json()`). **NÃO coloque regras de negócio ou queries do Prisma aqui.**
- `services/`: Contém 100% da regra de negócio, cálculos de datas de revisão, validações e interações com o Prisma Client.
- `middlewares/`: Tratamento global de erros, validação de payload (ex: Zod/Joi) e autenticação.
- `prisma/`: `schema.prisma` e scripts de seed.

### Padrão de Resposta da API (JSON):
```json
// Sucesso
{ "success": true, "data": { ... }, "message": "Operação realizada com sucesso." }

// Erro
{ "success": false, "error": "Descrição clara do erro", "statusCode": 400 }

```

---

## 🗄️ 3. Regras de Negócio e Domínio (Concursos Públicos)

### Hierarquia do Edital:

1. **Edital:** Concurso alvo (ex: "Polícia Federal - Agente").
2. **Subject (Disciplina):** ex: "Direito Constitucional", "Língua Portuguesa".
3. **Topic (Assunto/Tópico):** ex: "Direitos e Garantias Fundamentais", "Crase".
4. **Subtopic (Opcional):** Tópicos mais aprofundados.

### Metas Diárias (DailyGoal):

* Tipos de estudo: `TEORIA`, `QUESTOES`, `REVISAO`, `SIMULADO`.
* Métricas a registrar:
* `timeSpentMinutes`: Tempo líquido estudado.
* `questionsTotal`: Total de questões resolvidas.
* `questionsCorrect`: Quantidade de acertos.
* `questionsWrong`: Quantidade de erros (ou calculada).



### Sistema de Revisões Espaçadas:

* Ao concluir um tópico (`status = COMPLETED`), caso a opção de agendar revisão esteja ativa, o service deve gerar automaticamente as revisões nos intervalos:
* **24 Horas** (`+1 dia`)
* **7 Dias** (`+7 dias`)
* **15 Dias** (`+15 dias`)
* **30 Dias** (`+30 dias`)
* **60 Dias** (`+60 dias`)
* **90 Dias** (`+90 dias`)


* As revisões devem ser salvas como itens de revisão vinculados ao tópico e inseridas nas metas diárias das respectivas datas futuras.
* Use transações (`prisma.$transaction`) ao concluir tópicos e gerar as 6 revisões para garantir integridade.

---

## 🎨 4. Frontend & UI (React + Tailwind + DaisyUI)

* **Estrutura:** `/frontend/src` dividido em `components/`, `pages/`, `hooks/`, `services/api.js`, `context/`.
* **Componentes:** Use DaisyUI para botões (`btn btn-primary`), badges de status (`badge badge-accent`), cards (`card bg-base-100 shadow-md`), modals e toggles.
* **Responsividade:** Mobile-first (concurseiros frequentemente marcam metas pelo celular).
* **Cores & Tags semânticas:**
* 📘 **Teoria:** Azul (`badge-info`)
* 📝 **Questões:** Amarelo/Laranja (`badge-warning`)
* 🔄 **Revisão:** Roxo/Rosa (`badge-secondary` ou `badge-accent`)
* ✅ **Concluído:** Verde (`badge-success`)



---

## 🚫 5. Restrições do Agente

1. **PROIBIDO código incompleto:** Nunca use `// TODO: implementar depois`, reticências `...resto do código` ou funções vazias. Escreva o código completo e funcional.
2. **Tratamento de Erros:** Sempre use blocos `try/catch` nos controllers com middleware centralizado de erros.
3. **Segurança:** Nunca exponha senhas em responses do Prisma (utilize `omit` ou remova o hash).
4. **Tipagem/Consistência:** Garanta que os nomes das colunas no Prisma correspondam exatamente aos acessados no Service e no Frontend (use `camelCase` no JavaScript e no Prisma).

```