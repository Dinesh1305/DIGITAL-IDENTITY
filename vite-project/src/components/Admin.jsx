import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../Json/Digital_identity.json"; // Ensure correct ABI path

const contractAddress = "0x1923F496cf20567819225728b725d8CF03F151b7"; // Replace with actual address

const Admin = ({ account }) => {
  const [contract, setContract] = useState(null);
  const [collegeAddress, setCollegeAddress] = useState("");
  const [onlinePlatformAddress, setOnlinePlatformAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize Web3 and Contract
  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const deployedContract = new web3.eth.Contract(abi.abi, contractAddress);
        setContract(deployedContract);
        
        console.log("🟢 Contract Loaded:", deployedContract.options.address);
        console.log("🟢 Available Methods:", Object.keys(deployedContract.methods));
      } catch (error) {
        console.error("🔴 Error loading contract:", error);
      }
    };

    loadBlockchainData();
  }, []);

  // Helper Function to Handle Transactions
  const sendTransaction = async (method, params) => {
    if (!contract) {
      alert("Contract not connected!");
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
      alert(`✅ Transaction Successful! \nView on Etherscan: ${tx.transactionHash}`);

      // Open Etherscan link automatically
      window.open(`https://sepolia.etherscan.io/tx/${tx.transactionHash}`, "_blank");
    } catch (error) {
      console.error(`🔴 Error in ${method}:`, error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Admin Panel</h2>

      {/* Add College Section */}
      <div>
        <h3>Add College</h3>
        <input
          type="text"
          placeholder="College Address"
          value={collegeAddress}
          onChange={(e) => setCollegeAddress(e.target.value)}
        />
        <button onClick={() => sendTransaction("addCollege", [collegeAddress])} disabled={loading}>
          {loading ? "Adding..." : "Add College"}
        </button>
      </div>

      {/* Add Online Platform Section */}
      <div>
        <h3>Add Online Platform</h3>
        <input
          type="text"
          placeholder="Online Platform Address"
          value={onlinePlatformAddress}
          onChange={(e) => setOnlinePlatformAddress(e.target.value)}
        />
        <button onClick={() => sendTransaction("addOnlinePlatform", [onlinePlatformAddress])} disabled={loading}>
          {loading ? "Adding..." : "Add Online Platform"}
        </button>
      </div>
    </div>
  );
};

export default Admin;
