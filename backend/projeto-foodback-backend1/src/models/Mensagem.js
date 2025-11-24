export default (sequelize, DataTypes) => {
  const Mensagem = sequelize.define(
    "Mensagem",
    {
      id_mensagem: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_solicitacao: { type: DataTypes.INTEGER, allowNull: false },
      id_remetente: { type: DataTypes.INTEGER, allowNull: false },
      mensagem: { type: DataTypes.TEXT, allowNull: false },
      lida: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    { tableName: "mensagens", timestamps: false }
  );

  Mensagem.associate = (models) => {
    Mensagem.belongsTo(models.Solicitacao, { foreignKey: "id_solicitacao" });
    Mensagem.belongsTo(models.Usuario, { foreignKey: "id_remetente" });
  };

  return Mensagem;
};
