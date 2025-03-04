import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../Json/Digital_identity.json"; 



const College = ({ contractAddress }) => {
    const [studentAddress, setStudentAddress] = useState("");
    const [collegeAddress, setCollegeAddress] = useState("");
    const [certificateName, setCertificateName] = useState("");

    const addStudentToCollege = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.addStudentToCollege(studentAddress, collegeAddress);
            await tx.wait();
            alert("Student added to college successfully!");
            setStudentAddress("");
            setCollegeAddress("");
        } catch (error) {
            console.error(error);
            alert("Failed to add student to college");
        }
    };

    const addCollegeCertificate = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.addCollegeCertificate(certificateName, studentAddress);
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
            <h2>College Panel</h2>

            <div>
                <h3>Add Student to College</h3>
                <input
                    type="text"
                    placeholder="Enter Student Address"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter College Address"
                    value={collegeAddress}
                    onChange={(e) => setCollegeAddress(e.target.value)}
                />
                <button onClick={addStudentToCollege}>Add Student</button>
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
                <button onClick={addCollegeCertificate}>Add Certificate</button>
            </div>
        </div>
    );
};

export default College;
