import "../../InternetBankingStyle.css";
import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import "./../../InternetBankingStyle.css";

const TransferMoney = () => {
    const user = useSelector((state) => state.user.user);
    const [userData, setUserData] = useState(null);
    const [friendsList, setFriendsList] = useState([]);

    const [usernameOrIban, setUsernameOrIban] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('');

    const handleUsernameOrIbanChange = (event) => {
        setUsernameOrIban(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    const handleTransferClick = async () => {
        if (user.userName === usernameOrIban || user.iban === usernameOrIban) {
            console.log("Invalid transfer! You can't transfer money to yourself!");
        }
        else {
            try {
                const numericAmount = parseFloat(amount);
                const response = await axios.post('http://localhost:8080/api/transferMoney', {  
                    userFrom: user.userName,
                    "userTo": usernameOrIban,
                    "sum": numericAmount,
                    "currency": selectedCurrency
                });
                if (response.status === 200) {
                    console.log("Transfer succesful!");
                }
            } catch (error) {
                console.log('Error:', error.response ? error.response.data : error.message);
            }       
        }
    }

    const inputStyles = {
        '& label': {
            color: 'white',
        },
        '& label.Mui-focused': {
            color: 'white',
        },
        '& .MuiInputBase-input': {
            color: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
            '&:hover fieldset': {
                borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white',
            },
        },
    };

    useEffect(() => {
        setUserData(user);
        console.log(user);
        const userId = localStorage.getItem("userId");
        const getFriendList = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/getFriendNames', {
                    params: { userId }
                });
                if (response.status === 200) {
                    const newFriends = response.data.friendEmails
                        .filter(friend => friend.found)
                        .map(friend => {
                            const username = Object.keys(friend)[1];
                            const name = friend[username];
                            return { name, username };
                        });

                    setFriendsList([...newFriends]);
                }
            } catch (error) {
                console.log('Error:', error.response ? error.response.data : error.message);
            }
        };
        getFriendList();
    }, []);

    return (
        <div className="right-menu normal-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ color: "white", marginLeft: "30px", marginTop: "-50px" }}>Transfer money</h1>
            <div style={{ display: "flex" }}>
                <div className="transfer-money-left-panel" style={{ display: "flex", flexDirection: "column" }}>
                    <h2 style={{ color: "white", marginLeft: "40px", marginTop: "20px" }}>Recent transactions</h2>
                    <AlignItemsList friendsList={friendsList} />
                </div>
                <div className="transfer-money-left-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "100px", marginTop: "40px" }}>
                    <TextField
                        id="outlined-basic"
                        label="Username or IBAN"
                        variant="outlined"
                        value={usernameOrIban}
                        onChange={handleUsernameOrIbanChange}
                        sx={inputStyles}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Amount"
                        variant="outlined"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        sx={inputStyles}
                        style={{ marginTop: "15px" }}
                    />
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedCurrency}
                        label="Currency"
                        onChange={handleCurrencyChange}
                        style={{ marginTop: "15px" }}
                        sx={{
                            color: 'white',
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white',
                            },
                            '.MuiSvgIcon-root': {
                                color: 'white',
                            },
                        }}
                    >
                        {userData && Object.keys(userData?.balance).map((currency) => (
                            <MenuItem key={currency} value={currency}>
                                {currency}
                            </MenuItem>
                        ))}
                    </Select>
                    <button type="submit" className="send-money-button" onClick={handleTransferClick}>Transfer</button>
                </div>
            </div>
        </div>
    );
};

export default TransferMoney;

function AlignItemsList({ friendsList }) {
    return (
        <List sx={{ width: '100%', marginLeft: "40px", maxWidth: 360, bgcolor: 'transparent', color: 'white' }}>
            {friendsList.map((friend, index) => (
                <React.Fragment key={index}>
                    <Divider variant="inset" component="li" />
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={friend.name} src="/static/images/avatar/3.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={friend.name}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="white"
                                    >
                                        {friend.username}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                </React.Fragment>
            ))}
            <Divider variant="inset" component="li" />
        </List>
    );
}