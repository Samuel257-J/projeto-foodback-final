export default (sequelize, DataTypes) => {
  const Assinatura = sequelize.define(
    "Assinatura",
    {
      id_assinatura: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id_usuario",
        },
      },

      tipo_usuario: {
        type: DataTypes.ENUM("empresa", "ong"),
        allowNull: false,
      },

      plano: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      metodo_pagamento: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("ativa", "cancelada", "suspensa"),
        defaultValue: "ativa",
      },

      data_inicio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      data_renovacao: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "assinaturas",
      timestamps: false,
    }
  );

  return Assinatura;
};
