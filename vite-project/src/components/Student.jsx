import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json"; // Ensure correct path

const contractAddress = "0x86ab9f453215774E50FcE92d1fe3e30Bb0B123E9"; // Replace with actual contract address

const Student = ({ account }) => {
    const [contract, setContract] = useState(null);
    const [certificateHash, setCertificateHash] = useState("");
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [viewerAddress, setViewerAddress] = useState("");
    const [hasAccess, setHasAccess] = useState(null);
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

    // Add Certificate for Student
    const addCertificateForStudent = async () => {
        if (!contract) {
            alert("❌ Contract not connected!");
            return;
        }
        if (!contract.methods?.addCertificateForStudent) {
            alert("❌ addCertificateForStudent method not found!");
            return;
        }

        try {
            console.log("📌 Adding certificate:", certificateHash);
            setLoading(true);
            await contract.methods.addCertificateForStudent(certificateHash, institutionAddress).send({ from: account });
            alert("✅ Certificate added successfully!");
            setCertificateHash("");
            setInstitutionAddress("");
        } catch (error) {
            console.error("🔴 Error adding certificate:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Remove Certificate
    const removeCertificate = async () => {
        if (!contract) {
            alert("❌ Contract not connected!");
            return;
        }
        if (!contract.methods?.removeCertificate) {
            alert("❌ removeCertificate method not found!");
            return;
        }

        try {
            console.log("📌 Removing certificate:", certificateHash);
            setLoading(true);
            await contract.methods.removeCertificate(institutionAddress, certificateHash).send({ from: account });
            alert("✅ Certificate removed successfully!");
            setCertificateHash("");
            setInstitutionAddress("");
        } catch (error) {
            console.error("🔴 Error removing certificate:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Grant Certificate Access
    const grantCertificateAccess = async () => {
        if (!contract) {
            alert("❌ Contract not connected!");
            return;
        }
        if (!contract.methods?.grantCertificateAccess) {
            alert("❌ grantCertificateAccess method not found!");
            return;
        }

        try {
            console.log("📌 Granting access to:", viewerAddress);
            setLoading(true);
            await contract.methods.grantCertificateAccess(viewerAddress, institutionAddress, certificateHash).send({ from: account });
            alert("✅ Access granted successfully!");
            setViewerAddress("");
            setInstitutionAddress("");
            setCertificateHash("");
        } catch (error) {
            console.error("🔴 Error granting access:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Check Certificate Access
    const checkCertificateAccess = async () => {
        if (!contract) {
            alert("❌ Contract not connected!");
            return;
        }
        if (!contract.methods?.canViewCertificate) {
            alert("❌ canViewCertificate method not found!");
            return;
        }

        try {
            console.log("📌 Checking access for:", viewerAddress);
            setLoading(true);
            const result = await contract.methods.canViewCertificate(viewerAddress, institutionAddress, certificateHash).call();
            setHasAccess(result);
        } catch (error) {
            console.error("🔴 Error checking access:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">🎓 Student Panel</h2>

            {/* Add Certificate Section */}
            <div className="input-group">
                <h3>📜 Add Certificate</h3>
                <input
                    type="text"
                    placeholder="Enter Certificate Hash"
                    value={certificateHash}
                    onChange={(e) => setCertificateHash(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Institution Address"
                    value={institutionAddress}
                    onChange={(e) => setInstitutionAddress(e.target.value)}
                />
                <button onClick={addCertificateForStudent} disabled={loading}>
                    {loading ? "Processing..." : "➕ Add Certificate"}
                </button>
            </div>

            {/* Remove Certificate Section */}
            <div className="input-group">
                <h3>🗑 Remove Certificate</h3>
                <input
                    type="text"
                    placeholder="Enter Certificate Hash"
                    value={certificateHash}
                    onChange={(e) => setCertificateHash(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Institution Address"
                    value={institutionAddress}
                    onChange={(e) => setInstitutionAddress(e.target.value)}
                />
                <button onClick={removeCertificate} disabled={loading}>
                    {loading ? "Processing..." : "🗑 Remove Certificate"}
                </button>
            </div>

            {/* Grant Certificate Access Section */}
            <div className="input-group">
                <h3>🔓 Grant Certificate Access</h3>
                <input
                    type="text"
                    placeholder="Enter Viewer Address"
                    value={viewerAddress}
                    onChange={(e) => setViewerAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Institution Address"
                    value={institutionAddress}
                    onChange={(e) => setInstitutionAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Certificate Hash"
                    value={certificateHash}
                    onChange={(e) => setCertificateHash(e.target.value)}
                />
                <button onClick={grantCertificateAccess} disabled={loading}>
                    {loading ? "Processing..." : "🔓 Grant Access"}
                </button>
            </div>

            {/* Check Certificate Access Section */}
            <div className="input-group">
                <h3>🔍 Check Certificate Access</h3>
                <input
                    type="text"
                    placeholder="Enter Viewer Address"
                    value={viewerAddress}
                    onChange={(e) => setViewerAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Institution Address"
                    value={institutionAddress}
                    onChange={(e) => setInstitutionAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Certificate Hash"
                    value={certificateHash}
                    onChange={(e) => setCertificateHash(e.target.value)}
                />
                <button onClick={checkCertificateAccess} disabled={loading}>
                    {loading ? "Checking..." : "🔍 Check Access"}
                </button>
                {hasAccess !== null && (
                    <p>🔹 Access Status: {hasAccess ? "✅ Granted" : "❌ Not Granted"}</p>
                )}
            </div>
        </div>
    );
};

export default Student;
