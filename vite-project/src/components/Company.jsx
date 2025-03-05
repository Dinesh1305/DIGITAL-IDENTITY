import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json";

const contractAddress = "0x1aeF3816F9676d3FE1e36f8eEd6bE839a2c362AD"; // Replace with actual contract address

const Company = () => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [studentAddress, setStudentAddress] = useState("");
    const [certificateHash, setCertificateHash] = useState("");
    const [studentCertificates, setStudentCertificates] = useState([]);
    const [loadingCertificates, setLoadingCertificates] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                // Check if Ethereum provider is available
                if (window.ethereum) {
                    const web3 = new Web3(window.ethereum);
                    const accounts = await web3.eth.requestAccounts();
                    if (accounts.length === 0) {
                        alert("Please connect your wallet to continue.");
                    } else {
                        setAccount(accounts[0]);
                    }
                    const deployedContract = new web3.eth.Contract(contractABI.abi, contractAddress);
                    setContract(deployedContract);
                } else {
                    alert("Ethereum wallet is not installed. Please install MetaMask.");
                }
            } catch (error) {
                console.error("🔴 Error loading contract:", error);
            }
        };

        loadBlockchainData();
    }, []);

    // Function to request certificate access from the student
    const requestCertificateAccess = async () => {
        if (!contract) return alert("❌ Contract not connected!");
        if (!account) return alert("❌ Wallet account is not connected!");

        try {
            await contract.methods.requestCertificateAccess(studentAddress).send({ from: account });
            alert("📩 Request sent to the student for certificate access!");
        } catch (error) {
            console.error("🔴 Error sending request:", error);
            alert("Error: " + error.message);
        }
    };

    // Function to get student's certificates (for the company to view)
    const getStudentCertificates = async () => {
        if (!contract) return alert("❌ Contract not connected!");
        if (!account) return alert("❌ Wallet account is not connected!");

        setLoadingCertificates(true);
        try {
            const certificates = await contract.methods
                .getStudentCertificatesForCompany(studentAddress)
                .call({ from: account });

            setStudentCertificates(certificates);
            if (certificates.length === 0) {
                alert("No certificates available for this student.");
            }
        } catch (error) {
            console.error("🔴 Error retrieving certificates:", error);
            alert("Error: " + error.message);
        } finally {
            setLoadingCertificates(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">🏢 Company Panel</h2>

            {/* Request Certificate Access */}
            <div className="input-group">
                <h3>📩 Request Certificate Access</h3>
                <input
                    type="text"
                    placeholder="Enter Student Address"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                />
                <button onClick={requestCertificateAccess}>Request Access</button>
            </div>

            {/* Get Student's Certificates */}
            <div className="input-group">
                <h3>📜 View Student's Certificates</h3>
                <button onClick={getStudentCertificates} disabled={loadingCertificates}>
                    {loadingCertificates ? "Loading..." : "Get Certificates"}
                </button>
                <div>
                    {studentCertificates.length > 0 && (
                        <div>
                            <h4>Certificates:</h4>
                            {studentCertificates.map((certificate, index) => (
                                <div key={index}>
                                    <a
                                        href={`https://gateway.pinata.cloud/ipfs/${certificate}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Certificate {index + 1}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;
