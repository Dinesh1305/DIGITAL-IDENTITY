import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "../Json/Digital_identity.json"; // Ensure correct ABI path

const contractAddress = "0x1923F496cf20567819225728b725d8CF03F151b7"; // Replace with actual address

const Admin = ({ account }) => {
  const [contract, setContract] = useState(null);
  const [collegeAddress, setCollegeAddress] = useState("");
  const [onlinePlatformAddress, setOnlinePlatformAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState(null);

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

  // WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket('wss://your-websocket-server.com');
    setWs(websocket);

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    return () => {
      websocket.close();
    };
  }, []);

  // Send message handler
  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        sender: account,
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      ws.send(JSON.stringify(message));
      setNewMessage("");
    }
  };

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

      {/* Chat Section */}
      <div className="mt-4 p-4 border rounded">
        <h3 className="font-bold mb-2">Chat</h3>
        <div className="h-64 overflow-y-auto mb-4 border p-2">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className="text-sm text-gray-600">{msg.sender}: </span>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded-l"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded-r"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

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