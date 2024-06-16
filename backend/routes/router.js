const express = require("express");

module.exports = function (firebaseUtils) {
    const router = express.Router();
    require("./exchangeRateRoutes")(router);
    require("./loginRoutes")(router, firebaseUtils);
    require("./redisRoutes")(router);
    require("./routesUtils.js")(router, firebaseUtils);

    return router;
};
