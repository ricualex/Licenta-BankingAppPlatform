module.exports = function (router, firebaseUtils) {
    router.post('/syncUser', async (req, res) => {
        const userId = req.body.userId;
        try {
            const firebaseUser = await firebaseUtils.syncUserDataForRedux(userId);
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
                        friendList: firebaseUser.user.friendList,
                        transactions: firebaseUser.user.transactions
                    };
                    return res.status(200).json({ user: filteredObject, token: firebaseUser.user.loginToken, message: 'Successfuly logged in' });
                }
                else {
                    return res.status(500).json({ message: 'Something went wrong' });
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    router.get('/getUserTransactions', async (req, res) => {
        const userName = req.query.userName;
        if (!userName) {
            return res.status(400).json({ status: 400, message: 'Missing userName parameter' });
        }
        try {
            const data = await firebaseUtils.getUserTransactions(userName);
            if (data.success === true) {
                return res.status(200).json({transactions: data.transactions, friendsTransactions: data.friendsTransactions})
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Something went wrong!', error: error.message });
        }
    });
}