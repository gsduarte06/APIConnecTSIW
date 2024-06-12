// import users data
const db = require("../models/index.js");
const users = db.users;
const backgrounds = db.backgrounds;
const positions = db.positions;
const districts = db.districts;
const { Sequelize, DataTypes, Op, where, ValidationError ,fn,col } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { JWTconfig } = require("../config/db.config.js");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const dayjs= require("dayjs")

const monthAcronyms = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function getPreviousYearDateRange(years) {
    // Get today's date
    let today = new Date();
    
    // Calculate the future date
    let futureDate = dayjs().subtract(1, 'year').toDate();
    console.log(futureDate);
  return {
    start: futureDate,
    end: today,
  };
}

exports.bodyValidatorBG = (req, res, next) => {
  if (
    typeof req.body.company === "undefined" ||
    typeof req.body.idPosition === "undefined" ||
    typeof req.body.description === "undefined" ||
    typeof req.body.beginDate === "undefined" ||
    typeof req.body.idDistrict === "undefined"
  ) {
    return res.status(400).json({
      error:
        "Bad request! Must provide company, idPosition, description, begin date, idUser and idDistrict",
    });
  } else {
    if (!moment(req.body.beginDate, "YYYY-MM-DD", true).isValid()) {
      return res
        .status(400)
        .json({ error: "Bad request! Data must be format YYYY-MM-DD" });
    }
  }
  next();
};

// exports custom request payload validation middleware
exports.bodyValidator = (req, res, next) => {
  if (
    typeof req.body.username === "undefined" ||
    typeof req.body.password === "undefined" ||
    typeof req.body.role === "undefined"
  ) {
    return res.status(400).json({
      error:
        "Bad request! Must provide usename, password and role",
    });
  } else {
    if (
      !(
        req.body.role.toLowerCase() === "regular" ||
        req.body.role.toLowerCase() === "admin"
      )
    ) {
      return res.status(400).json({
        error: "Role must be regular or admin",
      });
    }
  }
  next();
};

// Display list of all users
exports.findAll = async (req, res) => {
  if (typeof req.query.numYear != "undefined") {
    if (!parseInt(req.query.numYear))
      return res.status(400).json({
        error: "Pls insert a valid number",
      });
    const { start, end } = getPreviousYearDateRange(req.body.numYear);
    const casesByMonth = await users.findAll({
      attributes: [
        [fn('YEAR', col('create_date')), 'year'],
        [fn('MONTH', col('create_date')), 'month'],
        [fn('COUNT', col('*')), 'case_count']
      ],
      where: {
        create_date: {
          [Op.between]: [start, end]
        }
      },
      group: [
        fn('YEAR', col('create_date')),
        fn('MONTH', col('create_date'))
      ],
      raw: true
    });

    const months = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const monthAcronym = monthAcronyms[month - 1]; // Adjust for zero-based index
      months.push({ year, month: monthAcronym });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Fill missing months with 0 count
    const result = months.map(month => {
      const existingMonth = casesByMonth.find(caseData => caseData.year === month.year && caseData.month === month.month);
      console.log(month.year.toString().split(""));
      return {
        month: month.month + "/"+month.year.toString().slice(-2),
        case_count: existingMonth ? existingMonth.case_count : 0
      };
    });


    return res.json(result);
  }
  if (Boolean(req.query.xp) == true) {
    const filtuser = await users.findAll({
      order: [["xp", "desc"]],
      attributes: ["username", "xp"],
    });

    return res.json(filtuser);
  }
  let user = await users.findAll();

  if (user) return res.json(user);

  return res.status(500).json({
    error: "Server Error, pls check the connection",
  });
};

// Display only 1 users
exports.findOne = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({
      error: "user ID must be an intenger",
    });
  } else {
    let user = await users.findByPk(req.params.id);

    if (user) return res.json(user);

    return res.status(404).json({
      error: "user ID not found",
    });
  }
};

// Display only 1 user background
exports.findBackground = async (req, res) => {
  if (!parseInt(req.params.id)){
      return res.status(400).json({
      error: "User ID must be an intenger",
    });
  }
  if (req.query.district == "true" && req.query.positions == "true"){
    return res.status(400).json({
      error: "Only one body element is allowed",
    });
  }
  if (req.query.district == "true") {
    const countByDistrict = [];
    const districts = await db.districts.findAll();
    for (let i in districts) {
      const filtBackground = await backgrounds.findAll({
        where: {
          id_district: districts[i].id_district,
          end_date: null,
        },
      });
      countByDistrict.push(filtBackground.length);
    }
    return res.json(countByDistrict);
  }
  if (req.query.positions == "true") {
    const data = [];
    const filtBackground = await backgrounds.findAll({
      attributes: [
        [fn("DISTINCT", col("id_position")), "id_position"],
      ],
    });
    for (let i in filtBackground) {
      let backgroundPos = filtBackground[i].id_position;
      let namePos = await positions.findAll({
        where: { id_position: backgroundPos },
        attributes: ["position_desc"],
      });
      let bgCount = await backgrounds.findAll({
        where: { id_position: backgroundPos, end_date: null },
      });
      data.push({ namePos: namePos[0].position_desc, count: bgCount.length });
    }
    return res.json(data);
  }
  let user = await users.findByPk(req.params.id);

  if (!user)
    return res.status(404).json({
      success: false,
      msg: "User ID not found.",
    });

  const backgrounds_all = await db.backgrounds.findAll({
    where: {
      id_user: req.params.id,
    },
    order: [["begin_date", "desc"]],
  });
  return res.json(backgrounds_all); //PRINT DATA HERE
};

exports.create = async (req, res) => {
  let user = await users.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (user)
    return res.status(403).json({
      success: false,
      msg: "User is already in the database",
    });

  let userNew = await users.create({
    username: req.body.username,

    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role,

    create_date: Date.now(),
  });

  return res.status(201).json("User created successfuly");
};


exports.delete = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({ error: "User ID must be an intenger" });
  } else {
    let result = await users.destroy({ where: { id_user: req.params.id } });
    if (result == 1) {
      return res.status(200).json(`User with id ${req.params.id} was successfully deleted!`);
    } 
      return res.status(404).json({ error: "User ID not found" });
    
  }
};


exports.update = async (req, res) => {
  try {
    if (!parseInt(req.params.id))
      throw new Error("User ID must be an intenger");

    let user = await users.findByPk(req.params.id);
    if (!user) throw new Error("User ID not found.");
    console.log(req.files);
    const image = req.files.image[0] || null
    const CV = req.files.pdf[0] || null
    if (req.files) {
      try {
        if (image) {
          if(user.cloudinary_id_foto){
            await cloudinary.uploader.destroy(user.cloudinary_id_foto);
          }
          // build a data URI from the file object (it holds the base64 encoded data representing the file)
          const b64 = Buffer.from(image.buffer).toString("base64");
          let dataURI = "data:" + image.mimetype + ";base64," + b64;
          let result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
          });
          req.body.foto = result.url
          req.body.cloudinary_id_foto= result.public_id
        }
      } catch (error) {
        console.log(error);
        throw new Error("Image is not valid");
      }
      try {
        if (CV) {
          if(user.cloudinary_id_CV){
            await cloudinary.uploader.destroy(user.cloudinary_id_CV);
          }
          // build a data URI from the file object (it holds the base64 encoded data representing the file)
          const b64 = Buffer.from(CV.buffer).toString("base64");
          let dataURI = "data:" + CV.mimetype + ";base64," + b64;
          let result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
          });
          req.body.CV = result.url
          req.body.cloudinary_id_CV= result.public_id
        }
      } catch (error) {
        console.log(error);
        throw new Error("CV is not valid");
      }
    }
    const updatedRowsCount = await users.update(req.body, {
      where: {
        id_user: req.params.id,
      },
    });

    console.log(updatedRowsCount[0]);
    if (updatedRowsCount[0] == 0) {
      throw new Error(
        "Parameters not found. The legal parameter are [nif(int),first_name(str),last_name(str),username(str),email(str),password(str), role(str),foto(file),cv(file),about(str)]"
      );
    }

    return res.status(201).json("User updated successfuly");
  } catch (err) {
    return res.status(404).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!req.body || !req.body.username || !req.body.password)
      return res.status(400).json({
        success: false,
        msg: "Failed! Must provide username and password.",
      });

    let user = await users.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!user)
      return res.status(404).json({
        success: false,
        msg: "User not found.",
      });

    // decrypt psswd from DB and compare with the provided psswd in request
    // tests a string (password in body) against a hash (password in database)​
    const check = bcrypt.compareSync(req.body.password, user.password);

    if (!check)
      return res.status(401).json({
        success: false,
        msg: `Invalid Credentials`,
      });

    //UNSAFE TO STORE EVERYTHING OF USER, including PSSWD
    // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
    console.log(user.role);
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWTconfig.SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({
      loggedUserId: user.id_user,
      success: true,
      accessToken: token,
    });
  } catch (err) {
    console.log(ValidationError);
    if (err instanceof ValidationError)
      res.status(400).json({
        success: false,
        msg: err.errors.map((e) => e.message),
      });
    else
      res.status(500).json({
        success: false,
        msg: err.message || "Some error occurred while creating the user.",
      });
  }
};

exports.getXP = async (req, res) => {
  if (!parseInt(req.params.id)) {
    return res.status(400).json({
      error: "User ID must be an intenger",
    });
  } else {
    let user = await users.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({
        success: false,
        msg: "User ID not found.",
      });
    const userData = await users.findAll({
      attributes: ["xp"],
      where: {
        id_user: req.params.id,
      },
    });
    return res.json(userData);
  }
};

exports.createBG = async (req, res) => {
  let user = await users.findByPk(req.params.id);

  if (!user)
    return res.status(400).json({
      success: false,
      msg: "User not exists",
    });
  let position = await positions.findByPk(req.body.idPosition);
  if (!position)
    return res.status(400).json({
      success: false,
      msg: "Position not exists",
    });

  let district = await districts.findByPk(req.body.idDistrict);

  if (!district)
    return res.status(400).json({
      success: false,
      msg: "District not exists",
    });

  let background = await backgrounds.findOne({
    where: {
      id_position: req.body.idPosition,
      name_company: req.body.company,
      id_user: req.params.id,
    },
  });
  if (background)
    return res.status(403).json({
      success: false,
      msg: "Background is already in the database",
    });

  let backgroundNew = await backgrounds.create({
    id_user: req.params.id,
    name_company: req.body.company,
    id_district: req.body.idDistrict,
    begin_date: req.body.beginDate,
    end_date: req.body.endDate,
    descricao_position: req.body.description,
    id_position: req.body.idPosition,
  });

  return res.status(201).json("Background created successfuly");
};
