```markdown
# 🎯 Rodney Papiro

> **Plataforma completa e gratuita para gestão de estudos, ciclo de revisões espaçadas e fechamento de editais para concursos públicos.**

---

## 💡 Sobre o Projeto

O **Rodney Papiro** nasceu com o propósito de democratizar o acesso a ferramentas de estudo de alta performance. O projeto foi desenvolvido para atender a uma necessidade real de familiares que precisavam de um método organizado para estudar para concursos públicos, mas não tinham condições financeiras de arcar com as assinaturas caras das plataformas comerciais do mercado

A plataforma integra cronograma de estudos, ciclo de revisões automáticas, controle de editais verticalizados, cronômetro com modo de concentração imersivo e cadernos de erros/resumos em um ambiente limpo, direto e sem distrações

---

## 🚀 Funcionalidades Principais

### 📊 Dashboard & Métricas de Desempenho
- **Controle de Tempo Líquido:** Acompanhamento de horas estudadas na semana e meta semanal
- **Métricas de Questões:** Total de questões resolvidas, acertos e taxa percentual de precisão
- **Ofensiva de Constância:** Indicador de dias seguidos de estudo (streak)

### 🏆 Gestão de Concursos & Disciplinas
- Suporte a múltiplos planos de concurso simultâneos (ex: PM-DF, Banco do Brasil, PF)
- Barra de **Progresso Real do Edital** (% concluído e tópicos restantes)
- Gerenciador completo de disciplinas e tópicos com ordenação e personalização de cores

### ⏱️ Sessão de Estudo & Modo Concentração
- **Cronômetro Líquido:** Inicie a contagem de tempo com um clique ou insira minutos manualmente
- **Modo Concentração (Tela Cheia):** Visual imersivo e sem distrações com cronômetro centralizado
- **Múltiplos Métodos de Estudo:** Registro de materiais utilizados (PDF, Videoaula, Questões, Lei Seca, Resumo Próprio)
- **Links Rápidos:** Integração direta com cadernos do TEC Concursos e videoaulas

### 📝 Caderno de Erros & Resumos (Editor Rico)
- Editor de texto integrado estilo Notion/Word com suporte a títulos, negrito, itálico, listas e destaques coloridos
- Separação clara entre **Caderno de Erros** (para registrar pegadinhas de provas) e **Resumos da Matéria**

### 🔄 Edital Verticalizado & Revisões Espaçadas
- Tabela verticalizada com controle de Teoria e 6 ciclos de revisões programadas ($R_1$ 24h, $R_2$ 7d, $R_3$ 15d, $R_4$ 30d, $R_5$ 60d, $R_6$ 90d)
- Sistema de **Revisão em Bloco** a cada 3 tópicos concluídos da mesma disciplina

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js** (Componentização moderna e hooks)
- **Vite** (Build tool e desenvolvimento ágil)
- **Tailwind CSS** (Design system responsivo e tema escuro)
- **Lucide React** (Ícones minimalistas)
- **Axios** (Comunicação com a API REST)

### Backend
- **Java 17+**
- **Spring Boot 3**
- **Spring Data JPA / Hibernate** (Mapeamento objeto-relacional)
- **PostgreSQL** (Banco de dados relacional robusto)
- **Maven** (Gerenciamento de dependências)

---

## 📦 Estrutura do Repositório

```text
rodney-papiro/
├── backend/       # API REST em Java / Spring Boot
└── frontend/      # Aplicação Single Page em React / Vite

```

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos

* Node.js (v18+)
* Java JDK 17+
* PostgreSQL rodando localmente

### 1. Backend (Spring Boot)

```bash
# Entre na pasta do backend
cd backend

# Configure o banco no arquivo src/main/resources/application.properties:
# spring.datasource.url=jdbc:postgresql://localhost:5432/papiro_db
# spring.datasource.username=seu_usuario
# spring.datasource.password=sua_senha

# Execute a aplicação
./mvnw spring-boot:run

```

*O servidor iniciará na porta `3333`.*

### 2. Frontend (React)

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

```

*Acesse no navegador: `http://localhost:5173`.*

---

## 👨‍💻 Autor

Desenvolvido por **Rodney Gois**

*Foco total no papiro. Quem não mede, não evolui.*

```

---

### Como subir o README para o GitHub:

Abra o terminal na raiz do projeto e execute:

```bash
git add README.md
git commit -m "docs: adiciona README com detalhes do projeto e proposta social"
git push origin main

```

Assim que subir, a página principal do seu repositório no GitHub ficará estruturada e pronta para ser visualizada.