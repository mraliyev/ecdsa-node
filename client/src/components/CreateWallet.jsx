import server from "../server";

function CreateWallet({ setAddress, setPrivateKey }) {
  async function create(evt) {
    evt.preventDefault();

    try {
      const {
        data: { address, privateKey },
      } = await server.get(`create`);
      setAddress(address);
      setPrivateKey(privateKey); //pretend to store the private key somewhere, e.g. metamask, hardware wallet
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={create}>
      <h1>Create Wallet</h1>
      <input type="submit" className="button" value="Create Wallet" />
    </form>
  );
}

export default CreateWallet;
