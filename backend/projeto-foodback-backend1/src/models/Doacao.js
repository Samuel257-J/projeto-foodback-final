export default (sequelize, DataTypes) => {
  const Doacao = sequelize.define(
    "Doacao",
    {
      id_doacao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_empresa: { type: DataTypes.INTEGER, allowNull: false },
      titulo: { type: DataTypes.STRING(150), allowNull: false },
      descricao: DataTypes.TEXT,
      categoria: DataTypes.STRING(80),
      quantidade: DataTypes.STRING(50),
      validade: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM("disponivel", "reservada", "retirada", "cancelada"),
        defaultValue: "disponivel"
      }
    },
    { tableName: "doacoes", timestamps: false }
  );

  Doacao.associate = (models) => {
    // Uma doação pertence a uma empresa
    Doacao.belongsTo(models.Empresa, { foreignKey: "id_empresa" });
    
    // Uma doação tem muitos itens
    Doacao.hasMany(models.ItemDoacao, { foreignKey: "id_doacao" });
    
    // Uma doação tem muitas solicitações
    Doacao.hasMany(models.Solicitacao, { foreignKey: "id_doacao" });
  };

  return Doacao;
};