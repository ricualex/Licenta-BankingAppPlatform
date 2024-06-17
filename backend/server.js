const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./routes/router.js");

dotenv.config({ path: './store.env' });

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));

const admin = require('firebase-admin');
const serviceAccount = require("./firebase-connection.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mobilebankingapp-53f91-default-rtdb.firebaseio.com"
});
const firebaseUtils = require("./firebaseUtils/firebaseQueries.js")(admin);

app.use(express.json());
app.use('/api', router(firebaseUtils));

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Server is listening at ${process.env.SERVER_URL}:${port}`);
});
