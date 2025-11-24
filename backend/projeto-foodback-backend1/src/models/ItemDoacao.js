export default (sequelize, DataTypes) => {
  const ItemDoacao = sequelize.define(
    "ItemDoacao",
    {
      id_item_doacao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_doacao: { type: DataTypes.INTEGER, allowNull: false },
      nome_item: DataTypes.STRING(150),
      quantidade: DataTypes.STRING(50),
      unidade_medida: DataTypes.STRING(20)
    },
    { tableName: "itens_doacao", timestamps: false }
  );

  ItemDoacao.associate = (models) => {
    ItemDoacao.belongsTo(models.Doacao, { foreignKey: "id_doacao" });
  };

  return ItemDoacao;
};
