const express = require('express');
const cors = require("cors");
const app = express();
const port = 8081;

const db = require('./firebase');
const cron = require('node-cron');

const corsOptions = {
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));

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

app.get('/fetch-scheduler', async (req, res) => {
  try {
    const userKey = req.query.userKey;
    if (!userKey) {
      return res.status(400).send('userKey parameter is required.');
    }

    const schedulerRef = db.ref('scheduler');
    const snapshot = await schedulerRef.once('value');
    const scheduledPayments = snapshot.val();

    if (scheduledPayments) {
      const results = Object.keys(scheduledPayments).map(key => {
        const payment = scheduledPayments[key];
        if (payment.userKey === userKey) {
          const today = new Date();
          const startDate = new Date(payment.startDate);
          const daysDifference = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
          const daysUntilPayment = payment.recurrenceDays - (daysDifference % payment.recurrenceDays);
          return {
            destinationName: payment.destinationName,
            amount: payment.amount,
            daysUntilPayment
          };
        }
      }).filter(payment => payment !== undefined);

      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(404).send('No scheduled payments found for the provided userKey.');
      }
    } else {
      res.status(404).send('No scheduled payments found.');
    }
  } catch (error) {
    console.error('Error fetching scheduler data:', error);
    res.status(500).send('Failed to fetch scheduler data.');
  }
});


app.delete('/delete-scheduler', async (req, res) => {
  const { destinationName } = req.query;
  try {
    const schedulerRef = db.ref('scheduler');
    const snapshot = await schedulerRef.once('value');
    const scheduledPayments = snapshot.val();

    if (scheduledPayments) {
      const paymentKeys = Object.keys(scheduledPayments).filter(
        key => scheduledPayments[key].destinationName === destinationName
      );

      if (paymentKeys.length > 0) {
        await Promise.all(paymentKeys.map(key => db.ref(`scheduler/${key}`).remove()));
        res.status(200).send('Recurent payment deleted successfully.');
      } else {
        res.status(404).send('No scheduled payment found with the given destination name.');
      }
    } else {
      res.status(404).send('No scheduled payments found.');
    }
  } catch (error) {
    console.error('Error deleting scheduled payment:', error);
    res.status(500).send('Failed to delete scheduled payment.');
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
