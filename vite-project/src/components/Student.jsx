import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json"; // Ensure correct path

const contractAddress = "0x1aeF3816F9676d3FE1e36f8eEd6bE839a2c362AD"; // Replace with actual contract address

const Student = () => {
    const [account, setAccount] = useState(null); // Ethereum account state
    const [contract, setContract] = useState(null); // Contract instance

    // State variables
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
    const [requests, setRequests] = useState([]);

    // Loading states
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);
    const [loadingGrant, setLoadingGrant] = useState(false);
    const [loadingCheck, setLoadingCheck] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request the accounts
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]); // Set the first account as the default
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
        if (!contract || !account) return alert("Contract or account not connected!");

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
        if (!contract || !account) return alert("Contract or account not connected!");

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
    const grantCertificateAccess = async (viewerAddress, institutionAddress) => {
        if (!contract || !account) return alert("Contract or account not connected!");

        try {
            setLoadingGrant(true);
            await contract.methods.grantCertificateAccess(viewerAddress, institutionAddress, grantCertificateHash).send({ from: account });
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

    // Remove Viewer from Request
    const removeViewerFromRequest = async (viewerAddress) => {
        if (!contract || !account) return alert("Contract or account not connected!");

        try {
            await contract.methods.removeViewerFromRequest(viewerAddress).send({ from: account });
            alert("Request rejected!");
            setRequests(requests.filter((request) => request.viewer !== viewerAddress)); // Remove from requests list
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    // Get Viewer Requests
    const getViewerRequests = async () => {
        if (!contract || !account) return alert("Contract or account not connected!");

        try {
            setLoadingRequests(true);
            const result = await contract.methods.getViewerRequests(account).call();
            setRequests(result);
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoadingRequests(false);
        }
    };

    // Check Certificate Access
    const checkCertificateAccess = async () => {
        if (!contract || !account) return alert("Contract or account not connected!");

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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div className="centered-div" style={{ backgroundColor: "purple", color: "white", borderRadius: "20px" }}>
                <h2 className="text-lg font-bold" style={{ color: "white" }}>🎓 Student Panel</h2>

                {/* Add Certificate Section */}
                <div className="input-group">
                    <h3>📜 Add Certificate</h3>
                    <input
                        type="text"
                        placeholder="Enter Certificate Hash"
                        value={addCertificateHash}
                        onChange={(e) => setAddCertificateHash(e.target.value)}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    />
                    <input
                        type="text"
                        placeholder="Enter Institution Address"
                        value={addInstitutionAddress}
                        onChange={(e) => setAddInstitutionAddress(e.target.value)}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    />
                    <button
                        onClick={addCertificateForStudent}
                        disabled={loadingAdd}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    >
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
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    />
                    <input
                        type="text"
                        placeholder="Enter Institution Address"
                        value={removeInstitutionAddress}
                        onChange={(e) => setRemoveInstitutionAddress(e.target.value)}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    />
                    <button
                        onClick={removeCertificate}
                        disabled={loadingRemove}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    >
                        {loadingRemove ? "Processing..." : "🗑 Remove Certificate"}
                    </button>
                </div>

                {/* View and Manage Requests from Companies */}
                <div className="input-group">
                    <h3>👥 View Requests from Companies</h3>
                    <button
                        onClick={getViewerRequests}
                        disabled={loadingRequests}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    >
                        {loadingRequests ? "Loading..." : "🔄 Get Requests"}
                    </button>
                    {requests.length > 0 && (
                        <div>
                            {requests.map((request) => (
                                <div key={request.viewer}>
                                    <p>📩 Request from: {request.viewer}</p>
                                    <button
                                        onClick={() => grantCertificateAccess(request.viewer, request.institution)}
                                        style={{ backgroundColor: "green", color: "white", border: "1px solid white", margin: "10px" }}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => removeViewerFromRequest(request.viewer)}
                                        style={{ backgroundColor: "red", color: "white", border: "1px solid white", margin: "10px" }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Check Certificate Access Section */}
                <div className="input-group">
                    <h3>🔍 Check Certificate Access</h3>
                    <input
                        type="text"
                        placeholder="Enter Viewer Address"
                        value={checkViewerAddress}
                        onChange={(e) => setCheckViewerAddress(e.target.value)}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    />
                    <input
                        type="text"
                        placeholder="Enter Institution Address"
                        value={checkInstitutionAddress}
                        onChange={(e) => setCheckInstitutionAddress(e.target.value)}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    />
                    <input
                        type="text"
                        placeholder="Enter Certificate Hash"
                        value={checkCertificateHash}
                        onChange={(e) => setCheckCertificateHash(e.target.value)}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    />
                    <button
                        onClick={checkCertificateAccess}
                        disabled={loadingCheck}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px" }}
                    >
                        {loadingCheck ? "Checking..." : "🔍 Check Access"}
                    </button>
                    {hasAccess !== null && (
                        <p style={{ color: hasAccess ? "green" : "red" }}>
                            🔹 Access Status: {hasAccess ? "✅ Granted" : "❌ Not Granted"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Student;
