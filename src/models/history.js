"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.User, {
        foreignKey: "patientId",
        targetKey: "id",
        as: "patientDataHistory",
      });
      History.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "doctorDataScheduleHistory",
      });
      History.belongsTo(models.Allcode, {
        foreignKey: "timeType",
        targetKey: "keyMap",
        as: "timeTypeDataHistory",
      });
    }
  }
  History.init(
    {
      patientId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      statusId: DataTypes.STRING,
      // description: DataTypes.TEXT,
      // files: DataTypes.TEXT,
      timeType: DataTypes.STRING,
      reason: DataTypes.TEXT,
      date: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "History",
    }
  );
  return History;
};
