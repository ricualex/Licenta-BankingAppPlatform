import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "./styles.css";

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [friendsTransactions, setFriendsTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/getUserTransactions?userName=user');
                setTransactions(response.data.transactions);
                setFriendsTransactions(response.data.friendsTransactions);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Grid container spacing={3} style={{ marginTop: "40px" }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom style={{ color: 'white', marginLeft: "40px" }}>
                        My Payments
                    </Typography>
                    <List className='transactions-list' sx={{ maxHeight: 400, overflow: 'auto', marginLeft: "40px" }}>
                        {transactions.map(transaction => (
                            <ListItem key={transaction.id} dense style={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemText
                                    primary={`Destination: ${transaction.destinationName}`}
                                    secondary={`Amount: ${transaction.amount} lei`}
                                    primaryTypographyProps={{ style: { color: 'white' } }}
                                    secondaryTypographyProps={{ style: { color: 'white' } }}
                                    style={{ flex: '0 1 auto', width: "250px" }}
                                />
                                <RemoveIcon sx={{ color: 'red' }} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom style={{ color: 'white' }}>
                        Friends Transactions
                    </Typography>
                    <List className='transactions-list' sx={{ maxHeight: "400px", overflow: 'auto' }}>
                        {friendsTransactions.map((transaction, index) => (
                            <ListItem key={index} dense style={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemText
                                    primary={`Friend: ${transaction.userName}`}
                                    secondary={`Amount: ${Object.values(transaction.amount)[0]} lei`}
                                    primaryTypographyProps={{ style: { color: 'white' } }}
                                    secondaryTypographyProps={{ style: { color: 'white' } }}
                                    style={{ flex: '0 1 auto', width: "150px" }}
                                />
                                {Object.values(transaction.amount)[0] > 0 ?
                                    <AddIcon sx={{ color: 'green', marginLeft: "30px" }} /> :
                                    <RemoveIcon sx={{ color: 'red', marginLeft: "30px" }} />}
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </div>
    );
};

export default TransactionList;
