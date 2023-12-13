import Wallet from "./components/Wallet";
import "./App.scss";
import { useState } from "react";
import CreateWallet from "./components/CreateWallet";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <div className="app">
      {!address && (
        <CreateWallet setAddress={setAddress} setPrivateKey={setPrivateKey} />
      )}
      {address && (
        <Wallet
          balance={balance}
          setBalance={setBalance}
          address={address}
          privateKey={privateKey}
        />
      )}
    </div>
  );
}

export default App;
