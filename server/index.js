const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, messageHash, signature, recoveryBit } = req.body;

  const sign =
    secp256k1.Signature.fromCompact(signature).addRecoveryBit(recoveryBit);

  const publicKey = sign.recoverPublicKey(messageHash).toRawBytes();
  const sender = getAddress(publicKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

// Generation of the private key should be on the FE/hardware wallet
// This is just for the exercise for automatic creation of the 
// addresses/keys to be able to manipulate data
app.get("/create", (req, res) => {
  const privateKey = toHex(secp256k1.utils.randomPrivateKey());
  const publicKey = secp256k1.getPublicKey(privateKey);
  const address = getAddress(publicKey);

  balances[address] = getRandomInt(100, 1000);

  res.send({ privateKey, address });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getAddress(publicKey) {
  return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
