export default (sequelize, DataTypes) => {
  const LogAcesso = sequelize.define(
    "LogAcesso",
    {
      id_log: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      ip: DataTypes.STRING(45),
      acao: DataTypes.STRING(80)
    },
    { tableName: "logs_acesso", timestamps: false }
  );

  LogAcesso.associate = (models) => {
    LogAcesso.belongsTo(models.Usuario, { foreignKey: "id_usuario" });
  };

  return LogAcesso;
};
