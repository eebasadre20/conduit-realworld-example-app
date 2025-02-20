const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/authentication");
const {
  allUserComments,
  createUserComment,
  deleteUserComment,
} = require("../../controllers/userComments");

// Get all comments for a user
router.get("/:userId/comments", verifyToken, allUserComments);
// Create a comment for a user
router.post("/:userId/comments", verifyToken, createUserComment);
// Delete a comment for a user
router.delete("/:userId/comments/:commentId", verifyToken, deleteUserComment);

module.exports = router;
