function errorHandler(error, _request, response, _next) {
    const status = error.statusCode || 500;
    const message = status >= 500 ? "An internal server error occurred" : error.message;

    if (status >= 500) {
        console.error(error);
    }

    return response.status(status).json({
        error: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            message,
        },
    });
}

module.exports = { errorHandler };
