function notFound(request, response) {
    return response.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: `Route ${request.method} ${request.originalUrl} was not found`,
        },
    });
}

module.exports = { notFound };
