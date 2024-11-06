"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CommentAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Comment }) {
      // define association here
      this.belongsTo(Comment, { foreignKey: "commentId" });
    }
  }
  CommentAttachment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      filePath: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'file_path'
      },
      fileType: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'file_type'
      },
      fileSize: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'file_size'
      },
      commentId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'comment_id',
        references: {
          model: 'Comments',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: "CommentAttachment",
      tableName: "comment_attachments",
    },
  );
  return CommentAttachment;
};