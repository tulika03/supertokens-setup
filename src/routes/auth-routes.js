const express = require("express");
const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const { getMe } = require("../controllers/auth-controller");

const router = express.Router();

router.get("/me", verifySession(), getMe);

module.exports = router;