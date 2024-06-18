// paymentScheduler.js
const db = require('./firebase');
const cron = require('node-cron');

// Helper function to check if now matches the payment date based on start date and recurrence interval in minutes
function isPaymentDue(startDate, recurrenceMinutes) {
  const now = new Date();
  const start = new Date(startDate);

  const diffTime = Math.abs(now - start);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  return diffMinutes % recurrenceMinutes === 0;
}

// Function to make a payment
async function makePayment(userKey, destinationName, destinationIban, amount) {
  try {
    const userRef = db.ref(`users/${userKey}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();

    // Check if the user has enough balance
    if (userData.balance.RON >= amount) {
      // Deduct the amount from the user's balance
      const newBalance = userData.balance.RON - amount;
      await userRef.child('balance').update({ RON: newBalance });

      // Log the transaction in the separate transactions collection
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

// Schedule the function to run every 6 minutes
cron.schedule('*/5 * * * *', async () => {
  // Define your payment details
  const userKey = 'VUPsjpgsv4hXcAkkGuxo1uhVzIK2';
  const destinationName = 'Some Destination';
  const destinationIban = 'ROXX1234567890';
  const amount = 10;
  const startDate = new Date().toISOString(); // Set the start date to the current time
  const recurrenceMinutes = 5; // Recurrence interval in minutes

  if (isPaymentDue(startDate, recurrenceMinutes)) {
    await makePayment(userKey, destinationName, destinationIban, amount);
  }
});

