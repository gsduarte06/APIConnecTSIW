module.exports = (sequelize, DataTypes) => {
    const background = sequelize.define(
      "background",
      {
        id_background: {
          type: DataTypes.INTEGER,

          primaryKey: true,
          
          autoIncrement: true
        },
        id_user: {
          type: DataTypes.INTEGER
        },
        name_company: {
          type: DataTypes.TEXT
        },
        id_district: {
          type: DataTypes.INTEGER
        },
        id_position: {
          type: DataTypes.INTEGER
        },
        begin_date: {
          type: DataTypes.DATEONLY
        },
        end_date: {
          type: DataTypes.DATEONLY
        },
        descricao_position: {
          type: DataTypes.STRING
        }
        
      },
      {
        timestamps: false
    }
    );
    return background;
  };
  