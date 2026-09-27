const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function boolean(value, defaultValue = false) {
    if (value === undefined) {
        return defaultValue;
    }
    return value.toLowerCase() === "true";
}

const config = {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),
    database: {
        url: process.env.DATABASE_URL,
        ssl: boolean(process.env.DATABASE_SSL),
    },
    pythonExecutable: process.env.PYTHON_EXECUTABLE || "python3",

    supertokens: {
        connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
        apiKey: process.env.SUPERTOKENS_API_KEY,
        appName: process.env.SUPERTOKENS_APP_NAME || "supertokens-setup",
        apiDomain: process.env.SUPERTOKENS_API_DOMAIN,
        websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN,
        apiBasePath: process.env.SUPERTOKENS_API_BASE_PATH || "/auth",
        websiteBasePath: process.env.SUPERTOKENS_WEBSITE_BASE_PATH || "/auth",
    }
};

function validateConfig({ requireDatabase = false, requireAuth = false } = {}) {
    if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
        throw new Error("PORT must be a valid TCP port number");
    }

    if (requireDatabase) {
        required("DATABASE_URL");
    }

    if (requireAuth) {
        required("SUPERTOKENS_CONNECTION_URI");
        required("SUPERTOKENS_API_KEY");
        required("SUPERTOKENS_API_DOMAIN");
        required("SUPERTOKENS_WEBSITE_DOMAIN");
    }
}

module.exports = { config, validateConfig };
