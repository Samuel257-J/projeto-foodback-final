🥗 FOODBACK — Sistema de Doações de Alimentos

Sistema full-stack desenvolvido para conectar empresas doadoras (mercados, padarias, restaurantes etc.) com ONGs receptoras de alimentos.

Permite gerenciar doações, agendamento, retiradas, cadastro e muito mais.

🚀 Tecnologias Utilizadas
Frontend

React.js

Vite

Axios

React Router DOM

Backend

Node.js

Express

Sequelize

MySQL

JWT para autenticação

Banco de Dados

MySQL

📁 Estrutura do Projeto
Foodback-final/
 ├── backend/
 │     └── projeto-foodback-backend1/
 │           ├── src/
 │           │     ├── controllers/
 │           │     ├── models/
 │           │     ├── routes/
 │           │     └── server.js
 │           ├── package.json
 │           └── ...
 └── frontend/
       └── projeto-foodback-frontend/
             ├── src/
             ├── public/
             ├── package.json
             └── ...

🧪 Como Rodar o Projeto
📌 1. Clonar o repositório
git clone https://github.com/Samuel257-J/projeto-foodback-final.git
cd projeto-foodback-final

📌 2. Rodar o Backend
cd backend/projeto-foodback-backend1
npm install
npm start


Ou em modo desenvolvimento (se configurado):

npm run dev


🔐 Crie seu .env baseado no arquivo .env.example:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=foodback
JWT_SECRET=seu_token

📌 3. Rodar o Frontend
cd ../../frontend/projeto-foodback-frontend
npm install
npm run dev

🔌 Funcionalidades
👨‍🍳 Empresas Doadoras

Criam conta

Cadastram doações (nome, tipo, validade, quantidade)

Editam ou excluem doações

Agendam entregas

Visualizam histórico

🏘️ ONGs Receptoras

Criam conta

Visualizam doações disponíveis

Aceitam doações

Coordenam retirada

👥 Autores

Projeto desenvolvido por:

Samuel Vicente

Ethan Cohelet

Luiz Felipe

Marcelo Augusto

Paulo Ricardo

João Victor
