// import users data
const db = require("../models/index.js");
const comments = db.comments;
const likes_comments = db.likes_comments;
const users = db.users;

// exports custom request payload validation middleware
exports.bodyValidator = (req, res, next) => {
  if (
    typeof req.body.idUser === "undefined" ||
    typeof req.body.idComment === "undefined"
  ) {
    return res
      .status(400)
      .json({ error: "Bad request! Must provide idUser and idComment" });
  } else {
    if (!(parseInt(req.body.idComment) && parseInt(req.body.idUser))) {
        return res.status(400).json({ error: " ID's must be an intenger" });
      }
  }
  next();
};


exports.findLikes = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({ error: "Comment ID must be an intenger" });
  }
  let comment = await comments.findByPk(req.params.id);

  if (!comment)
    return res.status(404).json({
      success: false,
      msg: "Comment ID not found.",
    });

  const likes_comments_all = await likes_comments.findAll({
    where: { id_comment: req.params.id },
  });
  return res.json(likes_comments_all); //PRINT DATA HERE
};

exports.delete = async(req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({ error: "Comment ID must be an intenger" });
  } else {
    let result = await comments.destroy({ where: { id_comment: req.params.id } });
    if (result == 1) {
        return res.status(200).json({
            success: true,
            msg: `Comment with id ${req.params.id} was successfully deleted!`,
          });
    } else {
      return res.status(404).json({ error: "Comment ID not found" });
    }
  }
};


exports.createLike = async (req, res) => {
  let comment_like = await likes_comments.findOne({
    where: { id_user: req.body.idUser, id_comment: req.body.idComment },
  });
  if (comment_like)
    return res.status(403).json({
      success: false,
      msg: "like is already in the database",
    });

  let user = await users.findByPk(req.body.idUser);
  if (!user)
    return res.status(400).json({
      success: false,
      msg: "User not exists",
    });

  let comment = await comments.findByPk(req.body.idComment);
  if (!comment)
    return res.status(400).json({
      success: false,
      msg: "Comment not exists",
    });

  let Newcomment_like = await likes_comments.create({
    id_user: req.body.idUser,
    id_comment: req.body.idComment,
  });
  return res.status(201).json("Like created successfuly");
};

exports.deleteLike = async (req, res) => {
    let result = await likes_comments.destroy({ where: { id_comment: req.body.idComment , id_user: req.body.idUser} });
    if (result == 1) {
        return res.status(200).json({
            success: true,
            msg: `Like was successfully deleted!`,
          });
    } else {
      return res.status(404).json({ error: "Like not found, check id's" });

  }
};

