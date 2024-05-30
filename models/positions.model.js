module.exports = (sequelize, DataTypes) => {
    const position = sequelize.define(
      "position",
      {
        id_position: {
          type: DataTypes.INTEGER,

          primaryKey: true,
          
          autoIncrement: true
        },
        position_desc: {
          type: DataTypes.STRING
        }
      },
      {
        timestamps: false
    }
    );
    return position;
  };
  