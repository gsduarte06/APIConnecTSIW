const config = {
    // read DB credencials from environment variables
    HOST: process.env.DB_HOST ,
    USER: process.env.DB_USER ,
    PASSWORD: process.env.DB_PASSWORD ,
    DB: process.env.DB_NAME ,
    dialect: "mysql"
    };

const JWTconfig = { SECRET: process.env.SECRET }


module.exports = {config, JWTconfig};