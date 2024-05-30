// import districts data
const db =  require("../models/index.js");
const districts = db.districts





exports.get =async (req, res) => {
    const districts_all = await districts.findAll();
    res.json(districts_all);

};

