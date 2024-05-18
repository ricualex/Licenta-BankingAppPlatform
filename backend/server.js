const express = require("express");
const routes = require("./router.js");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: './store.env' });

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000'
  };

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', routes);

const port = 80;

console.log(process.env.DATABASE_URL);

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('testapi!');
});

app.get('/test', (req, res) => {
    
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
