"use strict";

// email: DataTypes.STRING,
//       password: DataTypes.STRING,
//       fullname: DataTypes.STRING,
//       address: DataTypes.STRING,
//       phoneNumber: DataTypes.STRING,
//       gender: DataTypes.BOOLEAN,
//       roleId: DataTypes.STRING,

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        email: "nsikhoa@gmail.com",
        password: "123456",
        fullname: "Khoa Nguyen",
        address: "Hue",
        phoneNumber: "0394673190",
        gender: 1,
        typeRole: "ROLE",
        keyRole: "R1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
