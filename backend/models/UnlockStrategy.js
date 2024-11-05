"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UnlockStrategy extends Model {
    static associate(models) {
      // define association here
      UnlockStrategy.hasMany(models.UserUnlockAttempt, {
        foreignKey: 'unlock_strategy_id',
      });
    }
  }
  UnlockStrategy.init({
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
    strategy_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'UnlockStrategy',
    tableName: 'unlock_strategies',
    timestamps: true,
    underscored: true,
  });
  return UnlockStrategy;
};