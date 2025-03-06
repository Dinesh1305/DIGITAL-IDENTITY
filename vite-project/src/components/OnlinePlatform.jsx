import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json"; // Ensure correct path

const contractAddress = "0x1923F496cf20567819225728b725d8CF03F151b7"; // Replace with actual contract address

const OnlinePlatform = ({ account }) => {
    const [contract, setContract] = useState(null);
    const [studentAddress, setStudentAddress] = useState("");
    const [platformAddress, setPlatformAddress] = useState("");
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

    // Add Student to Online Platform
    const addStudentToPlatform = async () => {
        if (!contract) {
            alert("❌ Contract not connected!");
            return;
        }
        if (!contract.methods?.addStudentToOnlinePlatform) {
            alert("❌ addStudentToOnlinePlatform method not found!");
            return;
        }

        try {
            console.log("📌 Adding student to platform:", studentAddress);
            setLoading(true);
            await contract.methods.addStudentToOnlinePlatform(studentAddress, platformAddress).send({ from: account });
            alert("✅ Student added to online platform successfully!");
            setStudentAddress("");
            setPlatformAddress("");
        } catch (error) {
            console.error("🔴 Error adding student to platform:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Add Certificate for Student
    const addCertificate = async () => {
        if (!contract) {
            alert("❌ Contract not connected!");
            return;
        }
        if (!contract.methods?.addCertificate) {
            alert("❌ addCertificate method not found!");
            return;
        }

        try {
            console.log("📌 Adding certificate:", certificateName);
            setLoading(true);
            await contract.methods.addCertificate(certificateName, studentAddress).send({ from: account });
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
            <h2 className="text-lg font-bold">🌐 Online Platform Panel</h2>

            {/* Add Student to Platform Section */}
            <div className="input-group">
                <h3>👨‍🎓 Add Student to Online Platform</h3>
                <input
                    type="text"
                    placeholder="Enter Student Address"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Platform Address"
                    value={platformAddress}
                    onChange={(e) => setPlatformAddress(e.target.value)}
                />
                <button onClick={addStudentToPlatform} disabled={loading}>
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
                <button onClick={addCertificate} disabled={loading}>
                    {loading ? "Adding..." : "➕ Add Certificate"}
                </button>
            </div>
        </div>
    );
};

export default OnlinePlatform;