require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  connectionString: process.env.DB_CONNECTION,
  secret: process.env.SECRET,
};
