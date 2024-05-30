// import positions data
const db =  require("../models/index.js");
const positions = db.positions




exports.create =async (req, res) => {
    let position = await positions.findOne({
        where: { position_desc: req.body.position },
      });
      if (position)
        return res.status(403).json({
          success: false,
          msg: "Position is already in the database",
        });
        let positionNew = await positions.create({
            position_desc: req.body.position
          });

        return res.status(201).json("Position created successfuly")
    
};

exports.get =async (req, res) => {
    const positions_all = await positions.findAll();
    res.json(positions_all);

};


