import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json"; // Ensure correct path

const contractAddress = "0x86ab9f453215774E50FcE92d1fe3e30Bb0B123E9"; // Replace with actual contract address

const Student = ({ account }) => {
    const [contract, setContract] = useState(null);

    // Separate state variables for each section
    const [addCertificateHash, setAddCertificateHash] = useState("");
    const [addInstitutionAddress, setAddInstitutionAddress] = useState("");

    const [removeCertificateHash, setRemoveCertificateHash] = useState("");
    const [removeInstitutionAddress, setRemoveInstitutionAddress] = useState("");

    const [grantCertificateHash, setGrantCertificateHash] = useState("");
    const [grantInstitutionAddress, setGrantInstitutionAddress] = useState("");
    const [grantViewerAddress, setGrantViewerAddress] = useState("");

    const [checkCertificateHash, setCheckCertificateHash] = useState("");
    const [checkInstitutionAddress, setCheckInstitutionAddress] = useState("");
    const [checkViewerAddress, setCheckViewerAddress] = useState("");

    const [hasAccess, setHasAccess] = useState(null);

    // Separate loading states for each button
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);
    const [loadingGrant, setLoadingGrant] = useState(false);
    const [loadingCheck, setLoadingCheck] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const web3 = new Web3(window.ethereum);
                const deployedContract = new web3.eth.Contract(contractABI.abi, contractAddress);
                setContract(deployedContract);
            } catch (error) {
                console.error("Error loading contract:", error);
            }
        };

        loadBlockchainData();
    }, []);

    // Add Certificate
    const addCertificateForStudent = async () => {
        if (!contract) return alert("Contract not connected!");

        try {
            setLoadingAdd(true);
            await contract.methods.addCertificateForStudent(addCertificateHash, addInstitutionAddress).send({ from: account });
            alert("Certificate added successfully!");
            setAddCertificateHash("");
            setAddInstitutionAddress("");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoadingAdd(false);
        }
    };

    // Remove Certificate
    const removeCertificate = async () => {
        if (!contract) return alert("Contract not connected!");

        try {
            setLoadingRemove(true);
            await contract.methods.removeCertificate(removeInstitutionAddress, removeCertificateHash).send({ from: account });
            alert("Certificate removed successfully!");
            setRemoveCertificateHash("");
            setRemoveInstitutionAddress("");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoadingRemove(false);
        }
    };

    // Grant Certificate Access
    const grantCertificateAccess = async () => {
        if (!contract) return alert("Contract not connected!");

        try {
            setLoadingGrant(true);
            await contract.methods.grantCertificateAccess(grantViewerAddress, grantInstitutionAddress, grantCertificateHash).send({ from: account });
            alert("Access granted successfully!");
            setGrantViewerAddress("");
            setGrantInstitutionAddress("");
            setGrantCertificateHash("");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoadingGrant(false);
        }
    };

    // Check Certificate Access
    const checkCertificateAccess = async () => {
        if (!contract) return alert("Contract not connected!");

        try {
            setLoadingCheck(true);
            const result = await contract.methods.canViewCertificate(checkViewerAddress, checkInstitutionAddress, checkCertificateHash).call();
            setHasAccess(result);
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoadingCheck(false);
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
                    value={addCertificateHash}
                    onChange={(e) => setAddCertificateHash(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Institution Address"
                    value={addInstitutionAddress}
                    onChange={(e) => setAddInstitutionAddress(e.target.value)}
                />
                <button id="addCertificateButton" onClick={addCertificateForStudent} disabled={loadingAdd}>
                    {loadingAdd ? "Processing..." : "➕ Add Certificate"}
                </button>
            </div>

            {/* Remove Certificate Section */}
            <div className="input-group">
                <h3>🗑 Remove Certificate</h3>
                <input
                    type="text"
                    placeholder="Enter Certificate Hash"
                    value={removeCertificateHash}
                    onChange={(e) => setRemoveCertificateHash(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Institution Address"
                    value={removeInstitutionAddress}
                    onChange={(e) => setRemoveInstitutionAddress(e.target.value)}
                />
                <button id="removeCertificateButton" onClick={removeCertificate} disabled={loadingRemove}>
                    {loadingRemove ? "Processing..." : "🗑 Remove Certificate"}
                </button>
            </div>

            {/* Grant Certificate Access Section */}
            <div className="input-group">
                <h3>🔓 Grant Certificate Access</h3>
                <input
                    type="text"
                    placeholder="Enter Viewer Address"
                    value={grantViewerAddress}
                    onChange={(e) => setGrantViewerAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Institution Address"
                    value={grantInstitutionAddress}
                    onChange={(e) => setGrantInstitutionAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Certificate Hash"
                    value={grantCertificateHash}
                    onChange={(e) => setGrantCertificateHash(e.target.value)}
                />
                <button id="grantCertificateAccessButton" onClick={grantCertificateAccess} disabled={loadingGrant}>
                    {loadingGrant ? "Processing..." : "🔓 Grant Access"}
                </button>
            </div>

            {/* Check Certificate Access Section */}
            <div className="input-group">
                <h3>🔍 Check Certificate Access</h3>
                <input
                    type="text"
                    placeholder="Enter Viewer Address"
                    value={checkViewerAddress}
                    onChange={(e) => setCheckViewerAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Institution Address"
                    value={checkInstitutionAddress}
                    onChange={(e) => setCheckInstitutionAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Certificate Hash"
                    value={checkCertificateHash}
                    onChange={(e) => setCheckCertificateHash(e.target.value)}
                />
                <button id="checkCertificateAccessButton" onClick={checkCertificateAccess} disabled={loadingCheck}>
                    {loadingCheck ? "Checking..." : "🔍 Check Access"}
                </button>
                {hasAccess !== null && (
                    <p>🔹 Access Status: {hasAccess ? "✅ Granted" : "❌ Not Granted"}</p>
                )}
            </div>
        </div>
    );
};

export default Student;
