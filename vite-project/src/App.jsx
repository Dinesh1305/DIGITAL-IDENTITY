import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import axios from "axios";
import abi from "./Json/Digital_identity.json";
import "./App.css";

// Import Components
import Admin from "./components/Admin";
import College from "./components/College";
import OnlinePlatform from "./components/OnlinePlatform";
import Student from "./components/Student";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    account: "Not connected",
  });

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask to use this application.");
          return;
        }

        const provider = new BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const accounts = await provider.listAccounts();

        if (!accounts.length) {
          alert("No account connected. Please unlock MetaMask.");
          return;
        }

        const contractAddress = "0x1923F496cf20567819225728b725d8CF03F151b7"; // Update if needed
        const contractABI = abi.abi;
        const contract = new Contract(contractAddress, contractABI, signer);

        setState({
          provider,
          signer,
          contract,
          account: accounts[0]?.address || accounts[0] || "Not connected",
        });

        console.log("Connected to contract:", contract);
        alert("Wallet Connected: " + accounts[0]?.address || accounts[0]);
      } catch (error) {
        console.error("Connection error:", error);
        alert("Failed to connect: " + error.message);
      }
    };

    connectWallet();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "User", text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post("http://localhost:5000/chat", { message: input });
      setMessages([...newMessages, { sender: "Bot", text: response.data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "Bot", text: "Error fetching response." }]);
    }

    setInput("");
  };

  return (
    <Router>
      <div className="container">
        <h1>🔐 Digital Identity Verification System</h1>
        <p>👤 Connected Account: <strong>{state.account?.toString() || "Not connected"}</strong></p>
        <p>📜 Contract Address: <strong>{state.contract?.target?.toString() || state.contract?.address || "Not connected"}</strong></p>

        <nav className="button-container">
          <Link to="/admin"><button>👨‍💼 Admin</button></Link>
          <Link to="/college"><button>🏫 College</button></Link>
          <Link to="/online-platform"><button>🌐 Online Platform</button></Link>
          <Link to="/student"><button>🎓 Student</button></Link>
        </nav>

        <Routes>
          <Route path="/admin" element={<Admin contract={state.contract} account={state.account} />} />
          <Route path="/college" element={<College contract={state.contract} account={state.account} />} />
          <Route path="/online-platform" element={<OnlinePlatform contract={state.contract} account={state.account} />} />
          <Route path="/student" element={<Student contract={state.contract} account={state.account} />} />
        </Routes>

        {/* Chatbot UI */}
        <div className="chat-container">
          <h2>💬 Chatbot</h2>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "User" ? "user-message" : "bot-message"}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="input-box">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
