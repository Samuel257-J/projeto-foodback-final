export default (sequelize, DataTypes) => {
  const Sessao = sequelize.define("Sessao", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expiracao: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  return Sessao;
};
