module.exports = function (router, firebaseUtils) {
    router.post('/transferMoney', async (req, res) => {
        const { userFrom, userTo, sum, currency } = req.body;
        try {
            const proc = await firebaseUtils.transferMoney(userFrom, userTo, sum, currency );
            if (!proc) {
                return res.status(500).json({ message: 'Something went wrong' });
            }
            else {
                return res.status(proc.status).json({ message: proc.message, error: proc.error });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });

    router.get('/getFriendNames', async (req, res) => {
        const userId = req.query.userId;
        if (!userId) {
          return res.status(400).json({ status: 400, message: 'Missing userId parameter' });
        }
      
        try {
          const proc = await firebaseUtils.getEmailsForFriendList(userId);
          if (!proc) {
            return res.status(500).json({ message: 'Something went wrong' });
          }
          return res.status(proc.status).json({ message: proc.message, friendEmails: proc.friendEmails, error: proc.error });
        } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
        }
      });
};
