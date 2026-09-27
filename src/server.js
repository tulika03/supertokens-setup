const { createApp } = require("./app");
const { config, validateConfig } = require("./config");

validateConfig({ requireAuth: true });

const app = createApp();
const server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});

function shutdown(signal) {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
    console.log(`${signal} received; shutting down`);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
