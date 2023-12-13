import { useEffect, useState } from "react";
import server from "../server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import Transfer from "./Transfer";

function Wallet({ address, balance, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  function signMessage() {
    const message = JSON.stringify({ address, balance, sendAmount, recipient });
    const messageHash = keccak256(utf8ToBytes(message));
    const signature = secp256k1.sign(messageHash, privateKey);

    return {
      messageHash,
      signature,
    };
  }

  async function transfer(evt) {
    evt.preventDefault();

    const confimed = confirm("Click OK to confirm the transaction");

    if (!confimed) {
      return;
    }

    const { messageHash, signature } = signMessage();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: signature.toCompactHex(),
        recoveryBit: signature.recovery,
        messageHash: toHex(messageHash),
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  useEffect(() => {
    async function getBalance() {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    }

    getBalance();

    const intervalId = setInterval(() => getBalance(), 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [balance]);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        <strong>Address</strong>
        <p>{address}</p>
      </label>

      <div className="balance">Balance: {balance}</div>

      <Transfer
        address={address}
        setBalance={setBalance}
        sendAmount={sendAmount}
        setSendAmount={setSendAmount}
        startTransfer={transfer}
        recipient={recipient}
        setRecipient={setRecipient}
      />
    </div>
  );
}

export default Wallet;
