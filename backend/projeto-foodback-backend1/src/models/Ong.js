export default (sequelize, DataTypes) => {
  const Ong = sequelize.define(
    "Ong",
    {
      id_ong: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      natureza_juridica: DataTypes.STRING(120),
      area_atuacao: DataTypes.STRING(150),
      descricao: DataTypes.TEXT,
      ano_fundacao: DataTypes.INTEGER,
      numero_pessoas_atendidas: DataTypes.INTEGER,
      tipo_publico: DataTypes.STRING(150),
      necessidades: DataTypes.TEXT,
      capacidade_armazenamento: DataTypes.STRING(80),
      possui_transporte: { type: DataTypes.BOOLEAN, defaultValue: false },
      responsavel_recebimento: DataTypes.STRING(120),
      telefone_responsavel: DataTypes.STRING(20),
      horarios_disponiveis: DataTypes.STRING(120),
      perfil_completo: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    { tableName: "ongs", timestamps: false }
  );

 Ong.associate = (models) => {
  Ong.belongsTo(models.Usuario, { 
    foreignKey: "id_usuario",
    as: "usuario"   // alias corrigido
  });
};



  return Ong;
};