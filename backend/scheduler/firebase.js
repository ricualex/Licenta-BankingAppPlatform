const admin = require('firebase-admin');
const serviceAccount = require('./firebase-connection.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mobilebankingapp-53f91-default-rtdb.firebaseio.com"
});

const db = admin.database();

module.exports = db;

