export default (sequelize, DataTypes) => {
  const Notificacao = sequelize.define("Notificacao", {
    id_notificacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dados_extras: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: "notificacoes",
    timestamps: true
  });

  return Notificacao;
};