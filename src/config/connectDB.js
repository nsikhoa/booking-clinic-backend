const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bookingcheckup", "root", "Sksinh113@", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// const sequelize = new Sequelize("sql6584560", "sql6584560", "wFnHy4uqcG", {
//   host: "sql6.freesqldatabase.com",
//   dialect: "mysql",
//   logging: false,
//   define: { charset: "utf8", collate: "utf8_unicode_ci" },
// });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectDB;
