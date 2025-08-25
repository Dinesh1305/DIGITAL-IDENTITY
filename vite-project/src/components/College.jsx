import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json";

const contractAddress = "0x1aeF3816F9676d3FE1e36f8eEd6bE839a2c362AD"; // Replace with actual contract address

const College = () => {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null); // Add account state

    // Separate states for inputs
    const [studentAddressCollege, setStudentAddressCollege] = useState("");
    const [studentAddressCertificate, setStudentAddressCertificate] = useState("");
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
            console.log("🔵 Loading blockchain data...");
            try {
                if (!window.ethereum) {
                    alert("MetaMask is not installed. Please install it to continue.");
                    return;
                }

                // Request account access
                await window.ethereum.request({ method: "eth_requestAccounts" });

                // Initialize Web3
                const web3 = new Web3(window.ethereum);

                // Get the connected account
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]); // Set the first account as the default
                console.log("🟢 Connected Account:", accounts[0]);

                // Initialize the contract
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

    // Function to validate Ethereum addresses
    const isValidAddress = (address) => Web3.utils.isAddress(address);

    // Upload file to IPFS
    const uploadToIPFS = async () => {
        console.log("🔵 Uploading file to IPFS...");
        if (!selectedFile) return alert("❌ Please select a file first!");

        const formData = new FormData();
        formData.append("file", selectedFile);
        const metadata = JSON.stringify({ name: selectedFile.name, keyvalues: { owner: account } });
        formData.append("pinataMetadata", metadata);
        formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

        try {
            setLoadingFile(true);
            console.log("⏳ Sending file to Pinata...");
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    pinata_api_key: "47bd44641506f1853cd9",
                    pinata_secret_api_key: "ede7f36ff4b7a93b31f7ab139f321472aabf3fe2541d8ab8f8bb3661cb3f7867",
                    "Content-Type": "multipart/form-data"
                }
            });

            setFileHash(response.data.IpfsHash);
            console.log("✅ File uploaded! IPFS Hash:", response.data.IpfsHash);
            alert(`✅ File uploaded! IPFS Hash: ${response.data.IpfsHash}`);
        } catch (error) {
            console.error("🔴 Error uploading to IPFS:", error.response ? error.response.data : error.message);
            alert("Error: " + (error.response ? JSON.stringify(error.response.data) : error.message));
        } finally {
            setLoadingFile(false);
        }
    };

    // Add student to college
    const addStudentToCollege = async () => {
        console.log("🔵 Calling addStudentToCollege...");
        if (!studentAddressCollege) {
            return alert("❌ Please enter the student's Ethereum address!");
        }

        if (!isValidAddress(studentAddressCollege)) {
            return alert("❌ Invalid student Ethereum address!");
        }

        if (!contract || !account) {
            return alert("❌ Contract or account not initialized!");
        }

        setLoadingStudent(true);
        try {
            console.log("⏳ Sending transaction to addStudentToCollege...");
            console.log("Account:", account); // Debugging: Log the account address
            await contract.methods.addStudentToCollege(studentAddressCollege)
                .send({ from: account }); // Ensure `from` is set to the connected account

            console.log("✅ Student added to college successfully!");
            alert("✅ Student added to college successfully!");
        } catch (error) {
            console.error("🔴 Error adding student to college:", error);
            alert("Error adding student to college: " + error.message);
        } finally {
            setLoadingStudent(false);
        }
    };

    // Add certificate to the student
    const addCollegeCertificate = async () => {
        console.log("🔵 Calling addCollegeCertificate...");
    
        // Validate inputs
        if (!studentAddressCertificate || !certificateName) {
            return alert("❌ Please fill in all fields!");
        }
    
        // Validate student address
      
        // Validate certificate name (ensure it's a non-empty string)
  
        // Ensure contract and account are initialized
        if (!contract || !account) {
            return alert("❌ Contract or account not initialized!");
        }
    
        setLoadingCertificate(true);
        try {
            console.log("⏳ Sending transaction to addCollegeCertificate...");
            await contract.methods.addCollegeCertificate(
                studentAddressCertificate, // address
                certificateName   // string
            ).send({ from: account });
    
            console.log("✅ Certificate added successfully!");
            alert("✅ Certificate added successfully!");
        } catch (error) {
            console.error("🔴 Error adding certificate:", error);
            alert("Error adding certificate: " + error.message);
        } finally {
            setLoadingCertificate(false);
        }
    };
    return (
        <div className="college-wrapper">
            <div className="college-container">
                <h2 className="college-title">🏫 College Panel</h2>

                {/* Add Student to College Section */}
                <div className="college-section">
                    <h3 className="college-label">👨‍🎓 Add Student to College</h3>
                    <input type="text" placeholder="Student Address" value={studentAddressCollege} onChange={(e) => setStudentAddressCollege(e.target.value)} className="college-input" />
                    <button onClick={addStudentToCollege} className="college-button" disabled={loadingStudent}>
                        {loadingStudent ? "Adding Student..." : "➕ Add Student"}
                    </button>
                </div>

                {/* Add Certificate for Student Section */}
                <div className="college-section">
                    <h3 className="college-label">📜 Add Certificate for Student</h3>
                    <input type="text" placeholder="Student Address" value={studentAddressCertificate} onChange={(e) => setStudentAddressCertificate(e.target.value)} className="college-input" />
                    <input type="text" placeholder="Certificate Name" value={certificateName} onChange={(e) => setCertificateName(e.target.value)} className="college-input" />
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="college-input" />
                    <button onClick={uploadToIPFS} className="college-button" disabled={loadingFile}>
                        {loadingFile ? "Uploading..." : "Upload to IPFS"}
                    </button>
                    <button onClick={addCollegeCertificate} className="college-button" disabled={loadingCertificate}>
                        {loadingCertificate ? "Adding Certificate..." : "Add Certificate"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default College;