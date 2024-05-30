var dbConfig = require("../config/db.config.js");
dbConfig=dbConfig.config
//export classes Sequelize and Datatypes
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});
// OPTIONAL: test the connection
(async () => {
  try {
    await sequelize.authenticate;
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();

const db = {}; //object to be exported
db.sequelize = sequelize; 
db.backgrounds = require("./backgrounds.model.js")(sequelize, DataTypes);
db.posts = require("./posts.model.js")(sequelize, DataTypes);
db.comments = require("./comments.model.js")(sequelize, DataTypes);
db.likes = require("./likes.model.js")(sequelize, DataTypes);
db.users = require("./users.model.js")(sequelize, DataTypes);
db.positions = require("./positions.model.js")(sequelize, DataTypes);
db.districts = require("./districts.model.js")(sequelize, DataTypes);
db.present_users= require("./present_users.model.js")(sequelize, DataTypes);
db.likes_comments = require("./likes_comments.model.js")(sequelize, DataTypes);
db.type_posts = require("./type_posts.model.js")(sequelize, DataTypes);

db.positions.hasMany(db.backgrounds, { foreignKey: { name: 'id_position', },})
db.districts.hasMany(db.backgrounds, { foreignKey: { name: 'id_district', },})
db.users.hasMany(db.backgrounds, { foreignKey: { name: 'id_user', },})
db.backgrounds.belongsTo(db.positions, { foreignKey: { name: 'id_position', },})
db.backgrounds.belongsTo(db.districts, { foreignKey: { name: 'id_district', },})
db.backgrounds.belongsTo(db.users,  { foreignKey: { name: 'id_user', },})


db.likes.belongsTo(db.users, { foreignKey: { name: 'id_user', },})
db.likes.belongsTo(db.posts, { foreignKey: { name: 'id_post', },})
db.users.hasMany(db.likes,  { foreignKey: { name: 'id_user', },})
db.posts.hasMany(db.likes,  { foreignKey: { name: 'id_post', },})


db.present_users.belongsTo(db.users, { foreignKey: { name: 'id_user', },})
db.present_users.belongsTo(db.posts, { foreignKey: { name: 'id_post', },})
db.users.hasMany(db.present_users, { foreignKey: { name: 'id_user', },})
db.posts.hasMany(db.present_users, { foreignKey: { name: 'id_post', },})


db.comments.belongsTo(db.users, { foreignKey: { name: 'id_user', },})
db.comments.belongsTo(db.posts,  { foreignKey: { name: 'id_post', },})
db.users.hasMany(db.comments, { foreignKey: { name: 'id_user', },})
db.posts.hasMany(db.comments,  { foreignKey: { name: 'id_post', },})



db.likes_comments.belongsTo(db.users,{ foreignKey: { name: 'id_user', },})
db.likes_comments.belongsTo(db.comments, { foreignKey: { name: 'id_comment', },})
db.users.hasMany(db.likes_comments, { foreignKey: { name: 'id_user', },})
db.comments.hasMany(db.likes_comments,  { foreignKey: { name: 'id_comment', },})

db.posts.belongsTo(db.districts, { foreignKey: { name: 'id_district', },})
db.districts.hasMany(db.posts, { foreignKey: { name: 'id_district', },})

db.posts.belongsTo(db.type_posts, { foreignKey: { name: 'id_type_post', },})
db.type_posts.hasMany(db.posts, { foreignKey: { name: 'id_type_post', },})



module.exports = db; //export the db object with the sequelize instance and tutorial model
