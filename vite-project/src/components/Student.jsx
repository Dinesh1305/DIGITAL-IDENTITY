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
    const [requests, setRequests] = useState([]);

    // Loading states
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [loadingGrant, setLoadingGrant] = useState(false);

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

    // Add Student Certificate
    const addStudentCertificate = async () => {
        if (!contract || !account) return alert("Contract or account not connected!");

        try {
            setLoadingAdd(true);
            await contract.methods.addStudentCertificate(addInstitutionAddress, addCertificateHash).send({ from: account });
            alert("Certificate added successfully!");
            setAddCertificateHash("");
            setAddInstitutionAddress("");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoadingAdd(false);
        }
    };

    // Remove Student Certificate
    const removeStudentCertificate = async () => {
        if (!contract || !account) return alert("Contract or account not connected!");

        try {
            setLoadingRemove(true);
            await contract.methods.removeStudentCertificate(removeCertificateHash).send({ from: account });
            alert("Certificate removed successfully!");
            setRemoveCertificateHash("");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoadingRemove(false);
        }
    };

    // Get Company Requests
    const getCompanyRequests = async () => {
        if (!contract || !account) return alert("Contract or account not connected!");

        try {
            setLoadingRequests(true);
            const result = await contract.methods.getCompanyRequests().call({ from: account });
            setRequests(result);
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoadingRequests(false);
        }
    };

    // Grant Certificate Access
    const grantCertificateAccess = async (viewerAddress, institutionAddress, certificateHash) => {
        if (!contract || !account) return alert("Contract or account not connected!");

        try {
            setLoadingGrant(true);
            await contract.methods.grantCertificateAccess(viewerAddress, institutionAddress, certificateHash).send({ from: account });
            alert("Access granted successfully!");
            // Remove the granted request from the list
            setRequests(requests.filter(request => request !== viewerAddress));
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
            await contract.methods.removeViewer(viewerAddress).send({ from: account });
            alert("Request rejected!");
            setRequests(requests.filter(request => request !== viewerAddress)); // Remove from requests list
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div className="centered-div" style={{ backgroundColor: "purple", color: "white", borderRadius: "20px", padding: "20px" }}>
                <h2 className="text-lg font-bold" style={{ color: "white" }}>🎓 Student Panel</h2>

                {/* Add Certificate Section */}
                <div className="input-group">
                    <h3>📜 Add Certificate</h3>
                    <input
                        type="text"
                        placeholder="Enter Institution Address"
                        value={addInstitutionAddress}
                        onChange={(e) => setAddInstitutionAddress(e.target.value)}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px", padding: "5px" }}
                    />
                    <input
                        type="text"
                        placeholder="Enter Certificate Hash"
                        value={addCertificateHash}
                        onChange={(e) => setAddCertificateHash(e.target.value)}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px", padding: "5px" }}
                    />
                    <button
                        onClick={addStudentCertificate}
                        disabled={loadingAdd}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px", padding: "5px" }}
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
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px", padding: "5px" }}
                    />
                    <button
                        onClick={removeStudentCertificate}
                        disabled={loadingRemove}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px", padding: "5px" }}
                    >
                        {loadingRemove ? "Processing..." : "🗑 Remove Certificate"}
                    </button>
                </div>

                {/* View and Manage Requests from Companies */}
                <div className="input-group">
                    <h3>👥 View Requests from Companies</h3>
                    <button
                        onClick={getCompanyRequests}
                        disabled={loadingRequests}
                        style={{ backgroundColor: "white", color: "purple", border: "1px solid white", margin: "10px", padding: "5px" }}
                    >
                        {loadingRequests ? "Loading..." : "🔄 Get Requests"}
                    </button>
                    {requests.length > 0 ? (
                        <div>
                            {requests.map((request, index) => (
                                <div key={index} style={{ margin: "10px 0" }}>
                                    <p>📩 Request from: {request}</p>
                                    <button
                                        onClick={() => grantCertificateAccess(request, addInstitutionAddress, addCertificateHash)}
                                        style={{ backgroundColor: "green", color: "white", border: "1px solid white", margin: "5px", padding: "5px" }}
                                    >
                                        Agree
                                    </button>
                                    <button
                                        onClick={() => removeViewerFromRequest(request)}
                                        style={{ backgroundColor: "red", color: "white", border: "1px solid white", margin: "5px", padding: "5px" }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No requests found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Student;