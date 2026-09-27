const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { errorHandler } = require("./middleware/error-handler");
const { notFound } = require("./middleware/not-found");
const supertokens = require("supertokens-node");
const {middleware, errorHandler: supertokensErrorHandler} = require("supertokens-node/framework/express");
const { config } = require("./config");
const { initSupertokens } = require("./config/supertokens");
const pinoHttp = require("pino-http");


function createApp() {

    initSupertokens();
    const app = express();
    app.disable("x-powered-by");

    app.use(cors({
        origin: config.supertokens.websiteDomain,
         allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
         credentials: true,
    }))

    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: false }));
    // Exposes /auth/signup, /auth/signin, /auth/session/refresh, etc.
    app.use(middleware());
    app.use(require("./middleware/auditLog")); 
    app.use("/api", routes);
    app.use(notFound);
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };
