module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define(
    "post",
    {
      id_post: {
        type: DataTypes.INTEGER,

        primaryKey: true,
        
        autoIncrement: true
      },
      id_type_post: {
        type: DataTypes.INTEGER
      },
      content: {
        type: DataTypes.TEXT
      },
      date_post: {
        type: DataTypes.DATEONLY
      },
      id_district: {
        type: DataTypes.INTEGER
      },
      begin_date: {
        type: DataTypes.DATEONLY
      },
      end_date: {
        type: DataTypes.DATE
      },
      image: {
        type: DataTypes.TEXT
      },
      cloudinary_id: {
        type: DataTypes.TEXT
      },
      link: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false
  }
  );
  return post;
};
