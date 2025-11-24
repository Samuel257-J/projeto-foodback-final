export default (sequelize, DataTypes) => {
  const Empresa = sequelize.define(
    "Empresa",
    {
      id_empresa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      razao_social: DataTypes.STRING(150),
      tipo_empresa: DataTypes.STRING(120),
      descricao: DataTypes.TEXT,
      volume_medio_doacao: DataTypes.STRING(80),
      frequencia_doacao: DataTypes.STRING(80),
      observacoes: DataTypes.TEXT,
      responsavel_logistica: DataTypes.STRING(120),
      telefone_responsavel: DataTypes.STRING(20),
      horarios_disponiveis: DataTypes.STRING(120),
      pode_entregar: { type: DataTypes.BOOLEAN, defaultValue: false },
      capacidade_armazenamento: DataTypes.STRING(80),
      perfil_completo: { type: DataTypes.BOOLEAN, defaultValue: false } // ✅ NOVO CAMPO
    },
    { tableName: "empresas", timestamps: false }
  );

  Empresa.associate = (models) => {
    Empresa.belongsTo(models.Usuario, { foreignKey: "id_usuario" });
  };

  return Empresa;
};