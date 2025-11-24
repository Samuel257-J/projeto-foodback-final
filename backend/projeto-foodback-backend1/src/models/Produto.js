export default (sequelize, DataTypes) => {
  const Produto = sequelize.define("Produto", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    validade: {
      type: DataTypes.DATE,
      allowNull: true
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Produto;
};
