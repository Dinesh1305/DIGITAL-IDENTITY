import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../Json/Digital_identity.json"; 



const OnlinePlatform = ({ contractAddress }) => {
    const [studentAddress, setStudentAddress] = useState("");
    const [platformAddress, setPlatformAddress] = useState("");
    const [certificateName, setCertificateName] = useState("");

    const addStudentToPlatform = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.addStudentToOnlinePlatform(studentAddress, platformAddress);
            await tx.wait();
            alert("Student added to online platform successfully!");
            setStudentAddress("");
            setPlatformAddress("");
        } catch (error) {
            console.error(error);
            alert("Failed to add student to online platform");
        }
    };

    const addCertificate = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.addCertificate(certificateName, studentAddress);
            await tx.wait();
            alert("Certificate added successfully!");
            setCertificateName("");
            setStudentAddress("");
        } catch (error) {
            console.error(error);
            alert("Failed to add certificate");
        }
    };

    return (
        <div>
            <h2>Online Platform Panel</h2>

            <div>
                <h3>Add Student to Online Platform</h3>
                <input
                    type="text"
                    placeholder="Enter Student Address"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Platform Address"
                    value={platformAddress}
                    onChange={(e) => setPlatformAddress(e.target.value)}
                />
                <button onClick={addStudentToPlatform}>Add Student</button>
            </div>

            <div>
                <h3>Add Certificate for Student</h3>
                <input
                    type="text"
                    placeholder="Enter Student Address"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Certificate Name"
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                />
                <button onClick={addCertificate}>Add Certificate</button>
            </div>
        </div>
    );
};

export default OnlinePlatform;
