import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../Json/Digital_identity.json"; 



const Student = ({ contractAddress }) => {
    const [certificateHash, setCertificateHash] = useState("");
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [viewerAddress, setViewerAddress] = useState("");
    const [hasAccess, setHasAccess] = useState(null);

    const addCertificateForStudent = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.addCertificateForStudent(certificateHash, institutionAddress);
            await tx.wait();
            alert("Certificate added successfully!");
            setCertificateHash("");
            setInstitutionAddress("");
        } catch (error) {
            console.error(error);
            alert("Failed to add certificate");
        }
    };

    const removeCertificate = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.removeCertificate(institutionAddress, certificateHash);
            await tx.wait();
            alert("Certificate removed successfully!");
            setCertificateHash("");
            setInstitutionAddress("");
        } catch (error) {
            console.error(error);
            alert("Failed to remove certificate");
        }
    };

    const grantCertificateAccess = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.grantCertificateAccess(viewerAddress, institutionAddress, certificateHash);
            await tx.wait();
            alert("Access granted successfully!");
            setViewerAddress("");
            setInstitutionAddress("");
            setCertificateHash("");
        } catch (error) {
            console.error(error);
            alert("Failed to grant access");
        }
    };

    const checkCertificateAccess = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        try {
            const result = await contract.canViewCertificate(viewerAddress, institutionAddress, certificateHash);
            setHasAccess(result);
        } catch (error) {
            console.error(error);
            alert("Failed to check access");
        }
    };

    return (
        <div>
            <h2>Student Panel</h2>

            <div>
                <h3>Add Certificate</h3>
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
                <button onClick={addCertificateForStudent}>Add Certificate</button>
            </div>

            <div>
                <h3>Remove Certificate</h3>
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
                <button onClick={removeCertificate}>Remove Certificate</button>
            </div>

            <div>
                <h3>Grant Certificate Access</h3>
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
                <button onClick={grantCertificateAccess}>Grant Access</button>
            </div>

            <div>
                <h3>Check Certificate Access</h3>
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
                <button onClick={checkCertificateAccess}>Check Access</button>
                {hasAccess !== null && (
                    <p>Access Status: {hasAccess ? "Granted" : "Not Granted"}</p>
                )}
            </div>
        </div>
    );
};

export default Student;
