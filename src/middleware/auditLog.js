const logger = require("../utils/logger");

const SENSITIVE = ["password", "token", "secret", "creditCard"];

const redact = (body = {}) =>
  Object.fromEntries(Object.entries(body).map(([k, v]) => [k, SENSITIVE.includes(k) ? "[REDACTED]" : v]));

module.exports = function auditLog(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const session = req.session;                         // undefined if no/optional session
    const payload = session?.getAccessTokenPayload();

    logger.info({
      action: `${req.method} ${req.originalUrl.split("?")[0]}`,
      route: req.route?.path,
      user: session
        ? {
            userId: session.getUserId(),
            sessionHandle: session.getHandle(),
            tenantId: session.getTenantId(),
            roles: payload?.["st-role"]?.v ?? [],        // only if UserRoles recipe is enabled
          }
        : null,
      status: res.statusCode,
      message: res.message,
      ms: Date.now() - start,
      ip: req.ip,
      query: req.query,
      body: redact(req.body),
    });
  });

  next();
};