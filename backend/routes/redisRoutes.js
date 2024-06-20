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
      res.status(200).json("Redis updated successfuly!");
    } catch (err) {
      console.error('Error writing to Redis:', err);
      res.status(500).json({ message: "Something went wrong!", error: error.message });
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
      res.status(500).json({ error: "Something went wrong!", message: err.message });
    }
  });

  const fetchExchangeRate = async (from, to) => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'FX_DAILY',
          from_symbol: from,
          to_symbol: to,
          apikey: 'YOUR_API_KEY',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching the forex data', error);
      throw error;
    }
  };

  router.get('/getExchangeRate', async (req, res) => {
    const { from, to } = req.query;
    const cacheKey = `${from}_${to}`;

    redisClient.get(cacheKey, async (err, data) => {
      if (err) throw err;
      if (data) {
        return res.json(JSON.parse(data));
      } else {
        try {
          const forexData = await fetchExchangeRate(from, to);
          redisClient.setex(cacheKey, 43200, JSON.stringify(forexData));
          return res.json(forexData);
        } catch (error) {
          return res.status(500).json({ error: 'Failed to fetch data' });
        }
      }
    });
  });
}