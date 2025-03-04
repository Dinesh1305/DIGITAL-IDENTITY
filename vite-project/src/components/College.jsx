import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json";

// Debugging environment variables
console.log("🔍 API Key:", import.meta.env.VITE_PINATA_API_KEY);
console.log("🔍 Secret Key:", import.meta.env.VITE_PINATA_SECRET_KEY);

const contractAddress = "0x1923F496cf20567819225728b725d8CF03F151b7"; // Replace with actual contract address

const College = ({ account }) => {
    const [contract, setContract] = useState(null);
    const [studentAddress, setStudentAddress] = useState("");
    const [collegeAddress, setCollegeAddress] = useState("");
    const [certificateName, setCertificateName] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileHash, setFileHash] = useState("");

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
            }
        };

        loadBlockchainData();
    }, []);

    // Add Student to College
    const addStudentToCollege = async () => {
        if (!contract) return alert("❌ Contract not connected!");
        if (!contract.methods?.addStudentToCollege) return alert("❌ Method not found!");

        try {
            setLoading(true);
            await contract.methods.addStudentToCollege(studentAddress, collegeAddress).send({ from: account });
            alert("✅ Student added to college successfully!");
            setStudentAddress("");
            setCollegeAddress("");
        } catch (error) {
            console.error("🔴 Error:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Add College Certificate
    const addCollegeCertificate = async () => {
        if (!contract) return alert("❌ Contract not connected!");
        if (!contract.methods?.addCollegeCertificate) return alert("❌ Method not found!");

        try {
            setLoading(true);
            await contract.methods.addCollegeCertificate(certificateName, studentAddress).send({ from: account });
            alert("✅ Certificate added successfully!");
            setCertificateName("");
            setStudentAddress("");
        } catch (error) {
            console.error("🔴 Error:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Upload File to Pinata IPFS
    const uploadToIPFS = async () => {
        if (!selectedFile) return alert("❌ Please select a file first!");

        const formData = new FormData();
        formData.append("file", selectedFile);

        const metadata = JSON.stringify({
            name: selectedFile.name,
            keyvalues: { owner: account }
        });
        formData.append("pinataMetadata", metadata);

        const options = JSON.stringify({
            cidVersion: 1
        });
        formData.append("pinataOptions", options);

        try {
            setLoading(true);

            // Ensure API keys are defined
            const API_KEY ="47bd44641506f1853cd9";
            const SECRET_KEY = " ede7f36ff4b7a93b31f7ab139f321472aabf3fe2541d8ab8f8bb3661cb3f7867";

            if (!API_KEY || !SECRET_KEY) {
                throw new Error("Pinata API keys are missing! Check your .env file.");
            }

            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    pinata_api_key: API_KEY,
                    pinata_secret_api_key: SECRET_KEY,
                    "Content-Type": "multipart/form-data"
                }
            });

            const ipfsHash = response.data.IpfsHash;
            setFileHash(ipfsHash);
            alert(`✅ File uploaded successfully! IPFS Hash: ${ipfsHash}`);
            console.log("📌 IPFS Hash:", ipfsHash);
        } catch (error) {
            console.error("🔴 Error uploading to IPFS:", error.response ? error.response.data : error.message);
            alert("Error: " + (error.response ? JSON.stringify(error.response.data) : error.message));
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
                <input type="text" placeholder="Student Address" value={studentAddress} onChange={(e) => setStudentAddress(e.target.value)} />
                <input type="text" placeholder="College Address" value={collegeAddress} onChange={(e) => setCollegeAddress(e.target.value)} />
                <button onClick={addStudentToCollege} disabled={loading}>{loading ? "Adding..." : "➕ Add Student"}</button>
            </div>

            {/* Add Certificate for Student Section */}
            <div className="input-group">
                <h3>📜 Add Certificate for Student</h3>
                <input type="text" placeholder="Student Address" value={studentAddress} onChange={(e) => setStudentAddress(e.target.value)} />
                <input type="text" placeholder="Certificate Name" value={certificateName} onChange={(e) => setCertificateName(e.target.value)} />
                <button onClick={addCollegeCertificate} disabled={loading}>{loading ? "Adding..." : "➕ Add Certificate"}</button>
            </div>

            {/* Upload File to IPFS */}
            <div className="input-group">
                <h3>📤 Upload File to IPFS</h3>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button onClick={uploadToIPFS} disabled={loading}>{loading ? "Uploading..." : "📤 Upload File"}</button>
                {fileHash && <p>📌 IPFS Hash: {fileHash}</p>}
            </div>
        </div>
    );
};

export default College;
