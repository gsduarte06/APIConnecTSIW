// import backgrounds data
const db = require("../models/index.js");
const backgrounds = db.backgrounds;
const users = db.users;
const positions = db.positions;
const districts = db.districts;
const moment = require("moment");

// exports custom request payload validation middleware
exports.bodyValidator = (req, res, next) => {
  if (
    typeof req.body.company === "undefined" ||
    typeof req.body.idPosition === "undefined" ||
    typeof req.body.description === "undefined" ||
    typeof req.body.beginDate === "undefined" ||
    typeof req.body.idUser === "undefined" || 
    typeof req.body.idDistrict === "undefined"
  ) {
    return res
      .status(400)
      .json({
        error:
          "Bad request! Must provide company, idPosition, description, begin date, idUser and idDistrict",
      });
  } else {
    if (!moment(req.body.beginDate, "YYYY-MM-DD", true).isValid()) {
      return res
        .status(400)
        .json({ error: "Bad request! Year must be 4 digits" });
    }
  }
  next();
};



exports.update = async(req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({ error: "background ID must be an intenger" });
  } 

  let background = await backgrounds.findByPk(req.params.id);
  console.log(background);
  if(!background){
    return res.status(404).json({ error: "Background ID not found" });
  }

    let affectedRows = await backgrounds.update(req.body, { where: { id_background: req.params.id} })
    if (affectedRows[0] != 0) {
        return res.status(200).json({
        success: true, msg: `Background with ID ${req.params.id} was updated successfully`})
    } else {
        return res.status(200).json({
            success: true, msg: `No updates were made on background with ID ${req.params.idT}.`})
    }
    

  
};

exports.delete = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({ error: "Background ID must be an intenger" });
  } else {
    let result = await backgrounds.destroy({ where: { id_background: req.params.id } });
    if (result == 1) {
      return res.status(200).json(`Background with id ${req.params.id} was successfully deleted!`);
    } 
      return res.status(404).json({ error: "Background ID not found" });
    
  }
};
