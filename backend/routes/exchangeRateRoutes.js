const axios = require("axios");
const xml2js = require("xml2js");

module.exports = function (router) {
    router.get('/exchangeRatesAll', async (req, res) => {
        try {
            const response = await axios.get(process.env.EXCHANGE_RATE_BNR_XML);
            const xmlData = response.data;
            xml2js.parseString(xmlData, (err, result) => {
                if (err) {
                    return res.status(500).send("Something went wrong!");
                }
                const currencyDictionary = _extractCurrencies(result);
                res.json(currencyDictionary);
            });
        } catch (error) {
            res.status(500).send("Something went wrong!");
        }
    });
}

const _extractCurrencies = (data) => {
    const currencies = {};
    const rates = data.DataSet.Body[0].Cube[0].Rate;

    rates.forEach(rate => {
        const currencyName = rate.$.currency;
        let value = parseFloat(rate._);
        if (rate.$.multiplier) {
            value /= parseFloat(rate.$.multiplier);
        }
        currencies[currencyName] = value.toFixed(4);
    });

    return currencies;
};