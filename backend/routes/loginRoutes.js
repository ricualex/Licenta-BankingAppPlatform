const User = require("../mongoutil/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = function (router, firebaseUtils) {
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const firebaseUser = await firebaseUtils.loginUsingFirebase(username);
            if (!firebaseUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            else {
                if (firebaseUser.success === true) {
                    return res.status(200).json({token: firebaseUser.user.loginToken, message: 'Successfuly logged in' });
                }
                else {
                    return res.status(500).json({ message: 'Something went wrong' });
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};
