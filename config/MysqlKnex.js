require("dotenv").config();

const db = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
  },
});

module.exports = db;
