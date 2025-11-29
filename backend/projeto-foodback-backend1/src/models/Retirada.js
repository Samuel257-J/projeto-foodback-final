export default (sequelize, DataTypes) => {
  const Retirada = sequelize.define(
    "Retirada",
    {
      id_retirada: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },

      id_solicitacao: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
      },

      responsavel_retirada: DataTypes.STRING(120),
      tipo_transporte: DataTypes.STRING(120),
      observacoes: DataTypes.TEXT,

      // Novos campos
      data_retirada: {
        type: DataTypes.DATEONLY,   // DATE sem horário
        allowNull: true
      },

      horario_retirada: {
        type: DataTypes.TIME,       // Apenas horário
        allowNull: true
      }
    },
    { 
      tableName: "retiradas", 
      timestamps: false 
    }
  );

  Retirada.associate = (models) => {
    Retirada.belongsTo(models.Solicitacao, { foreignKey: "id_solicitacao" });
  };

  return Retirada;
};
