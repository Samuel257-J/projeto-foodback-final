export default (sequelize, DataTypes) => {
  const LogAcao = sequelize.define(
    "LogAcao",
    {
      id_acao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      descricao_acao: DataTypes.TEXT
    },
    { tableName: "logs_acoes", timestamps: false }
  );

  LogAcao.associate = (models) => {
    LogAcao.belongsTo(models.Usuario, { foreignKey: "id_usuario" });
  };

  return LogAcao;
};
