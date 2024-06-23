import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import config from '../../../../../config';

const currencies = [
    "AED", "AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "CZK",
    "DKK", "EGP", "EUR", "GBP", "HUF", "INR", "JPY", "KRW",
    "MDL", "MXN", "NOK", "NZD", "PLN", "RON", "RSD", "RUB",
    "SEK", "THB", "TRY", "UAH", "USD", "XAU", "XDR", "ZAR"
];

const theme = createTheme({
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: 'white',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: 'white',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'white',
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: 'white',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    maxWidth: '200px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#f5f5f5',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                        },
                    },
                },
            },
        },
    },
});

const CurrencyConverterForm = () => {
    const userId = localStorage.getItem("userId");
    const [formData, setFormData] = useState({
        userKey: userId,
        amount: '',
        currencyFrom: '',
        currencyTo: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(config.convertCurrencyApi, formData);
            console.log('Conversion Result:', response.data);
        } catch (error) {
            console.error('Error converting currency:', error.response?.data || error.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField
                        id="outlined-basic"
                        label="Amount"
                        variant="outlined"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        margin='normal'
                        style={{width: "300px"}}
                    />
                </div>
                <div>
                    <FormControl variant="outlined" margin="normal" style={{width: "300px"}}>
                        <InputLabel htmlFor="currencyFrom">Currency From</InputLabel>
                        <Select
                            id="currencyFrom"
                            name="currencyFrom"
                            value={formData.currencyFrom}
                            onChange={handleChange}
                            label="Currency From"
                        >
                            {currencies.map((currency) => (
                                <MenuItem key={currency} value={currency}>
                                    {currency}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl variant="outlined" style={{width: "300px"}} margin="normal">
                        <InputLabel htmlFor="currencyTo">Currency To</InputLabel>
                        <Select
                            id="currencyTo"
                            name="currencyTo"
                            value={formData.currencyTo}
                            onChange={handleChange}
                            label="Currency To"
                        >
                            {currencies.map((currency) => (
                                <MenuItem key={currency} value={currency}>
                                    {currency}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px', marginLeft: "20%" }}>
                    Convert
                </Button>
            </form>
        </ThemeProvider>
    );
};

export default CurrencyConverterForm;
