import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

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
                        My Transactions
                    </Typography>
                    <List sx={{ maxHeight: 400, overflow: 'auto', marginLeft: "40px" }}>
                        {transactions.map(transaction => (
                            <ListItem key={transaction.id}>
                                <ListItemText
                                    primary={`Destination: ${transaction.destinationName}`}
                                    secondary={`Amount: ${transaction.amount}`}
                                    primaryTypographyProps={{ style: { color: 'white' } }}
                                    secondaryTypographyProps={{ style: { color: 'white' } }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom style={{ color: 'white' }}>
                        Friends Transactions
                    </Typography>
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {friendsTransactions.map((transaction, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`Friend: ${transaction.userName}`}
                                    secondary={`Amount: ${Object.values(transaction.amount)[0]}`}
                                    primaryTypographyProps={{ style: { color: 'white' } }}
                                    secondaryTypographyProps={{ style: { color: 'white' } }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </div>
    );
};

export default TransactionList;
