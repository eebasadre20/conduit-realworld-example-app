const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Article, Comment, User }) {
      // define association here

      // Articles
      this.hasMany(Article, { foreignKey: "userId", onDelete: "CASCADE" });

      // Comments
      this.hasMany(Comment, { foreignKey: "articleId" });

      // Favorites
      this.belongsToMany(Article, {
        through: "Favorites",
        as: "favorites",
        foreignKey: "userId",
        timestamps: false,
      });

      // Followers
      this.belongsToMany(User, {
        through: "Followers",
        as: "followers",
        foreignKey: "userId",
        timestamps: false,
      });
      this.belongsToMany(User, {
        through: "Followers",
        as: "following",
        foreignKey: "followerId",
        timestamps: false,
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        password: undefined,
        updatedAt: undefined,
        createdAt: undefined,
      };
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      bio: DataTypes.TEXT,
      image: DataTypes.TEXT,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
      password: DataTypes.STRING,
      // Merging new fields from the new code
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      email_verification_token: DataTypes.STRING,
      email_verification_expires: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
