export default (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nome: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false },
      senha_hash: { type: DataTypes.STRING(255), allowNull: false },
      telefone: DataTypes.STRING(20),
      endereco_rua: DataTypes.STRING(120),
      endereco_numero: DataTypes.STRING(20),
      endereco_bairro: DataTypes.STRING(80),
      endereco_cidade: DataTypes.STRING(80),
      endereco_estado: DataTypes.STRING(2),
      endereco_cep: DataTypes.STRING(12),
      cnpj: DataTypes.STRING(20),
      tipo_usuario: {
        type: DataTypes.ENUM("empresa", "ong", "admin"),
        allowNull: false
      },
      status_conta: {
        type: DataTypes.ENUM("ativo", "pendente", "bloqueado"),
        defaultValue: "pendente"
      }
    },
    { tableName: "usuarios", timestamps: false }
  );

  Usuario.associate = (models) => {
    Usuario.hasOne(models.Ong, { 
      foreignKey: "id_usuario",
      as: "ong" // ⭐ alias único
    });

    Usuario.hasOne(models.Empresa, { 
      foreignKey: "id_usuario",
      as: "empresa" // ⭐ alias único
    });
  };


  return Usuario;
};
