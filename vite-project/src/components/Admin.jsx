import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../Json/Digital_identity.json";

const contractAddress = "0x1aeF3816F9676d3FE1e36f8eEd6bE839a2c362AD"; 

const Admin = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [collegeAddress, setCollegeAddress] = useState("");
  const [onlinePlatformAddress, setOnlinePlatformAddress] = useState("");
  const [loadingCollege, setLoadingCollege] = useState(false);
  const [loadingPlatform, setLoadingPlatform] = useState(false);

  // Connect Wallet and Load Blockchain Data
  useEffect(() => {
    const connectWallet = async () => {
      if (!window.ethereum) {
        alert("🛑 MetaMask is not installed! Please install it.");
        return;
      }

      const web3 = new Web3(window.ethereum);

      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]); // Set the first account
        console.log("🟢 Wallet Connected:", accounts[0]);

        const deployedContract = new web3.eth.Contract(abi.abi, contractAddress);
        setContract(deployedContract);

        console.log("🟢 Contract Loaded:", deployedContract.options.address);
      } catch (error) {
        console.error("🔴 Error connecting wallet:", error);
        alert("🛑 Please connect your wallet.");
      }
    };

    connectWallet();
  }, []);

  // Helper Function to Handle Transactions
  const sendTransaction = async (method, params, setLoading) => {
    if (!contract) {
      alert("🛑 Contract not connected!");
      return;
    }
    if (!account) {
      alert("🛑 Wallet not connected! Please connect your wallet.");
      return;
    }
    if (!contract.methods[method]) {
      alert(`🔴 Method '${method}' not found in contract!`);
      return;
    }

    try {
      console.log(`🟢 Sending Transaction: ${method}`, params);
      setLoading(true);

      const tx = await contract.methods[method](...params).send({ from: account });

      console.log("✅ Transaction Sent:", tx.transactionHash);
      alert(`✅ Transaction Successful! \nView on Etherscan: https://sepolia.etherscan.io/tx/${tx.transactionHash}`);

      window.open(`https://sepolia.etherscan.io/tx/${tx.transactionHash}`, "_blank");
    } catch (error) {
      console.error(`🔴 Error in ${method}:`, error);
      alert("Error: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <h2 className="admin-title">Admin Panel</h2>

        <p className="wallet-info">Connected Wallet: {account ? account : "Not Connected"}</p>

        <div className="admin-section">
          <label className="admin-label">Add College</label>
          <input
            type="text"
            placeholder="College Address"
            value={collegeAddress}
            onChange={(e) => setCollegeAddress(e.target.value)}
            className="admin-input"
          />
          <button 
            onClick={() => sendTransaction("addCollege", [collegeAddress], setLoadingCollege)} 
            disabled={loadingCollege}
            className="admin-button"
          >
            {loadingCollege ? "Adding..." : "Add College"}
          </button>
        </div>

        <div className="admin-section">
          <label className="admin-label">Add Online Platform</label>
          <input
            type="text"
            placeholder="Online Platform Address"
            value={onlinePlatformAddress}
            onChange={(e) => setOnlinePlatformAddress(e.target.value)}
            className="admin-input"
          />
          <button 
            onClick={() => sendTransaction("addOnlinePlatform", [onlinePlatformAddress], setLoadingPlatform)} 
            disabled={loadingPlatform}
            className="admin-button"
          >
            {loadingPlatform ? "Adding..." : "Add Online Platform"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
