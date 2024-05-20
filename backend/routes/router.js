const express = require("express");

const router = express.Router();
require("./exchangeRateRoutes")(router);
require("./loginRoutes")(router);

module.exports = router;
