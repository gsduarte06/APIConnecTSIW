module.exports = (sequelize, DataTypes) => {
    const likes_comment = sequelize.define(
      "likes_comment",
      {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          },
          id_comment: {
            type: DataTypes.INTEGER,
            primaryKey: true,
          }
      },
      {
        timestamps: false,
        primaryKey:false
    }
    );
    return likes_comment;
  };
  