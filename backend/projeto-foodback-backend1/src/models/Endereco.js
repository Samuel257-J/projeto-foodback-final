export default (sequelize, DataTypes) => {
  const Endereco = sequelize.define("Endereco", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rua: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Endereco;
};
