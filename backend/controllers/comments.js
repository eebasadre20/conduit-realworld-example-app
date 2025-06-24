const {
  NotFoundError,
  UnauthorizedError,
  FieldRequiredError,
  ForbiddenError,
} = require("../helper/customErrors");
const { appendFollowers } = require("../helper/helpers");
const { Article, Comment, User } = require("../models");

//? All Comments for Article
const allComments = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    const { slug } = req.params;

    const article = await Article.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    const comments = await article.getComments({
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

//* Create Comment for Article
const createComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { body } = req.body.comment;
    if (!body) throw new FieldRequiredError("Comment body");

    const { slug } = req.params;
    const article = await Article.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    const comment = await Comment.create({
      body: body,
      articleId: article.id,
      userId: loggedUser.id,
    });

    delete loggedUser.dataValues.token;
    comment.dataValues.author = loggedUser;
    await appendFollowers(loggedUser, loggedUser);

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

//* Create Multiple Comments for Article (Bulk Create)
const createBulkComments = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { comments } = req.body;
    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      throw new FieldRequiredError("Comments array");
    }

    const { slug } = req.params;
    const article = await Article.findOne({ where: { slug: slug } });
    if (!article) throw new NotFoundError("Article");

    // Validate all comments have required fields
    const invalidComments = comments.filter(comment => !comment.body || !comment.body.trim());
    if (invalidComments.length > 0) {
      throw new FieldRequiredError("Comment body for all comments");
    }

    // Prepare comment data for bulk creation
    const commentData = comments.map(comment => ({
      body: comment.body.trim(),
      articleId: article.id,
      userId: loggedUser.id,
    }));

    // Create all comments in bulk
    const createdComments = await Comment.bulkCreate(commentData, {
      returning: true, // Return the created records
      validate: true,  // Validate each record
    });

    // Add author information to each comment
    const commentsWithAuthor = createdComments.map(comment => {
      const commentData = comment.toJSON();
      commentData.author = {
        ...loggedUser.toJSON(),
      };
      delete commentData.author.token;
      return commentData;
    });

    // Append followers for each comment (if needed for your business logic)
    for (const comment of commentsWithAuthor) {
      await appendFollowers(loggedUser, comment);
    }

    res.status(201).json({ 
      comments: commentsWithAuthor,
      message: `${createdComments.length} comments created successfully`
    });
  } catch (error) {
    next(error);
  }
};

//* Delete Comment for Article
const deleteComment = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug, commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new NotFoundError("Comment");

    if (loggedUser.id !== comment.userId) {
      throw new ForbiddenError("comment");
    }

    await comment.destroy();

    res.json({ message: { body: ["Comment deleted successfully"] } });
  } catch (error) {
    next(error);
  }
};

module.exports = { allComments, createComment, createBulkComments, deleteComment };