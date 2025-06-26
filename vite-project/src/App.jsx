import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import axios from "axios";
import abi from "./Json/Digital_identity.json";
import "./App.css";

// Import Components
import Admin from "./components/Admin";
import College from "./components/College";
import Company from "./components/Company";
import OnlinePlatform from "./components/OnlinePlatform";
import Student from "./components/Student";

const entities = [
  { name: "Admin", image: "/images/admin.png", path: "/admin" },
  { name: "College", image: "/images/college.png", path: "/college" },
  { name: "Online Platform", image: "/images/platform.png", path: "/platform" },
  { name: "Student", image: "/images/student.png", path: "/student" },
  { name: "Company", image: "/images/company.png", path: "/company" },
];

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

        const contractAddress = "0x1923F496cf20567819225728b725d8CF03F151b7";
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

  function Home() {
    return (
      <div className="container" style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", padding: "20px" }}>
        <h1 style={{ textAlign: "center", fontWeight: "bold" }}>🔒 Digital Identity Verification System</h1>
        <p style={{ textAlign: "center" }}>👤 Connected Account: <strong>{state.account?.toString() || "Not connected"}</strong></p>
        <div className="cards-grid">
          {entities.map((entity) => (
            <div className="card" key={entity.name} style={{ backgroundColor: "purple", color: "white", borderRadius: "10px", padding: "20px", textAlign: "center" }}>
              <img src={entity.image} alt={entity.name} className="card-image" style={{ width: "100px", height: "100px" }} />
              <h3>{entity.name}</h3>
              <Link to={entity.path} className="card-button" style={{ backgroundColor: "white", color: "purple", padding: "10px", borderRadius: "5px", textDecoration: "none" }}>{entity.name}</Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin contract={state.contract} account={state.account} />} />
        <Route path="/college" element={<College contract={state.contract} account={state.account} />} />
        <Route path="/platform" element={<OnlinePlatform contract={state.contract} account={state.account} />} />
        <Route path="/student" element={<Student contract={state.contract} account={state.account} />} />
        <Route path="/company" element={<Company contract={state.contract} account={state.account} />} />
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
    </Router>
  );
}

export default App;
