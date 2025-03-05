import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../Json/Digital_identity.json"; // Ensure correct ABI path

const contractAddress = "0x86ab9f453215774E50FcE92d1fe3e30Bb0B123E9"; // Replace with actual address

const Admin = ({ account }) => {
  const [contract, setContract] = useState(null);
  const [collegeAddress, setCollegeAddress] = useState("");
  const [onlinePlatformAddress, setOnlinePlatformAddress] = useState("");
  const [loadingCollege, setLoadingCollege] = useState(false);
  const [loadingPlatform, setLoadingPlatform] = useState(false);

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
  const sendTransaction = async (method, params, setLoading) => {
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
    <div className="admin-wrapper">
      <div className="admin-container">
        <h2 className="admin-title">Admin Panel</h2>

        {/* Add College Section */}
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

        {/* Add Online Platform Section */}
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
