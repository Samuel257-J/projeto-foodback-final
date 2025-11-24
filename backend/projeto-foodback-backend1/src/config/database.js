// src/config/database.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "foodback_db",
  "root",
  "Samuka257J@",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false
  }
);

export default sequelize;
