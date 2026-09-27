const supertokens = require("supertokens-node");
const EmailPassword = require("supertokens-node/recipe/emailpassword");
const Session = require("supertokens-node/recipe/session");
const {config} = require("./index");
const {    checkLoginLock,
    recordFailedAttempt,
    clearLoginAttempts,
} = require("../services/login-attempts-service")


function initSupertokens() {
    supertokens.init({
        framework: "express",

        supertokens: {
            connectionURI: config.supertokens.connectionURI,
            apiKey: config.supertokens.apiKey,
        },

        appInfo: {
            appName: config.supertokens.appName,
            apiDomain: config.supertokens.apiDomain,
            websiteDomain: config.supertokens.websiteDomain,
            apiBasePath: config.supertokens.apiBasePath,
            websiteBasePath: config.supertokens.websiteBasePath,
        },

        recipeList: [
            EmailPassword.init({
                override: {
                    apis: (originalImplementation) => ({
                        ...originalImplementation,
                        signInPOST: async (input) => {
                            const email = input.formFields.find((f) => f.id === "email").value;
                            const { locked, remainingMs } = await checkLoginLock(email);

                            if (locked) {
                                return {
                                    status: "WRONG_CREDENTIALS_ERROR",
                                    _lockedForMs: remainingMs,
                                };
                            }

                            const response = await originalImplementation.signInPOST(input);

                            if (response.status === "OK") {
                                await clearLoginAttempts(email);
                            } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
                                await recordFailedAttempt(email);
                            }

                            return response;
                        }

                    })
                }
            }),
            Session.init({
                cookieSecure: config.env === "production",
            }),
        ],
    })
}

module.exports = {initSupertokens}