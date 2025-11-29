import express from "express";
import cors from "cors";
import empresaRoutes from "./src/routes/empresaRoutes.js";
import ongRoutes from "./src/routes/ongRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import perfilRoutes from "./src/routes/perfilRoutes.js";
import doacaoRoutes from "./src/routes/doacaoRoutes.js"; 
import itemDoacaoRoutes from "./src/routes/itemDoacaoRoutes.js"; 
import solicitacaoRoutes from "./src/routes/solicitacaoRoutes.js";
import retiradaRoutes from "./src/routes/retiradaRoutes.js";
import sequelize from "./src/config/database.js";
import mercadoPagoRoutes from "./src/routes/mercadoPagoRoutes.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

// Rotas existentes
app.use("/empresa", empresaRoutes);
app.use("/ong", ongRoutes);
app.use("/api", authRoutes);
app.use("/perfil", perfilRoutes);

// ✅ ROTAS DE FUNCIONALIDADES
app.use("/doacoes", doacaoRoutes);
app.use("/itens-doacao", itemDoacaoRoutes);
app.use("/solicitacoes", solicitacaoRoutes);
app.use("/retiradas", retiradaRoutes);
app.use("/api/mercadopago", mercadoPagoRoutes);

sequelize.sync().then(() => {
  console.log("Conectado ao MySQL com sucesso!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});