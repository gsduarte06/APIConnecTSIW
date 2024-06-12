module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
      "user",
      {
        id_user: {
          type: DataTypes.INTEGER,

          primaryKey: true,
          
          autoIncrement: true
        },
        nif: {
          type: DataTypes.INTEGER
        },
        first_name: {
          type: DataTypes.STRING
        },
        last_name: {
          type: DataTypes.STRING
        },
        username: {
          type: DataTypes.STRING
        },
        email: {
          type: DataTypes.STRING
        },
        password: {
          type: DataTypes.TEXT
        },
        role: {
          type: DataTypes.TEXT
        },
        foto: {
          type: DataTypes.TEXT
        },
        cloudinary_id_foto: {
          type: DataTypes.TEXT
        },
        CV: {
          type: DataTypes.TEXT
        },
        cloudinary_id_CV: {
          type: DataTypes.TEXT
        },
        about:{
            type: DataTypes.TEXT
        },
        xp:{
            type: DataTypes.INTEGER
        },
        create_date: {
            type: DataTypes.DATEONLY,
            default: Date()
        }
      },
      {
        timestamps: false
    }
    );
    return user;
  };
  