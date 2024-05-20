const User = require("../mongoutil/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const xml2js = require("xml2js");

module.exports = function (router) {
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if (!user || !await bcrypt.compare(password, user.password)) {
                return res.status(401).send({ message: "You are not allowed to login!" });
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.status(200).send({ token: token, message: "Login successfuly!" });
        } catch (error) {
            res.status(500).send({ message: "Something went wrong!" });
        }
    });
}