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
            }
        };

        loadBlockchainData();
    }, []);

    // Add Student to College
    const addStudentToCollege = async () => {
        if (!contract) return alert("❌ Contract not connected!");
        if (!contract.methods?.addStudentToCollege) return alert("❌ Method not found!");

        try {
            setLoadingStudent(true);
            await contract.methods.addStudentToCollege(studentAddressCollege, collegeAddress).send({ from: account });
            alert("✅ Student added to college successfully!");
            setStudentAddressCollege("");
            setCollegeAddress("");
        } catch (error) {
            console.error("🔴 Error:", error);
            alert("Error: " + error.message);
        } finally {
            setLoadingStudent(false);
        }
    };

    // Add College Certificate
    const addCollegeCertificate = async () => {
        if (!contract) return alert("❌ Contract not connected!");
        if (!contract.methods?.addCollegeCertificate) return alert("❌ Method not found!");

        try {
            setLoadingCertificate(true);
            await contract.methods.addCollegeCertificate(certificateName, studentAddressCertificate).send({ from: account });
            alert("✅ Certificate added successfully!");
            setCertificateName("");
            setStudentAddressCertificate("");
        } catch (error) {
            console.error("🔴 Error:", error);
            alert("Error: " + error.message);
        } finally {
            setLoadingCertificate(false);
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
            setLoadingFile(true);

            const API_KEY = "47bd44641506f1853cd9";
            const SECRET_KEY = "ede7f36ff4b7a93b31f7ab139f321472aabf3fe2541d8ab8f8bb3661cb3f7867";

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
            setLoadingFile(false);
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
                    id="student-address-college"
                    placeholder="Student Address" 
                    value={studentAddressCollege} 
                    onChange={(e) => setStudentAddressCollege(e.target.value)} 
                />
                <input 
                    type="text" 
                    id="college-address"
                    placeholder="College Address" 
                    value={collegeAddress} 
                    onChange={(e) => setCollegeAddress(e.target.value)} 
                />
                <button 
                    id="add-student-btn" 
                    onClick={addStudentToCollege} 
                    disabled={loadingStudent}
                >
                    {loadingStudent ? "Adding..." : "➕ Add Student"}
                </button>
            </div>

            {/* Add Certificate for Student Section */}
            <div className="input-group">
                <h3>📜 Add Certificate for Student</h3>
                <input 
                    type="text" 
                    id="student-address-certificate"
                    placeholder="Student Address" 
                    value={studentAddressCertificate} 
                    onChange={(e) => setStudentAddressCertificate(e.target.value)} 
                />
                <input 
                    type="text" 
                    id="certificate-name"
                    placeholder="Certificate Name" 
                    value={certificateName} 
                    onChange={(e) => setCertificateName(e.target.value)} 
                />
                <button 
                    id="add-certificate-btn" 
                    onClick={addCollegeCertificate} 
                    disabled={loadingCertificate}
                >
                    {loadingCertificate ? "Adding..." : "➕ Add Certificate"}
                </button>
            </div>

            {/* Upload File to IPFS */}
            <div className="input-group">
                <h3>📤 Upload File to IPFS</h3>
                <input type="file" id="upload-file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button 
                    id="upload-file-btn" 
                    onClick={uploadToIPFS} 
                    disabled={loadingFile}
                >
                    {loadingFile ? "Uploading..." : "📤 Upload File"}
                </button>
                {fileHash && <p>📌 IPFS Hash: {fileHash}</p>}
            </div>
        </div>
    );
};

export default College;
