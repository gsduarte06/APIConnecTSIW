module.exports = (sequelize, DataTypes) => {
    const type_post = sequelize.define(
      "type_post",
      {
        id_type_post: {
          type: DataTypes.INTEGER,

          primaryKey: true,
          
          autoIncrement: true
        },
        type_post_desc: {
          type: DataTypes.STRING
        },
      },
      {
        timestamps: false
    }
    );
    return type_post;
  };