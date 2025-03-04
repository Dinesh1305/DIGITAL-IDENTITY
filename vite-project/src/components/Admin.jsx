import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../Json/Digital_identity.json"; // Ensure correct path

const contractAddress = "0x1923F496cf20567819225728b725d8CF03F151b7"; // Replace with actual contract address

const Admin = ({ account }) => {
  const [contract, setContract] = useState(null);
  const [collegeAddress, setCollegeAddress] = useState("");
  const [onlinePlatformAddress, setOnlinePlatformAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize Web3 and contract instance
  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const deployedContract = new web3.eth.Contract(abi.abi, contractAddress);
        setContract(deployedContract);
        
        console.log("🟢 Contract Address:", deployedContract.options.address);
        console.log("🟢 Available Methods:", Object.keys(deployedContract.methods));
      } catch (error) {
        console.error("🔴 Error loading contract:", error);
      }
    };

    loadBlockchainData();
  }, []);

  // Add College Function
  const addCollege = async () => {
    if (!contract) {
      alert("Contract not connected!");
      return;
    }
    if (!contract.methods?.addCollege) {
      alert("addCollege method not found!");
      return;
    }

    try {
      console.log("🟢 Adding college:", collegeAddress);
      setLoading(true);
      await contract.methods.addCollege(collegeAddress).send({ from: account });
      alert("✅ College added successfully!");
      setCollegeAddress("");
    } catch (error) {
      console.error("🔴 Error adding college:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add Online Platform Function
  const addOnlinePlatform = async () => {
    if (!contract) {
      alert("Contract not connected!");
      return;
    }
    if (!contract.methods?.addOnlinePlatform) {
      alert("addOnlinePlatform method not found!");
      return;
    }

    try {
      console.log("🟢 Adding online platform:", onlinePlatformAddress);
      setLoading(true);
      await contract.methods.addOnlinePlatform(onlinePlatformAddress).send({ from: account });
      alert("✅ Online Platform added successfully!");
      setOnlinePlatformAddress("");
    } catch (error) {
      console.error("🔴 Error adding online platform:", error);
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
        <button onClick={addCollege} disabled={loading}>
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
        <button onClick={addOnlinePlatform} disabled={loading}>
          {loading ? "Adding..." : "Add Online Platform"}
        </button>
      </div>
    </div>
  );
};

export default Admin;
