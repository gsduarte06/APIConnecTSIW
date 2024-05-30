module.exports = (sequelize, DataTypes) => {
    const present_user = sequelize.define(
      "present_user",
      {
        id_user: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        id_post: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        }
      },
      {
        timestamps: false,
        primaryKey:false
    }
    );
    return present_user;
  };
  