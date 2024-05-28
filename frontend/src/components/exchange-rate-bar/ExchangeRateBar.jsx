import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./ExchangeRateBarStyle.css";
import uk_flag from "../../assets/uk_flag.png"
import eu_flag from "../../assets/europa_flag.png"
import us_flag from "../../assets/us_flag.png"
import switz_flag from "../../assets/switz_flag.png"

export default function ExchangeRateBar() {
    const [ratesError, setRatesError] = useState("");
    const [currencyRates, setCurrencyRates] = useState([
        {
            name: "EUR",
            image: eu_flag,
            alt: "EU_flag",
            value: undefined
        },
        {
            name: "USD",
            image: us_flag,
            alt: "USD_flag",
            value: undefined
        },
        {
            name: "GBP",
            image: uk_flag,
            alt: "UK_flag",
            value: undefined
        },
        {
            name: "CHF",
            image: switz_flag,
            alt: "Switz_flag",
            value: undefined
        }
    ]);

    const getCurrencyRates = useCallback(async () => {
        axios.get('http://localhost:80/api/exchangeRatesAll')
            .then((response) => {
                const rates = response.data;
                const updatedCurrencyRates = currencyRates.map(rate => ({
                    ...rate,
                    value: rates[rate.name]
                }));
                setCurrencyRates(updatedCurrencyRates);
            })
            .catch((error) => {
                setRatesError("We are sorry, we could not fetch exchange rates!");
            });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        getCurrencyRates();
        const interval = setInterval(getCurrencyRates, 60000);
        return () => clearInterval(interval);
    }, [getCurrencyRates]);

    return (
        <div className="exchange-rate-bar">
            {
                currencyRates.map(item => {
                    return (!ratesError &&
                        <div className="currency-item">
                            <img className="currency-flag"
                                src={item.image}
                                alt={item.alt}
                                style={{
                                    marginLeft: "10px",
                                    marginRight: "10px"
                                }}
                            />
                            <label
                                className="currency-value"
                                style={{
                                    paddingRight: "10px",
                                    borderRight: "2px solid black"
                                }}
                            >
                                {item.value ? item.name + " " + item.value : item.name}
                            </label>
                        </div>
                    )
                })
            }
        </div>
    );
}