const User = require("../mongoutil/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = function (router) {
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            if (!user || !await bcrypt.compare(password, user.password)) {
                return res.status(401).send({ message: "You are not allowed to login!" });
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.status(200).send({ token: token, message: "Login successfuly!" });
        } catch (error) {
            res.status(500).send({ message: "Something went wrong!" });
        }
    });
}


// var options = {
//     apiVersion: 'v1',
//     endpoint: 'http://127.0.0.1:8200',
//     token: 'MY_TOKEN'
//   };
//   var vault = require("node-vault")(options);
//   vault.init({ secret_shares: 1, secret_threshold: 1 })
//   .then( (result) => {
//     var keys = result.keys;
//     vault.token = result.root_token;
//     return vault.unseal({ secret_shares: 1, key: keys[0] })
//   })
//   .catch(console.error);

// const vault = require('node-vault')({ endpoint: 'http://127.0.0.1:8200', token: 'your-root-token' });


// vault.write('secret/hello', { value: 'world', lease: '1s' })
// .then( () => vault.read('secret/hello'))
// .then( () => vault.delete('secret/hello'))
// .catch(console.error);

// async function storeSecret() {
//   await vault.write('/data/exchangeRates', {});
// }

// async function getSecret() {
//   const result = await vault.read('secret/data/myapp');
//   console.log(result.data.data);
// }

// storeSecret().then(getSecret);
