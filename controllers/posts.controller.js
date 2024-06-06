// import posts data
const moment = require("moment");
const db = require("../models/index.js");
const { where } = require("sequelize");
const posts = db.posts;
const type_post = db.type_posts;
const comments = db.comments;
const users = db.users;
const likes = db.likes;
const present_users = db.present_users;
const cloudinary = require("cloudinary").v2;
function validateDatetime(datetimeStr) {
  var pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  return pattern.test(datetimeStr);
}
// exports custom request payload validation middleware
exports.bodyValidator = (req, res, next) => {
  if (
    typeof req.body.idType === "undefined" ||
    typeof req.body.content === "undefined"
  ) {
    return res.status(400).json({
      error: "Bad request! Must provide Post Type and Content",
    });
  } else {
    if (typeof req.body.beginDate != "undefined") {
      if (!moment(req.body.beginDate, "YYYY-MM-DD", true).isValid()) {
        return res
          .status(400)
          .json({ error: "Bad request! Begin date must be YYYY-MM-DD" });
      }
    }

    if (typeof req.body.endDate != "undefined") {
      if (!validateDatetime(req.body.endDate)) {
        return res
          .status(400)
          .json({ error: "Bad request! End date must be YYYY-MM-DD 00:00:00" });
      }
    }
  }
  next();
};

// exports custom request payload validation middleware
exports.bodyValidatorPresence = (req, res, next) => {
  if (
    typeof req.body.idUser === "undefined" ||
    typeof req.body.idPost === "undefined"
  ) {
    return res
      .status(400)
      .json({ error: "Bad request! Must provide idUser and idPost" });
  } else {
    if (!(parseInt(req.body.idPost) && parseInt(req.body.idUser))) {
        return res.status(400).json({ error: " ID's must be an intenger" });
      }
  }
  next();
};

exports.bodyValidatorLikes = (req, res, next) => {
  if (
    typeof req.body.idUser === "undefined" ||
    typeof req.body.idPost === "undefined"
  ) {
    return res
      .status(400)
      .json({ error: "Bad request! Must provide idUser and idPost" });
  } else {
    if (!(parseInt(req.body.idPost) && parseInt(req.body.idUser))) {
        return res.status(400).json({ error: " ID's must be an intenger" });
      }
  }
  next();
};

// Display list of all posts
exports.find = async (req, res) => {
  const posts_all = await posts.findAll();
  res.json(posts_all);
};

// Display only 1 post comments
exports.findComments = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({ error: "Post ID must be an intenger" });
  } else {
    let post = await posts.findByPk(req.params.id);

    if (!post)
      return res.status(404).json({
        success: false,
        msg: "Post ID not found.",
      });

    const comments_all = await comments.findAll({
      where: { id_post: req.params.id },
    });
      return res.json(comments_all);

  }
};

// Display only 1 post likes
exports.findLikes = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({ error: "Post ID must be an intenger" });
  } else {
    let post = await posts.findByPk(req.params.id);
    if (!post)
      return res.status(404).json({
        success: false,
        msg: "Post ID not found.",
      });
    const likes_all = await likes.findAll({
      where: { id_post: req.params.id },
    });
      return res.json(likes_all);
  }
};

exports.findPresentUsers = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({ error: "Post ID must be an intenger" });
  } else {
    let post = await posts.findByPk(req.params.id);

    if (!post)
      return res.status(404).json({
        success: false,
        msg: "Post ID not found.",
      });

    const present_users_all = await present_users.findAll({
      where: { id_post: req.params.id },
    });

    return res.json(present_users_all);
  }
};

exports.create = async (req, res) => {
  let post = await posts.findOne({
    where: { content: req.body.content, date_post: Date.now() },
  });
  if (post)
    return res.status(403).json({
      success: false,
      msg: "Post is already in the database",
    });

  let type = await type_post.findByPk(req.body.idType);

  if (!type)
    return res.status(400).json({
      success: false,
      msg: "Not a valid post type.",
    });

    if (req.file) {
      try {
        if (req.file) {
          // build a data URI from the file object (it holds the base64 encoded data representing the file)
          const b64 = Buffer.from(req.file.buffer).toString("base64");
          let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
          let result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
          });
          req.body.foto = result.url
          req.body.cloudinary_id= result.public_id
        }
      } catch (error) {
        console.log(error);
        throw new Error("Image is not valid");
      }
    }
  let postNew = await posts.create({
    id_type_post: req.body.idType,
    content: req.body.content,
    date_post: Date.now(),
    id_district: req.body.district,
    begin_date: req.body.beginDate,
    end_date: req.body.endDate,
    image: req.body.foto,
    cloudinary_id: req.body.cloudinary_id,
    link: req.body.link,
  });

  return res.status(201).json("Post created successfuly");
};

exports.createComment = async (req, res) => {
  if (!(parseInt(req.params.id) && parseInt(req.body.idUser))) {
    return res.status(400).json({ error: " ID's must be an intenger" });
  }

  let post = await posts.findByPk(req.params.id);
  if (!post)
    return res.status(400).json({
      success: false,
      msg: "Post ID not found",
    });

  let user = await users.findByPk(req.body.idUser);

  if (!user)
    return res.status(400).json({
      success: false,
      msg: "Not a valid User ID.",
    });

  let comment = await comments.findOne({
    where: {
      id_post: req.params.id,
      id_user: req.body.idUser,
      content: req.body.content,
    },
  });

  if (comment)
    return res.status(403).json({
      success: false,
      msg: "Comment is already in the database",
    });

  let commentNew = await comments.create({
    id_post: req.params.id,
    content: req.body.content,
    date: Date.now(),
    id_user: req.body.idUser,
  });

  return res.status(201).json("Comment created successfuly");
};

exports.delete = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({ error: "Post ID must be an intenger" });
  } else {
    let result = await posts.destroy({ where: { id_post: req.params.id } });
    if (result == 1) {
      return res.status(200).json({
        success: true,
        msg: `Post with id ${req.params.id} was successfully deleted!`,
      });
    } else {
      return res.status(404).json({ error: "Post ID not found" });
    }
  }
};


exports.createPresence = async (req, res) => {
  let present_user = await present_users.findOne({
    where: { id_user: req.body.idUser, id_post: req.body.idPost },
  });
  if (present_user)
    return res.status(403).json({
      success: false,
      msg: "present_user is already in the database",
    });

  let user = await users.findByPk(req.body.idUser);
  if (!user)
    return res.status(400).json({
      success: false,
      msg: "User not exists",
    });

  let post = await posts.findByPk(req.body.idPost);
  if (!post)
    return res.status(400).json({
      success: false,
      msg: "Post not exists",
    });

  let Newpresent_user = await present_users.create({
    id_user: req.body.idUser,
    id_post: req.body.idPost,
  });
  return res.status(201).json("Presence created successfuly");
};

exports.deletePresence = async (req, res) => {
    let result = await present_users.destroy({ where: { id_post: req.body.idPost , id_user: req.body.idUser} });
    if (result == 1) {
        return res.status(200).json({
            success: true,
            msg: `Presence was successfully deleted!`,
          });
    } else {
      return res.status(404).json({ error: "Presence not found, check id's" });

  }
};


exports.createLikes = async (req, res) => {
  let like = await likes.findOne({
    where: { id_user: req.body.idUser, id_post: req.body.idPost },
  });
  if (like)
    return res.status(403).json({
      success: false,
      msg: "Like is already in the database",
    });

  let user = await users.findByPk(req.body.idUser);
  if (!user)
    return res.status(400).json({
      success: false,
      msg: "User not exists",
    });

  let post = await posts.findByPk(req.body.idPost);
  if (!post)
    return res.status(400).json({
      success: false,
      msg: "Post not exists",
    });

  let NewLike = await likes.create({
    id_user: req.body.idUser,
    id_post: req.body.idPost,
  });
  return res.status(201).json("Like created successfuly");
};

exports.deleteLikes = async (req, res) => {
    let result = await likes.destroy({ where: { id_post: req.body.idPost , id_user: req.body.idUser} });
    if (result == 1) {
        return res.status(200).json({
            success: true,
            msg: `Like was successfully deleted!`,
          });
    } else {
      return res.status(404).json({ error: "Like not found, check id's" });

  }
};
