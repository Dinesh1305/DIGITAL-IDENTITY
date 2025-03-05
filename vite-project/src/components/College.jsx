import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json";

const contractAddress = "0x86ab9f453215774E50FcE92d1fe3e30Bb0B123E9"; // Replace with actual contract address

const College = ({ account }) => {
    const [contract, setContract] = useState(null);

    // Separate states for inputs
    const [studentAddressCollege, setStudentAddressCollege] = useState("");
    const [studentAddressCertificate, setStudentAddressCertificate] = useState("");
    const [collegeAddress, setCollegeAddress] = useState("");
    const [certificateName, setCertificateName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileHash, setFileHash] = useState("");

    // Separate loading states
    const [loadingStudent, setLoadingStudent] = useState(false);
    const [loadingCertificate, setLoadingCertificate] = useState(false);
    const [loadingFile, setLoadingFile] = useState(false);

    // Load Web3 and Contract
    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const web3 = new Web3(window.ethereum);
                const deployedContract = new web3.eth.Contract(contractABI.abi, contractAddress);
                setContract(deployedContract);
                console.log("🟢 Contract Address:", deployedContract.options.address);
            } catch (error) {
                console.error("🔴 Error loading contract:", error);
                alert("Failed to load contract. Check the console for details.");
            }
        };

        loadBlockchainData();
    }, []);

    return (
        <div className="college-wrapper">
            <div className="college-container">
                <h2 className="college-title">🏫 College Panel</h2>

                {/* Add Student to College Section */}
                <div className="college-section">
                    <h3 className="college-label">👨‍🎓 Add Student to College</h3>
                    <input
                        type="text"
                        placeholder="Student Address"
                        value={studentAddressCollege}
                        onChange={(e) => setStudentAddressCollege(e.target.value)}
                        className="college-input"
                    />
                    <input
                        type="text"
                        placeholder="College Address"
                        value={collegeAddress}
                        onChange={(e) => setCollegeAddress(e.target.value)}
                        className="college-input"
                    />
                    <button onClick={() => {}} className="college-button">
                        ➕ Add Student
                    </button>
                </div>

                {/* Add Certificate for Student Section */}
                <div className="college-section">
                    <h3 className="college-label">📜 Add Certificate for Student</h3>
                    <input
                        type="text"
                        placeholder="Student Address"
                        value={studentAddressCertificate}
                        onChange={(e) => setStudentAddressCertificate(e.target.value)}
                        className="college-input"
                    />
                    <input
                        type="text"
                        placeholder="Certificate Name"
                        value={certificateName}
                        onChange={(e) => setCertificateName(e.target.value)}
                        className="college-input"
                    />
                    <button onClick={() => {}} className="college-button">
                        ➕ Add Certificate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default College;
