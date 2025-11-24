export default (sequelize, DataTypes) => {
  const Solicitacao = sequelize.define(
    "Solicitacao",
    {
      id_solicitacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_doacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_ong: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pendente", "aprovada", "rejeitada", "concluida"),
        defaultValue: "pendente",
      },
      data_solicitacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      data_resposta: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "solicitacoes",
      timestamps: false,
    }
  );

  return Solicitacao;
};