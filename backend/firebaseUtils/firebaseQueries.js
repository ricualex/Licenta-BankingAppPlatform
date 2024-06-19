module.exports = (admin) => {
  const axios = require("axios");
  const db = admin.database();

  async function getUserByUserName(userName) {
    const usersRef = db.ref('users');
    const snapshot = await usersRef.once('value');

    let userData = null;
    snapshot.forEach(childSnapshot => {
      const childData = childSnapshot.val();
      if (childData.userName === userName) {
        userData = { id: childSnapshot.key, userName: childData.userName };
      }
    });
    return userData;
  }

  async function loginUsingFirebase(username, password) {
    const usersRef = db.ref('users');
    const snapshot = await usersRef.once('value');

    let userId = null;
    snapshot.forEach(childSnapshot => {
      const childData = childSnapshot.val();
      if (childData.userName === username) {
        userId = childSnapshot.key;
      }
    });

    if (userId) {
      await db.ref(`users/${userId}`).update({ needConfirmation: "true" });

      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          const userSnapshot = await db.ref(`users/${userId}`).once('value');
          const userData = userSnapshot.val();
          if (userData.needConfirmation === "false") {
            clearInterval(interval);
            resolve({ key: userSnapshot.key, success: true, message: "Login successful", user: userData });
          }
        }, 1000);

        setTimeout(() => {
          clearInterval(interval);
          reject({ success: false, message: "Login failed. Confirmation time expired!" });
        }, 180000);
      });
    } else {
      return { success: false, message: "User not found" };
    }
  }

  async function syncUserDataForRedux(userId) {
    const snapshot = await db.ref(`users/${userId}`).once('value');
    const userData = snapshot.val();
    return new Promise((resolve, reject) => {
      resolve({ key: snapshot.key, success: true, message: "Sync successful", user: userData });
    });
  }

  async function transferMoney(userFromIdentifier, userToIdentifier, sum, currency) {
    if (sum <= 0) {
      return { status: 500, message: 'Transfer failed. Invalid sum!' };
    }
    else {
      try {
        const isIban1 = userFromIdentifier.startsWith('ROEB');
        const isIban2 = userToIdentifier.startsWith('ROEB');

        let user1Ref, user2Ref;
        if (isIban1) {
          user1Ref = db.ref('users').orderByChild('iban').equalTo(userFromIdentifier);
        } else {
          user1Ref = db.ref('users').orderByChild('userName').equalTo(userFromIdentifier);
        }
        if (isIban2) {
          user2Ref = db.ref('users').orderByChild('iban').equalTo(userToIdentifier);
        } else {
          user2Ref = db.ref('users').orderByChild('userName').equalTo(userToIdentifier);
        }

        const user1Snapshot = await user1Ref.once('value');
        const user1Data = user1Snapshot.val();
        if (!user1Data) {
          return { status: 500, message: 'User1 not found' };
        }
        const user1Key = Object.keys(user1Data)[0];
        const user1Name = user1Data[user1Key].userName;

        const user2Snapshot = await user2Ref.once('value');
        const user2Data = user2Snapshot.val();
        if (!user2Data) {
          return { status: 500, message: 'User2 not found' };
        }
        const user2Key = Object.keys(user2Data)[0];
        const user2Name = user2Data[user2Key].userName;

        const user1Balance = user1Data[user1Key].balance[currency];
        const user2Balance = user2Data[user2Key].balance[currency];

        if (user1Balance < sum) {
          return { status: 500, message: 'Insufficient funds' };
        }

        const updates = {};
        updates[`/users/${user1Key}/balance/${currency}`] = user1Balance - sum;
        updates[`/users/${user2Key}/balance/${currency}`] = user2Balance + sum;

        let user1FriendsTransactions = user1Data[user1Key].friendsTransactions || [];
        let user2FriendsTransactions = user2Data[user2Key].friendsTransactions || [];

        user1FriendsTransactions.push({ [user2Name]: { [currency]: -sum } });
        user2FriendsTransactions.push({ [user1Name]: { [currency]: +sum } });

        updates[`/users/${user1Key}/friendsTransactions`] = user1FriendsTransactions;
        updates[`/users/${user2Key}/friendsTransactions`] = user2FriendsTransactions;

        updates[`/users/${user1Key}/transactions`] = user1FriendsTransactions;
        updates[`/users/${user2Key}/transactions`] = user2FriendsTransactions;

        updates[`/users/${user1Key}/friendList/${user2Name}`] = true;
        updates[`/users/${user2Key}/friendList/${user1Name}`] = true;

        await db.ref().update(updates);
        return { status: 200, message: 'Transfer was successful!' };

      } catch (error) {
        return { status: 500, message: 'Transfer failed', error: error.message };
      }
    }
  }

  const getEmailsForFriendList = async (userId) => {
    try {
      const userRef = db.ref(`users/${userId}`);
      const userSnapshot = await userRef.once('value');

      if (!userSnapshot.exists()) {
        return { status: 500, message: 'User not found' };
      }

      const userData = userSnapshot.val();
      const friendList = userData.friendList;

      const friendEmailsPromises = Object.keys(friendList).map(async (userName) => {
        const friendQuery = db.ref('users').orderByChild('userName').equalTo(userName);
        const friendSnapshot = await friendQuery.once('value');

        if (!friendSnapshot.exists()) {
          return { status: 500, message: `Friend with userName ${userName} not found` };
        }

        const friendData = friendSnapshot.val();
        const friendKey = Object.keys(friendData)[0];
        return { found: true, [userName]: friendData[friendKey].email };
      });

      const friendEmails = await Promise.all(friendEmailsPromises);
      return { status: 200, friendEmails: friendEmails, message: 'Request done successfully!' };
    } catch (error) {
      return { status: 500, message: 'Request failed', error: error.message };
    }
  };

  async function convertCurrency(userKey, amount, currencyFrom, currencyTo) {
    const userRef = db.ref(`users/${userKey}`);
    let currencyRates;

    try {
      const response = await axios.get('http://localhost:8080/api/getCurrencyRates');
      currencyRates = response.data;

    } catch (error) {
      console.error('Error fetching currency rates:', error);
      return { status: 500, message: 'Error fetching currency rates' };
    }

    try {
      const snapshot = await userRef.once('value');
      const userData = snapshot.val();
      if (!userData) {
        return { status: 500, message: 'User not found!' };
      }

      const balance = userData.balance;
      if (!balance || balance[currencyFrom] === undefined) {
        return { status: 500, message: `Balance for currency ${currencyFrom} not found` };
      }
      const balanceInCurrencyFrom = balance[currencyFrom];
      if (balanceInCurrencyFrom < amount) {
        return { status: 400, message: 'Insufficient balance' };
      }
      const amountInRON = amount * (parseFloat(currencyRates[currencyFrom]) || 1);
      const convertedAmount = amountInRON / (parseFloat(currencyRates[currencyTo]) || 0);
      const newBalanceInCurrencyTo = (balance[currencyTo] || 0) + (isNaN(convertedAmount) ? parseFloat(convertedAmount) : convertedAmount);
      const newBalanceInCurrencyFrom = balanceInCurrencyFrom - amount;

      await userRef.child(`balance/${currencyTo}`).set(newBalanceInCurrencyTo);
      await userRef.child(`balance/${currencyFrom}`).set(newBalanceInCurrencyFrom);

      return { status: 200, success: true, newBalance: { [currencyFrom]: newBalanceInCurrencyFrom, [currencyTo]: newBalanceInCurrencyTo } };
    } catch (error) {
      console.error('Error updating balance:', error);
      return { status: 500, message: 'Error updating balance' };
    }
  }

  return {
    getUserByUserName,
    loginUsingFirebase,
    syncUserDataForRedux,
    transferMoney,
    getEmailsForFriendList,
    convertCurrency
  };
};
