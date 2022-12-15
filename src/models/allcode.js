"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Allcode.hasMany(models.User, {
        foreignKey: "majorId",
        as: "majorData",
      });
      Allcode.hasMany(models.User, { foreignKey: "gender", as: "genderData" });
      Allcode.hasMany(models.Booking, {
        foreignKey: "timeType",
        as: "timeTypeDataBooking",
      });
      Allcode.hasMany(models.History, {
        foreignKey: "timeType",
        as: "timeTypeDataHistory",
      });
      Allcode.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "priceId",
        as: "priceData",
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "provinceId",
        as: "provinceData",
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "paymentId",
        as: "paymentData",
      });
    }
  }
  Allcode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      valueVi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcode",
      charset: "utf8",
      collate: "utf8_unicode_ci",
    }
  );
  return Allcode;
};
