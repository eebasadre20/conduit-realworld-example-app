"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {}
  Otp.init(
    {
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Otp",
      tableName: "Otps",
    }
  );
  return Otp;
};