const { Sequelize } = require("sequelize");
const { config } = require("../config");

let sequelize;

function getSequelize() {
    if (!config.database.url) {
        throw new Error("DATABASE_URL must be configured before using the database");
    }

    if (!sequelize) {
        sequelize = new Sequelize(config.database.url, {
            dialect: "postgres",
            logging: config.env === "development" ? console.log : false,
            dialectOptions: config.database.ssl
                ? { ssl: { require: true, rejectUnauthorized: false } }
                : undefined,
        });
    }

    return sequelize;
}

async function connectDatabase() {
    const connection = getSequelize();
    await connection.authenticate();
    return connection;
}

module.exports = { connectDatabase, getSequelize };
