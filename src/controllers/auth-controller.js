
function getMe(request, response) {
    const session = request.session;
    return response.status(200).json({
        data: {
            userId: session.getUserId(),
            accessTokenPayload: session.getAccessTokenPayload(),
        },
    });
}

module.exports = { getMe };