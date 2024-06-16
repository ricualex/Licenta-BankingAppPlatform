import React from "react";
import "../../InternetBankingStyle.css"
import { useState } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Table, TableBody } from '@mui/material';
import TransactionRow from "./components/TransactionRow";

const MyAccount = () => {
    const date = new Date();
    const [accountSold, setAccountSold] = useState("12332.0 Lei");
    const [username, setUsername] = useState("username");
    const [iban, setIban] = useState("0000 0000 0000 0000");
    const [isSoldVisible, setIsSoldVisible] = useState(true);

    const toggleSoldVisibility = () => {
        setIsSoldVisible(!isSoldVisible);
    }

    const transactionRows = [
        { data: ["Profi", "-20 lei"] },
        { data: ["Alexandru", "+15 lei"] },
    ];

    const paymentsRows = [
        { data: ["Power bill", "2 days", "-150 lei"] },
        { data: ["Cell phone", "12 days", "-192 lei"] },
    ];

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    const formatDateTime = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="right-menu normal-panel">
            <div className="my-account-titles">
                <h1 className="my-account-title">My account</h1>
                <h3 className="my-account-title">{`Last account activity: ${formatDateTime(date)}`}</h3>
            </div>
            <div className="account-details">
                <ButtonGroup className="account-details-button-group" variant="outlined">
                    <Button id="account-sold-button">{isSoldVisible ? accountSold : "Main account"}</Button>
                    <IconButton id="toggle-visibility-button" onClick={toggleSoldVisibility}>
                        <VisibilityOffIcon sx={{ color: 'white', fontSize: 25 }} />
                    </IconButton>
                </ButtonGroup>
                <ButtonGroup className="account-details-button-group" variant="outlined">
                    <Button id="account-username-button">{username}</Button>
                    <IconButton onClick={() => copyToClipboard(username)}>
                        <ContentCopyIcon sx={{ color: 'white', fontSize: 25 }} />
                    </IconButton>
                </ButtonGroup>
                <ButtonGroup className="account-details-button-group" variant="outlined">
                    <Button id="account-iban-button">{iban}</Button>
                    <IconButton onClick={() => copyToClipboard(iban)}>
                        <ContentCopyIcon sx={{ color: 'white', fontSize: 25 }} />
                    </IconButton>
                </ButtonGroup>
            </div>
            <div className="recent-transfers">
                <h2 style={{ color: "white", fontSize: "18px" }}>Recent transactions</h2>
                <Table>
                    <TableBody>
                        {transactionRows.map((row, index) => (
                            <TransactionRow key={index} data={row.data} />
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="future-payments">
                <h2 style={{ color: "white", fontSize: "18px" }}>Future payments</h2>
                <Table>
                    <TableBody>
                        {paymentsRows.map((row, index) => (
                            <TransactionRow key={index} icon="clock" data={row.data} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default MyAccount;