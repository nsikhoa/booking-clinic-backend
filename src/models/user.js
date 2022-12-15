"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Allcode, {
        foreignKey: "majorId",
        targetKey: "keyMap",
        as: "majorData",
      });
      User.belongsTo(models.Allcode, {
        foreignKey: "gender",
        targetKey: "keyMap",
        as: "genderData",
      });
      User.hasOne(models.Markdown, { foreignKey: "doctorId" });
      User.hasOne(models.Doctor_Info, { foreignKey: "doctorId" });
      User.hasMany(models.Schedule, {
        foreignKey: "doctorId",
        as: "doctorData",
      });
      User.hasMany(models.Booking, {
        foreignKey: "patientId",
        as: "patientData",
      });
      User.hasMany(models.Booking, {
        foreignKey: "doctorId",
        as: "doctorDataSchedule",
      });
      User.hasMany(models.History, {
        foreignKey: "patientId",
        as: "patientDataHistory",
      });
      User.hasMany(models.History, {
        foreignKey: "doctorId",
        as: "doctorDataScheduleHistory",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullname: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      roleId: DataTypes.STRING,
      majorId: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
