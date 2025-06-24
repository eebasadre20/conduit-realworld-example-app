"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Article }) {
      // define association here

      // Comments
      this.belongsTo(Article, { foreignKey: "articleId" });
      this.belongsTo(User, { as: "author", foreignKey: "userId" });
      
      // Self-referencing associations for nested comments
      this.belongsTo(Comment, { 
        as: "parentComment", 
        foreignKey: "parentId",
        allowNull: true 
      });
      this.hasMany(Comment, { 
        as: "replies", 
        foreignKey: "parentId",
        onDelete: "CASCADE" // When parent is deleted, delete all replies
      });
    }

    // Helper method to get all nested replies with authors
    async getNestedReplies(options = {}) {
      const replies = await this.getReplies({
        include: [
          { 
            model: sequelize.models.User, 
            as: "author", 
            attributes: { exclude: ["email"] } 
          },
          {
            model: Comment,
            as: "replies",
            include: [
              { 
                model: sequelize.models.User, 
                as: "author", 
                attributes: { exclude: ["email"] } 
              }
            ]
          }
        ],
        order: [["createdAt", "ASC"]],
        ...options
      });
      
      return replies;
    }

    // Helper method to check if comment is a root comment (not a reply)
    isRootComment() {
      return this.parentId === null;
    }

    // Helper method to get the thread depth
    async getThreadDepth() {
      let depth = 0;
      let currentComment = this;
      
      while (currentComment.parentId) {
        depth++;
        currentComment = await Comment.findByPk(currentComment.parentId);
        if (!currentComment) break;
      }
      
      return depth;
    }

    // Helper method to get all comments in the same thread
    async getThreadComments() {
      let rootComment = this;
      
      // Find the root comment of this thread
      while (rootComment.parentId) {
        rootComment = await Comment.findByPk(rootComment.parentId, {
          include: [{ model: sequelize.models.User, as: "author" }]
        });
        if (!rootComment) break;
      }
      
      if (!rootComment) return [];
      
      // Get all replies recursively
      return await this.getNestedReplies();
    }

    toJSON() {
      return {
        ...this.get(),
        articleId: undefined,
        userId: undefined,
        // Keep parentId visible for frontend to understand comment hierarchy
      };
    }
  }
  Comment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 10000] // Reasonable length limits
        }
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Comments',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      // Optional: Add a depth field to limit nesting levels
      depth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5 // Limit to 5 levels of nesting to prevent infinite depth
        }
      }
    },
    {
      sequelize,
      modelName: "Comment",
      hooks: {
        // Automatically calculate depth before creating
        beforeCreate: async (comment, options) => {
          if (comment.parentId) {
            const parentComment = await Comment.findByPk(comment.parentId);
            if (parentComment) {
              comment.depth = parentComment.depth + 1;
              
              // Prevent excessive nesting
              if (comment.depth > 5) {
                throw new Error('Maximum comment nesting depth exceeded');
              }
            }
          } else {
            comment.depth = 0;
          }
        }
      }
    },
  );
  return Comment;
};