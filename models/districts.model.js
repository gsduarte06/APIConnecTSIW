module.exports = (sequelize, DataTypes) => {
    const district = sequelize.define(
      "district",
      {
        id_district: {
          type: DataTypes.INTEGER,

          primaryKey: true,
          
          autoIncrement: true
        },
        district: {
          type: DataTypes.STRING
        },
      },
      {
        timestamps: false
    }
    );
    return district;
  };
  