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
│ └── projeto-foodback-backend1/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ └── server.js
│ ├── package.json
│ └── ...
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

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
