import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import Sequelize from "sequelize";
import sequelize from "../config/database.js";

// Ajustes ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

// Teste de conexão
try {
  await sequelize.authenticate();
  console.log("✅ Conectado ao MySQL com sucesso!");
} catch (err) {
  console.error("❌ Erro ao conectar:", err);
}

// Carrega os models dinamicamente
const files = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"));

for (const file of files) {
  const modelPath = path.join(__dirname, file);
  const fileUrl = pathToFileURL(modelPath).href;

  const modelModule = await import(fileUrl);

  const model = modelModule.default(sequelize, Sequelize.DataTypes);

  db[model.name] = model;

  console.log("📦 Model carregado:", model.name);
}

console.log("📋 Models carregados:", Object.keys(db));

// =====================
//   RELACIONAMENTOS
// =====================

const { Usuario, Empresa, Ong, Doacao, ItemDoacao, Solicitacao, Retirada } = db;

if (Usuario && Empresa) {
  Usuario.hasOne(Empresa, { foreignKey: "id_usuario" });
  Empresa.belongsTo(Usuario, { foreignKey: "id_usuario" });
}

if (Usuario && Ong) {
  Usuario.hasOne(Ong, { foreignKey: "id_usuario" });
  Ong.belongsTo(Usuario, { foreignKey: "id_usuario" });
}

if (Empresa && Doacao) {
  Empresa.hasMany(Doacao, { foreignKey: "id_empresa" });
  Doacao.belongsTo(Empresa, { foreignKey: "id_empresa" });
}

if (Doacao && ItemDoacao) {
  Doacao.hasMany(ItemDoacao, { foreignKey: "id_doacao" });
  ItemDoacao.belongsTo(Doacao, { foreignKey: "id_doacao" });
}

// ---- Solicitacoes ----
if (Doacao && Solicitacao) {
  Doacao.hasMany(Solicitacao, { foreignKey: "id_doacao" });
  Solicitacao.belongsTo(Doacao, { foreignKey: "id_doacao" });
}

if (Ong && Solicitacao) {
  Ong.hasMany(Solicitacao, { foreignKey: "id_ong" });
  Solicitacao.belongsTo(Ong, { foreignKey: "id_ong" });
}

// ---- Retirada ----
if (Solicitacao && Retirada) {
  Solicitacao.hasOne(Retirada, { foreignKey: "id_solicitacao" });
  Retirada.belongsTo(Solicitacao, { foreignKey: "id_solicitacao" });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("🎉 Models e relacionamentos configurados com sucesso!");

export default db;
