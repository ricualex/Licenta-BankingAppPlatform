import React, { useEffect } from "react";
import "../../InternetBankingStyle.css";
import { useState } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Table, TableBody } from '@mui/material';
import TransactionRow from "./components/TransactionRow";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const MyAccount = () => {
    const [userDataState, setUserDataState] = useState({
        accountSold: "0 Lei",
        username: "userName",
        iban: "0000 000 000 000",
        transactionRows: [],
        paymentsRows: [
            { data: ["Power bill", "2 days", "-150 lei"] },
            { data: ["Cell phone", "12 days", "-192 lei"] },
        ]
    });
    const [isSoldVisible, setIsSoldVisible] = useState(true);
    const dispatch = useDispatch();

    const toggleSoldVisibility = () => {
        setIsSoldVisible(!isSoldVisible);
        console.log(userDataState);
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    const lastLogin = () => {
        return localStorage.getItem("lastLogin");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const response = await axios.post('http://localhost:8080/api/syncUser', { userId });
                if (response.status === 200) {
                    dispatch({ type: 'SET_USER', payload: response.data.user });

                    const transactions = response.data.user.transactions;
                    const transactionRows = transactions.slice(-2).reverse().map(transaction => {
                        const userName = Object.keys(transaction)[0];
                        const values = Object.values(transaction)[0];
                        const currencyString = Object.keys(values)
                            .map(currency => `${values[currency]} ${currency}`)
                            .join(" ");
                        return { data: [userName, currencyString] };
                    });

                    const userData = {
                        accountSold: `${parseFloat(response.data.user.balance.RON).toFixed(2)} Lei`,
                        username: response.data.user.userName,
                        iban: response.data.user.iban,
                        transactionRows: transactionRows,
                        paymentsRows: [
                            { data: ["Power bill", "2 days", "-150 lei"] },
                            { data: ["Cell phone", "12 days", "-192 lei"] },
                        ]
                    };
                    setUserDataState(userData);
                }
            } catch (error) {
                console.error('Failed to sync user data', error);
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, [dispatch]);

    return (
        <div className="right-menu normal-panel">
            <div className="my-account-titles">
                <h1 className="my-account-title">My account</h1>
                <h3 className="my-account-title">{`Last account activity: ${lastLogin()}`}</h3>
            </div>
            <div className="account-details">
                <ButtonGroup className="account-details-button-group" variant="outlined">
                    <Button id="account-sold-button">{isSoldVisible ? userDataState.accountSold : "Main account"}</Button>
                    <IconButton id="toggle-visibility-button" onClick={toggleSoldVisibility}>
                        <VisibilityOffIcon sx={{ color: 'white', fontSize: 25 }} />
                    </IconButton>
                </ButtonGroup>
                <ButtonGroup className="account-details-button-group" variant="outlined">
                    <Button id="account-username-button">{userDataState.username}</Button>
                    <IconButton onClick={() => copyToClipboard(userDataState.username)}>
                        <ContentCopyIcon sx={{ color: 'white', fontSize: 25 }} />
                    </IconButton>
                </ButtonGroup>
                <ButtonGroup className="account-details-button-group" variant="outlined">
                    <Button id="account-iban-button">{userDataState.iban}</Button>
                    <IconButton onClick={() => copyToClipboard(userDataState.iban)}>
                        <ContentCopyIcon sx={{ color: 'white', fontSize: 25 }} />
                    </IconButton>
                </ButtonGroup>
            </div>
            <div className="recent-transfers">
                <h2 style={{ color: "white", fontSize: "18px" }}>Recent transactions</h2>
                <Table>
                    <TableBody>
                        {userDataState.transactionRows.map((row, index) => (
                            <TransactionRow key={index} data={row.data} />
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="future-payments">
                <h2 style={{ color: "white", fontSize: "18px" }}>Future payments</h2>
                <Table>
                    <TableBody>
                        {userDataState.paymentsRows.map((row, index) => (
                            <TransactionRow key={index} icon="clock" data={row.data} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default MyAccount;