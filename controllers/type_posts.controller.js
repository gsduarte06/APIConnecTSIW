// import type_posts data
const db =  require("../models/index.js");
const type_posts = db.type_posts




exports.get = async(req, res) => {
    const type_posts_all = await type_posts.findAll();
    res.json(type_posts_all);

};

