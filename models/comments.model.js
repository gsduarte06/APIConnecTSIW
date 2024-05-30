module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define(
      "comment",
      {
        id_comment: {
          type: DataTypes.INTEGER,

          primaryKey: true,
          
          autoIncrement: true
        },
        id_user: {
          type: DataTypes.INTEGER
        },
        content: {
          type: DataTypes.TEXT
        },
        id_post: {
          type: DataTypes.INTEGER
        },
        date: {
          type: DataTypes.DATE
        }
      },
      {
        timestamps: false
    }
    );
    return comment;
  };
  