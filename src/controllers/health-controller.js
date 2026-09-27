const { getHealthStatus } = require("../services/health-service");

function getHealth(_request, response) {
    return response.status(200).json({ data: getHealthStatus() });
}

module.exports = { getHealth };
