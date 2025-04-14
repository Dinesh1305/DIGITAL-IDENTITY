import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json";

const contractAddress = "0x86ab9f453215774E50FcE92d1fe3e30Bb0B123E9"; // Replace with actual contract address

const College = ({ account }) => {
    const [contract, setContract] = useState(null);
    const [studentAddressCollege, setStudentAddressCollege] = useState("");
    const [studentAddressCertificate, setStudentAddressCertificate] = useState("");
    const [collegeAddress, setCollegeAddress] = useState("");
    const [certificateName, setCertificateName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileHash, setFileHash] = useState("");
    const [loadingStudent, setLoadingStudent] = useState(false);
    const [loadingCertificate, setLoadingCertificate] = useState(false);
    const [loadingFile, setLoadingFile] = useState(false);

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

    const addStudentToCollege = async () => {
        if (!contract) return alert("❌ Contract not connected!");
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

    const addCollegeCertificate = async () => {
        if (!contract) return alert("❌ Contract not connected!");
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

    const uploadToIPFS = async () => {
        if (!selectedFile) return alert("❌ Please select a file first!");
        const formData = new FormData();
        formData.append("file", selectedFile);
        const metadata = JSON.stringify({ name: selectedFile.name, keyvalues: { owner: account } });
        formData.append("pinataMetadata", metadata);
        formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
        try {
            setLoadingFile(true);
            const API_KEY = "47bd44641506f1853cd9";
            const SECRET_KEY = "ede7f36ff4b7a93b31f7ab139f321472aabf3fe2541d8ab8f8bb3661cb3f7867";
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
        <div className="college-wrapper">
            <div className="college-container">
                <h2 className="college-title">🏫 College Panel</h2>
                <div className="college-section">
                    <h3 className="college-label">👨‍🎓 Add Student to College</h3>
                    <input type="text" placeholder="Student Address" value={studentAddressCollege} onChange={(e) => setStudentAddressCollege(e.target.value)} className="college-input" />
                    <input type="text" placeholder="College Address" value={collegeAddress} onChange={(e) => setCollegeAddress(e.target.value)} className="college-input" />
                    <button onClick={addStudentToCollege} className="college-button" disabled={loadingStudent}>{loadingStudent ? "Adding..." : "➕ Add Student"}</button>
                </div>
                <div className="college-section">
                    <h3 className="college-label">📜 Add Certificate for Student</h3>
                    <input type="text" placeholder="Student Address" value={studentAddressCertificate} onChange={(e) => setStudentAddressCertificate(e.target.value)} className="college-input" />
                    <input type="text" placeholder="Certificate Name" value={certificateName} onChange={(e) => setCertificateName(e.target.value)} className="college-input" />
                    <button onClick={addCollegeCertificate} className="college-button" disabled={loadingCertificate}>{loadingCertificate ? "Adding..." : "➕ Add Certificate"}</button>
                </div>
                <div className="college-section">
                    <h3 className="college-label">📤 Upload File to IPFS</h3>
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="college-input" />
                    <button onClick={uploadToIPFS} className="college-button" disabled={loadingFile}>{loadingFile ? "Uploading..." : "📤 Upload File"}</button>
                    {fileHash && <p>📌 IPFS Hash: {fileHash}</p>}
                </div>
            </div>
        </div>
    );
};

export default College;
