//requerir a pg
const { Pool } = require("pg");

const config = {
  host: "localhost",
  database: "banco",
  user: "postgres",
  password: "geraldine19",
  port: 5432,
};
const pool = new Pool(config);

module.exports = pool;
