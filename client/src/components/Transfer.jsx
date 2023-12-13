import { useState } from "react";

function Transfer({
  sendAmount,
  setSendAmount,
  startTransfer,
  recipient,
  setRecipient,
}) {
  const setValue = (setter) => (evt) => setter(evt.target.value);

  return (
    <form className="transfer" onSubmit={startTransfer}>
      <h1>Send Transaction</h1>

      <label>
        Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <input type="submit" className="button" value="Send" />
    </form>
  );
}

export default Transfer;
