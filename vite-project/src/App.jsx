import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Admin from "./components/Admin";
import College from "./components/College";
import Company from "./components/Company";
import OnlinePlatform from "./components/OnlinePlatform";
import Student from "./components/Student";
import "./App.css";

const entities = [
  { name: "Admin", image: "/images/admin.png", path: "/admin" },
  { name: "College", image: "/images/college.png", path: "/college" },
  { name: "Online Platform", image: "/images/platform.png", path: "/platform" },
  { name: "Student", image: "/images/student.png", path: "/student" },
  { name: "Company", image: "/images/company.png", path: "/company" },
];

function Home() {
  return (
    <div className="container" style={{ backgroundColor: "white", minHeight: "100vh", width: "100vw", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>🔒 Digital Identity Verification System</h1>
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

export default function App() {
  return (
    <Router>
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
