WePlan 💰

O WePlan é uma aplicação web para gestão financeira familiar, focada em colaboração e simplicidade. O objetivo é permitir que famílias controlem receitas, despesas e orçamentos em conjunto.

🚀 Tecnologias

Este projeto é um Monorepo gerenciado pelo Turborepo e utiliza as seguintes tecnologias:

Frontend (apps/frontend)

React com TypeScript

Vite (Build tool)

Ant Design (Componentes de UI)

Styled Components (Estilização)

Axios (Comunicação com API)

Backend (apps/backend)

Node.js com Express

TypeScript

Prisma ORM (Banco de dados)

PostgreSQL (Banco de dados relacional via Docker)

Zod (Validação de dados)

JWT (Autenticação)

🛠️ Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

Node.js

pnpm (Gerenciador de pacotes)

Docker Desktop (Para rodar o banco de dados)

🏃‍♂️ Como Rodar o Projeto

Clone o repositório e acesse a pasta.

Instale as dependências:

pnpm install

Configure as Variáveis de Ambiente:

No backend: Crie um arquivo .env em apps/backend/ (configure DATABASE_URL e JWT_SECRET).

No frontend: Crie um arquivo .env em apps/frontend/ (configure VITE_API_URL).

Inicie o Banco de Dados:

docker-compose up -d

Rode as Migrações (Primeira vez):

# Dentro de apps/backend

pnpm prisma migrate dev

Inicie a Aplicação (Front + Back):

# Na raiz do projeto

pnpm dev

O frontend estará rodando em http://localhost:5173 e o backend em http://localhost:3333.

📂 Estrutura do Projeto

/
├── apps/
│ ├── backend/ # API Node.js/Express
│ └── frontend/ # Aplicação React
├── packages/ # Pacotes compartilhados (configurações, tipos)
└── docker-compose.yml

Feito por Lucas Soares Benfica.
