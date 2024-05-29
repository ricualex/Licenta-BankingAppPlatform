const redis = require('redis');
const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

redisClient.connect();

module.exports = function (router) {
    router.post('/writeCurrencyRates', async (req, res) => {
        const currencyRatesDictionary = req.body;
    
        if (!currencyRatesDictionary || typeof currencyRatesDictionary !== 'object') {
            return res.status(400).json("Invalid data provided!");
        }
    
        try {
            await redisClient.hSet('currencyRatesDictionary', currencyRatesDictionary);
            res.status(200).json("Something went wrong!");
        } catch (err) {
            console.error('Error writing to Redis:', err);
            res.status(500).json("Something went wrong!");
        }
    });

    router.get('/getCurrencyRates', async (req, res) => {
        try {
            const data = await redisClient.hGetAll('currencyRatesDictionary');
            if (Object.keys(data).length === 0) {
                return res.status(404).json({ error: "Data not found!" });
            }
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: "Something went wrong!" });
        }
    });
}