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

  // Chatbot states
  const [loadingChat, setLoadingChat] = useState(false);
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

  // WebSocket connection for Chatbot
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

  // Send message handler for Chatbot
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

        {/* Chat Section */}
        <div className="admin-section">
          <h3 className="admin-label">Chat</h3>
          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i} className="chat-message">
                <span className="chat-sender">{msg.sender}: </span>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="admin-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>

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
