import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Web3 from "web3"; // Import Web3.js
import Admin from "./components/Admin";
import College from "./components/College";
import Company from "./components/Company";
import OnlinePlatform from "./components/OnlinePlatform";
import Student from "./components/Student";
import "./App.css";

// Hidden component to connect to MetaMask using Web3.js
const MetaMaskConnector = () => {
  useEffect(() => {
    async function connectMetaMask() {
      if (window.ethereum) {
        // Initialize Web3 using MetaMask's provider
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });
          // Get list of accounts
          const accounts = await web3.eth.getAccounts();
          console.log("Connected account:", accounts[0]);
          // You can optionally store this account in state or context
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else if (window.web3) {
        // Legacy dapp browsers...
        const web3 = new Web3(window.web3.currentProvider);
        const accounts = await web3.eth.getAccounts();
        console.log("Connected account:", accounts[0]);
      } else {
        console.warn("MetaMask not installed. Please install MetaMask.");
      }
    }
    connectMetaMask();
  }, []);
  return null; // This component doesn't render any visible UI
};

const entities = [
  { name: "Admin", image: "/images/admin.png", path: "/admin" },
  { name: "College", image: "/images/college.png", path: "/college" },
  { name: "Online Platform", image: "/images/platform.png", path: "/platform" },
  { name: "Student", image: "/images/student.png", path: "/student" },
  { name: "Company", image: "/images/company.png", path: "/company" },
];

function Home() {
  return (
    <div
      className="container"
      style={{
        backgroundColor: "white",
        minHeight: "100vh",
        width: "100vw",
        padding: "20px"
      }}
    >
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
        🔒 Digital Identity Verification System
      </h1>
      <div className="cards-grid">
        {entities.map((entity) => (
          <div
            className="card"
            key={entity.name}
            style={{
              backgroundColor: "purple",
              color: "white",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center"
            }}
          >
            <img
              src={entity.image}
              alt={entity.name}
              className="card-image"
              style={{ width: "100px", height: "100px" }}
            />
            <h3>{entity.name}</h3>
            <Link
              to={entity.path}
              className="card-button"
              style={{
                backgroundColor: "white",
                color: "purple",
                padding: "10px",
                borderRadius: "5px",
                textDecoration: "none"
              }}
            >
              {entity.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      {/* MetaMaskConnector runs on load and connects to MetaMask using Web3 */}
      <MetaMaskConnector />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/college" element={<College />} />
        <Route path="/company" element={<Company />} />
        <Route path="/platform" element={<OnlinePlatform />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </Router>
  );
}
