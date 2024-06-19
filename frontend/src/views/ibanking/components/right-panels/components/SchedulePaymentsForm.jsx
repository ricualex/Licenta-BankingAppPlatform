import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import './styles.css';

const SchedulePaymentForm = () => {
  const userKey = localStorage.getItem("userId");
  const [destinationName, setDestinationName] = useState('');
  const [destinationIban, setDestinationIban] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [recurrenceDays, setRecurrenceDays] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/schedule-payment', null, {
        params: {
          userKey,
          destinationName,
          destinationIban,
          amount,
          startDate,
          recurrenceDays,
        },
      });

      if (response.status === 200) {
        alert('Payment scheduled successfully.');
      } else {
        alert('Failed to schedule payment.');
      }
    } catch (error) {
      console.error('Error scheduling payment:', error);
      alert('Error scheduling payment.');
    }
  };

  return (
    <div className="form-scrollable-container">
      <form onSubmit={handleSubmit} className="form-container">
        <TextField
          id="destinationName"
          label="Destination Name"
          variant="filled"
          value={destinationName}
          onChange={(e) => setDestinationName(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        <TextField
          id="destinationIban"
          label="Destination IBAN"
          variant="filled"
          value={destinationIban}
          onChange={(e) => setDestinationIban(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        <TextField
          id="amount"
          label="Amount"
          variant="filled"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        <TextField
          id="startDate"
          variant="filled"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        <TextField
          id="recurrenceDays"
          label="Recurrence Days"
          variant="filled"
          type="number"
          value={recurrenceDays}
          onChange={(e) => setRecurrenceDays(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        <div className="button-container">
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Schedule Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SchedulePaymentForm;
