const UserMetadata = require("supertokens-node/recipe/usermetadata");

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Returns { locked: boolean, remainingMs: number }
 */
async function checkLoginLock(email) {
    const { metadata } = await UserMetadata.getUserMetadata(email);
    const lockedUntil = metadata.lockedUntil || 0;
    const now = Date.now();

    if (lockedUntil > now) {
        return { locked: true, remainingMs: lockedUntil - now };
    }
    return { locked: false, remainingMs: 0 };
}

async function recordFailedAttempt(email) {
    const { metadata } = await UserMetadata.getUserMetadata(email);
    const failedAttempts = (metadata.failedAttempts || 0) + 1;

    const update = { failedAttempts };
    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        update.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    }

    await UserMetadata.updateUserMetadata(email, update);
}

async function clearLoginAttempts(email) {
    await UserMetadata.updateUserMetadata(email, { failedAttempts: 0, lockedUntil: 0 });
}

module.exports = {
    MAX_LOGIN_ATTEMPTS,
    LOCKOUT_DURATION_MS,
    checkLoginLock,
    recordFailedAttempt,
    clearLoginAttempts,
};