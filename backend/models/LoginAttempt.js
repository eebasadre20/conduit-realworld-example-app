"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LoginAttempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id" });
    }
  }
  LoginAttempt.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      attempted_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      successful: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: "LoginAttempt",
      tableName: "login_attempts",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  return LoginAttempt;
};