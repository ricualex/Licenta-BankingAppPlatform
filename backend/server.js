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

app.use(express.json());
app.use('/api', router);

console.log(process.env.DATABASE_URL);

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Server is listening at ${process.env.SERVER_URL}:${port}`);
});
