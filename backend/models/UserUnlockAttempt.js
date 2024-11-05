'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserUnlockAttempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, UnlockStrategy }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      this.belongsTo(UnlockStrategy, { foreignKey: 'unlock_strategy_id', onDelete: 'CASCADE' });
    }
  }
  UserUnlockAttempt.init({
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
    },
    unlock_strategy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'UnlockStrategy',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'UserUnlockAttempt',
    tableName: 'user_unlock_attempts',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  return UserUnlockAttempt;
};