import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json"; // Ensure correct path

const contractAddress = "0x1923F496cf20567819225728b725d8CF03F151b7"; // Replace with actual contract address

const College = ({ account }) => {
    const [contract, setContract] = useState(null);
    const [studentAddress, setStudentAddress] = useState("");
    const [collegeAddress, setCollegeAddress] = useState("");
    const [certificateName, setCertificateName] = useState("");
    const [loading, setLoading] = useState(false);

    // Initialize Web3 and contract instance
    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const web3 = new Web3(window.ethereum);
                const deployedContract = new web3.eth.Contract(contractABI.abi, contractAddress);
                setContract(deployedContract);
                
                console.log("🟢 Contract Address:", deployedContract.options.address);
                console.log("🟢 Available Methods:", Object.keys(deployedContract.methods));
            } catch (error) {
                console.error("🔴 Error loading contract:", error);
            }
        };

        loadBlockchainData();
    }, []);

    // Add Student to College Function
    const addStudentToCollege = async () => {
        if (!contract) {
            alert("❌ Contract not connected!");
            return;
        }
        if (!contract.methods?.addStudentToCollege) {
            alert("❌ addStudentToCollege method not found!");
            return;
        }

        try {
            console.log("📌 Adding student:", studentAddress);
            setLoading(true);
            await contract.methods.addStudentToCollege(studentAddress, collegeAddress).send({ from: account });
            alert("✅ Student added to college successfully!");
            setStudentAddress("");
            setCollegeAddress("");
        } catch (error) {
            console.error("🔴 Error adding student:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Add Certificate Function
    const addCollegeCertificate = async () => {
        if (!contract) {
            alert("❌ Contract not connected!");
            return;
        }
        if (!contract.methods?.addCollegeCertificate) {
            alert("❌ addCollegeCertificate method not found!");
            return;
        }

        try {
            console.log("📌 Adding certificate:", certificateName);
            setLoading(true);
            await contract.methods.addCollegeCertificate(certificateName, studentAddress).send({ from: account });
            alert("✅ Certificate added successfully!");
            setCertificateName("");
            setStudentAddress("");
        } catch (error) {
            console.error("🔴 Error adding certificate:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">🏫 College Panel</h2>

            {/* Add Student to College Section */}
            <div className="input-group">
                <h3>👨‍🎓 Add Student to College</h3>
                <input
                    type="text"
                    placeholder="Enter Student Address"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter College Address"
                    value={collegeAddress}
                    onChange={(e) => setCollegeAddress(e.target.value)}
                />
                <button onClick={addStudentToCollege} disabled={loading}>
                    {loading ? "Adding..." : "➕ Add Student"}
                </button>
            </div>

            {/* Add Certificate for Student Section */}
            <div className="input-group">
                <h3>📜 Add Certificate for Student</h3>
                <input
                    type="text"
                    placeholder="Enter Student Address"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Certificate Name"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                />
                <button onClick={addCollegeCertificate} disabled={loading}>
                    {loading ? "Adding..." : "➕ Add Certificate"}
                </button>
            </div>
        </div>
    );
};

export default College;
