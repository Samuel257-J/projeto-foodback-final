import sequelize from "../config/database.js";

async function fixDatabase() {
  try {
    // Verifica se a coluna já existe antes de adicionar
    const [ongsColumns] = await sequelize.query(`
      SHOW COLUMNS FROM ongs LIKE 'id_usuario'
    `);

    if (ongsColumns.length === 0) {
      await sequelize.query(`
        ALTER TABLE ongs 
        ADD COLUMN id_usuario INT NOT NULL AFTER id_ong,
        ADD CONSTRAINT fk_ong_usuario 
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
      `);
      console.log("✅ Coluna id_usuario adicionada à tabela ongs");
    } else {
      console.log("ℹ️ Coluna id_usuario já existe na tabela ongs");
    }

    const [empresasColumns] = await sequelize.query(`
      SHOW COLUMNS FROM empresas LIKE 'id_usuario'
    `);

    if (empresasColumns.length === 0) {
      await sequelize.query(`
        ALTER TABLE empresas 
        ADD COLUMN id_usuario INT NOT NULL AFTER id_empresa,
        ADD CONSTRAINT fk_empresa_usuario 
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
      `);
      console.log("✅ Coluna id_usuario adicionada à tabela empresas");
    } else {
      console.log("ℹ️ Coluna id_usuario já existe na tabela empresas");
    }

    console.log("🎉 Banco de dados atualizado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao atualizar banco:", error);
    process.exit(1);
  }
}

fixDatabase();