const express = require('express');
const app = express();
const port = 8081;

const db = require('./firebase');
const cron = require('node-cron');

function isPaymentDue(startDate, recurrenceDays) {
  const today = new Date().toISOString().slice(0, 10);
  const start = new Date(startDate);
  const todayDate = new Date(today);

  const diffTime = Math.abs(todayDate - start);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays % recurrenceDays === 0;
}

async function makePayment(userKey, destinationName, destinationIban, amount) {
  try {
    const userRef = db.ref(`users/${userKey}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();

    if (userData.balance.RON >= amount) {
      const newBalance = userData.balance.RON - amount;
      await userRef.child('balance').update({ RON: newBalance });

      const transaction = {
        date: new Date().toISOString(),
        amount,
        destinationName,
        destinationIban,
        userName: userData.userName,
      };
      const newTransactionKey = db.ref('transactions').push().key;
      await db.ref(`transactions/${newTransactionKey}`).set(transaction);

      console.log(`Payment of ${amount} RON made to ${destinationName} (${destinationIban}) by ${userData.userName}`);
    } else {
      console.log(`User ${userData.userName} has insufficient balance for the payment.`);
    }
  } catch (error) {
    console.error('Error making payment:', error);
  }
}

app.post('/schedule-payment', async (req, res) => {
  const { userKey, destinationName, destinationIban, amount, startDate, recurrenceDays } = req.query;

  try {
    const newSchedulerKey = db.ref('scheduler').push().key;
    const scheduledPayment = {
      userKey,
      destinationName,
      destinationIban,
      amount,
      startDate,
      recurrenceDays,
    };

    await db.ref(`scheduler/${newSchedulerKey}`).set(scheduledPayment);

    res.send('Payment scheduled successfully.');
  } catch (error) {
    console.error('Error scheduling payment:', error);
    res.status(500).send('Failed to schedule payment.');
  }
});

cron.schedule('0 0 * * *', async () => {
  const schedulerRef = db.ref('scheduler');
  const snapshot = await schedulerRef.once('value');
  const scheduledPayments = snapshot.val();

  if (scheduledPayments) {
    for (const key in scheduledPayments) {
      const payment = scheduledPayments[key];
      const { userKey, destinationName, destinationIban, amount, startDate, recurrenceDays } = payment;

      if (isPaymentDue(startDate, recurrenceDays)) {
        await makePayment(userKey, destinationName, destinationIban, amount);
      }
    }
  }
});

app.get('/', (req, res) => {
  res.send('Payment Scheduler is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
