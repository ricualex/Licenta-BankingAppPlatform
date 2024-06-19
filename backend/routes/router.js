const express = require("express");

module.exports = function (firebaseUtils) {
    const router = express.Router();
    require("./exchangeRateRoutes")(router, firebaseUtils);
    require("./loginRoutes")(router, firebaseUtils);
    require("./redisRoutes")(router);
    require("./routesUtils.js")(router, firebaseUtils);
    require("./transfers.js")(router, firebaseUtils);

    return router;
};
