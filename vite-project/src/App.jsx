import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import abi from "./Json/Digital_identity.json";
import "./App.css";

// Import Components
import Admin from "./components/Admin";
import College from "./components/College";
import OnlinePlatform from "./components/OnlinePlatform";
import Student from "./components/Student";
import Company from "./components/Company";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    account: "Not connected",
  });

  useEffect(() => {
    const connectWallet = async () => {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask to use this application.");
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const signer = provider.getSigner();
        const accounts = await provider.listAccounts();

        if (accounts.length === 0) {
          alert("No account connected. Please unlock MetaMask.");
          return;
        }

        const contractAddress = "0x1923F496cf20567819225728b725d8CF03F151b7"; // Change if needed
        const contractABI = abi.abi;
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        setState({ provider, signer, contract, account: accounts[0] });

        console.log("Connected to contract:", contract);
        alert("Wallet Connected: " + accounts[0]);
      } catch (error) {
        console.error("Connection error:", error);
        alert("Failed to connect: " + error.message);
      }
    };

    connectWallet();
  }, []);

  return (
    <Router>
      <div className="container">
        <h1>🔐 Digital Identity Verification System</h1>
        <p>👤 Connected Account: <strong>{state.account}</strong></p>

        <nav className="button-container">
          <Link to="/admin"><button>👨‍💼 Admin</button></Link>
          <Link to="/college"><button>🏫 College</button></Link>
          <Link to="/online-platform"><button>🌐 Online Platform</button></Link>
          <Link to="/student"><button>🎓 Student</button></Link>
          <Link to="/company"><button>🏢 Company</button></Link>
        </nav>

        <Routes>
          <Route path="/admin" element={<Admin contract={state.contract} account={state.account} />} />
          <Route path="/college" element={<College contract={state.contract} account={state.account} />} />
          <Route path="/online-platform" element={<OnlinePlatform contract={state.contract} account={state.account} />} />
          <Route path="/student" element={<Student contract={state.contract} account={state.account} />} />
          <Route path="/company" element={<Company contract={state.contract} account={state.account} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
