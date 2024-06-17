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
                    const filteredObject = {
                        id: firebaseUser.key,
                        userName: firebaseUser.user.userName,
                        balance: firebaseUser.user.balance,
                        iban: firebaseUser.user.iban,
                        transactions: firebaseUser.user.transactions
                    };
                    return res.status(200).json({user: filteredObject, token: firebaseUser.user.loginToken, message: 'Successfuly logged in' });
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
