module.exports = (sequelize, DataTypes) => {
  const like = sequelize.define(
    "like",
    {
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      id_post: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      id:false,
      primaryKey: false
    }
  );
  return like;
};
