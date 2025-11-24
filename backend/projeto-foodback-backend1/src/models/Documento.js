export default (sequelize, DataTypes) => {
  const Documento = sequelize.define(
    "Documento",
    {
      id_documento: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      tipo_documento: DataTypes.STRING(80),
      caminho_arquivo: DataTypes.STRING(255),
      validado: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    { tableName: "documentos", timestamps: false }
  );

  Documento.associate = (models) => {
    Documento.belongsTo(models.Usuario, { foreignKey: "id_usuario" });
  };

  return Documento;
};
