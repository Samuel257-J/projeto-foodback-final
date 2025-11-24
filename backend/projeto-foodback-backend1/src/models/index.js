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

  console.log("📦 Carregando model:", file, "->", modelModule.default?.name || "unnamed");

  const model = modelModule.default(sequelize, Sequelize.DataTypes);

  db[model.name] = model;
}

console.log("📋 Models carregados:", Object.keys(db));

// ========== RELACIONAMENTOS MANUAIS ==========
// Como você está usando carregamento dinâmico, vamos definir os relacionamentos aqui

const { Usuario, Empresa, Ong, Doacao, ItemDoacao, Solicitacao } = db;

if (Usuario && Empresa) {
  // Usuario -> Empresa (1:1)
  Usuario.hasOne(Empresa, { foreignKey: "id_usuario" });
  Empresa.belongsTo(Usuario, { foreignKey: "id_usuario" });
  console.log("✅ Relacionamento Usuario <-> Empresa configurado");
}

if (Usuario && Ong) {
  // Usuario -> Ong (1:1)
  Usuario.hasOne(Ong, { foreignKey: "id_usuario" });
  Ong.belongsTo(Usuario, { foreignKey: "id_usuario" });
  console.log("✅ Relacionamento Usuario <-> Ong configurado");
}

if (Empresa && Doacao) {
  // Empresa -> Doacao (1:N)
  Empresa.hasMany(Doacao, { foreignKey: "id_empresa" });
  Doacao.belongsTo(Empresa, { foreignKey: "id_empresa" });
  console.log("✅ Relacionamento Empresa <-> Doacao configurado");
}

if (Doacao && ItemDoacao) {
  // Doacao -> ItemDoacao (1:N)
  Doacao.hasMany(ItemDoacao, { foreignKey: "id_doacao" });
  ItemDoacao.belongsTo(Doacao, { foreignKey: "id_doacao" });
  console.log("✅ Relacionamento Doacao <-> ItemDoacao configurado");
}

// ✅ NOVOS RELACIONAMENTOS: Solicitacao
if (Doacao && Solicitacao) {
  // Doacao -> Solicitacao (1:N)
  Doacao.hasMany(Solicitacao, { foreignKey: "id_doacao" });
  Solicitacao.belongsTo(Doacao, { foreignKey: "id_doacao" });
  console.log("✅ Relacionamento Doacao <-> Solicitacao configurado");
}

if (Ong && Solicitacao) {
  // Ong -> Solicitacao (1:N)
  Ong.hasMany(Solicitacao, { foreignKey: "id_ong" });
  Solicitacao.belongsTo(Ong, { foreignKey: "id_ong" });
  console.log("✅ Relacionamento Ong <-> Solicitacao configurado");
}

// Aplica associações definidas dentro dos próprios models (se houver)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    console.log(`✅ Associações do model ${modelName} aplicadas`);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("🎉 Todos os models e relacionamentos foram configurados!");

export default db;