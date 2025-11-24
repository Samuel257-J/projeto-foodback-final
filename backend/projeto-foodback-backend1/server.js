import express from "express";
import cors from "cors";
import empresaRoutes from "./src/routes/empresaRoutes.js";
import ongRoutes from "./src/routes/ongRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import perfilRoutes from "./src/routes/perfilRoutes.js";
import doacaoRoutes from "./src/routes/doacaoRoutes.js"; // ✅ NOVO
import itemDoacaoRoutes from "./src/routes/itemDoacaoRoutes.js"; // ✅ NOVO
import sequelize from "./src/config/database.js";
import solicitacaoRoutes from "./src/routes/solicitacaoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas existentes
app.use("/empresa", empresaRoutes);
app.use("/ong", ongRoutes);
app.use("/api", authRoutes);
app.use("/perfil", perfilRoutes);

// ✅ NOVAS ROTAS
app.use("/doacoes", doacaoRoutes);
app.use("/itens-doacao", itemDoacaoRoutes);
app.use("/solicitacoes", solicitacaoRoutes);

sequelize.sync().then(() => {
  console.log("Conectado ao MySQL com sucesso!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});