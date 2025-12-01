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
        references: {
          model: "doacoes",
          key: "id_doacao",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_ong: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ongs",
          key: "id_ong",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: DataTypes.ENUM("pendente", "aprovada", "rejeitada", "concluida"),
        defaultValue: "pendente",
      },
      data_solicitacao: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
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

  // ASSOCIAÇÕES
  Solicitacao.associate = (models) => {
    Solicitacao.belongsTo(models.Doacao, {
      foreignKey: "id_doacao",
      as: "doacao",
    });

    Solicitacao.belongsTo(models.Ong, {
      foreignKey: "id_ong",
      as: "ong",
    });
  };

  return Solicitacao;
};
