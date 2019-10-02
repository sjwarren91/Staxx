require("dotenv").config();

module.exports = {
  development: {
    username: process.env.dbusername,
    password: process.env.password,
    database: process.env.database,
    host: "localhost",
    dialect: "mysql"
  },
  test: {
    username: "travis",
    database: "testdb",
    dialect: "mysql",
    logging: false
  },
  production: {
    useEnvVariable: "JAWSDB_URL",
    dialect: "mysql"
  }
};
