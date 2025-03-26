const {
  NotFoundError,
  UnauthorizedError,
  FieldRequiredError,
  ForbiddenError,
} = require("../helper/customErrors");
const { appendFollowers } = require("../helper/helpers");
const { User, Comment } = require("../models");

// Get all comments for a user
const allUserComments = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError("User");

    const comments = await Comment.findAll({
      where: { userId: user.id },
      include: [
        { model: User, as: "author", attributes: { exclude: ["email"] } },
      ],
    });

    for (const comment of comments) {
      await appendFollowers(loggedUser, comment);
    }

    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

// Create a comment for a user
const createUserComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { body } = req.body.comment;
    if (!body) throw new FieldRequiredError("Comment body");

    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError("User");

    const comment = await Comment.create({
      body: body,
      userId: user.id,
      authorId: loggedUser.id,
    });

    delete loggedUser.dataValues.token;
    comment.dataValues.author = loggedUser;
    await appendFollowers(loggedUser, loggedUser);

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

// Delete a comment for a user
const deleteUserComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { userId, commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new NotFoundError("Comment");

    if (loggedUser.id !== comment.authorId) {
      throw new ForbiddenError("comment");
    }

    console.log("hello");
    await comment.destroy();

    res.json({ message: { body: ["Comment deleted successfully"] } });
  } catch (error) {
    next(error);
  }
};

module.exports = { allUserComments, createUserComment, deleteUserComment };
