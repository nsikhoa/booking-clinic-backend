"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Bookings", {
      // statusId: DataTypes.STRING,
      // doctorId: DataTypes.INTEGER,
      // patientId: DataTypes.INTEGER,
      // timeType: DataTypes.STRING,
      // date: DataTypes.DATE,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      statusId: {
        type: Sequelize.STRING,
      },
      doctorId: {
        type: Sequelize.INTEGER,
      },
      patientId: {
        type: Sequelize.INTEGER,
      },
      timeType: {
        type: Sequelize.STRING,
      },
      reason: {
        type: Sequelize.TEXT,
      },
      date: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Bookings");
  },
};
