import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json";

const contractAddress = "0x1aeF3816F9676d3FE1e36f8eEd6bE839a2c362AD"; // Replace with actual contract address

const Company = ({ account }) => {
    const [contract, setContract] = useState(null);
    const [studentAddress, setStudentAddress] = useState("");
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [certificateHash, setCertificateHash] = useState("");
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const web3 = new Web3(window.ethereum);
                const deployedContract = new web3.eth.Contract(contractABI.abi, contractAddress);
                setContract(deployedContract);
            } catch (error) {
                console.error("🔴 Error loading contract:", error);
            }
        };
        loadBlockchainData();
    }, []);

    const checkCertificateAccess = async () => {
        if (!contract) return alert("❌ Contract not connected!");
        if (!contract.methods?.canViewCertificate) return alert("❌ Method not found!");

        try {
            const access = await contract.methods
                .canViewCertificate(studentAddress, institutionAddress, certificateHash)
                .call({ from: account });

            setHasAccess(access);
            if (access) {
                alert("✅ You have access to view this certificate!");
            } else {
                alert("❌ You do not have access to view this certificate!");
            }
        } catch (error) {
            console.error("🔴 Error checking access:", error);
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">🏢 Company Panel</h2>

            <div className="input-group">
                <h3>🔍 Check Certificate Access</h3>
                <input type="text" placeholder="Enter Student Address" value={studentAddress} onChange={(e) => setStudentAddress(e.target.value)} />
                <input type="text" placeholder="Enter Institution Address" value={institutionAddress} onChange={(e) => setInstitutionAddress(e.target.value)} />
                <input type="text" placeholder="Enter Certificate Hash" value={certificateHash} onChange={(e) => setCertificateHash(e.target.value)} />
                <button onClick={checkCertificateAccess}>🔍 Check Access</button>
            </div>

            {hasAccess && certificateHash && (
                <div>
                    <h3>📜 Certificate Preview</h3>
                    <img 
                        src={`https://gateway.pinata.cloud/ipfs/${certificateHash}`} 
                        alt="Certificate" 
                        onError={(e) => { e.target.src = "/default-certificate.png"; }} 
                        style={{ width: "100%", maxWidth: "500px", border: "2px solid white", borderRadius: "8px" }} 
                    />
                </div>
            )}
        </div>
    );
};

export default Company;