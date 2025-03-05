import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json";

const contractAddress = "0x86ab9f453215774E50FcE92d1fe3e30Bb0B123E9"; // Replace with actual contract address

const OnlinePlatform = ({ account }) => {
    const [contract, setContract] = useState(null);
    const [studentAddress, setStudentAddress] = useState("");
    const [platformAddress, setPlatformAddress] = useState("");
    const [certificateName, setCertificateName] = useState("");
    const [certificateStudentAddress, setCertificateStudentAddress] = useState("");
    const [loading, setLoading] = useState({ student: false, certificate: false, upload: false });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileHash, setFileHash] = useState("");

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

    const handleTransaction = async (method, args, type) => {
        if (!contract) return alert("❌ Contract not connected!");
        if (!contract.methods?.[method]) return alert("❌ Method not found!");

        try {
            setLoading(prev => ({ ...prev, [type]: true }));
            await contract.methods[method](...args).send({ from: account });
            alert(`✅ ${type} completed successfully!`);
        } catch (error) {
            console.error("🔴 Error:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    const uploadToIPFS = async () => {
        if (!selectedFile) return alert("❌ Please select a file first!");
        const formData = new FormData();
        formData.append("file", selectedFile);
        const metadata = JSON.stringify({ name: selectedFile.name, keyvalues: { owner: account } });
        formData.append("pinataMetadata", metadata);
        formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

        try {
            setLoading(prev => ({ ...prev, upload: true }));
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                    pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
                    "Content-Type": "multipart/form-data"
                }
            });

            setFileHash(response.data.IpfsHash);
            alert(`✅ File uploaded! IPFS Hash: ${response.data.IpfsHash}`);
        } catch (error) {
            console.error("🔴 Error uploading to IPFS:", error.response ? error.response.data : error.message);
            alert("Error: " + (error.response ? JSON.stringify(error.response.data) : error.message));
        } finally {
            setLoading(prev => ({ ...prev, upload: false }));
        }
    };

    return (
        <div>
             <div className="w-full text-center mt-4">
                <h2 className="text-3xl font-bold text-purple-700">🌐 Online Platform Panel</h2>
            </div>
        <div className="p-4 flex flex-wrap items-center justify-center bg-white text-purple-100 rounded-lg shadow-lg onlineContainer">
          


            <div className="inline-block bg-white p-4 rounded-md shadow-md m-4 w-96 text-center onlineCard">
                <h3 className="font-bold text-lg text-purple-700">👨‍🎓 Add Student to Online Platform</h3>
                <input className="w-full p-2 my-2 text-purple-700 border rounded-md overflow-hidden" type="text" placeholder="Student Address" value={studentAddress} onChange={e => setStudentAddress(e.target.value)} />
                <input className="w-full p-2 my-2 text-purple-700 border rounded-md overflow-hidden" type="text" placeholder="Platform Address" value={platformAddress} onChange={e => setPlatformAddress(e.target.value)} />
                <button className="bg-purple-500 text-white font-bold py-2 px-4 rounded-md mt-2 hover:bg-purple-600" onClick={() => handleTransaction("addStudentToOnlinePlatform", [studentAddress, platformAddress], "student")} disabled={loading.student}>
                    {loading.student ? "Adding..." : "➕ Add Student"}
                </button>
            </div>

            <div className="inline-block bg-white p-4 rounded-md shadow-md m-4 w-96 text-center onlineCard">
                <h3 className="font-bold text-lg text-purple-700">📜 Add Certificate for Student</h3>
                <input className="w-full p-2 my-2 text-purple-700 border rounded-md overflow-hidden" type="text" placeholder="Student Address" value={certificateStudentAddress} onChange={e => setCertificateStudentAddress(e.target.value)} />
                <input className="w-full p-2 my-2 text-purple-700 border rounded-md overflow-hidden" type="text" placeholder="Certificate Name" value={certificateName} onChange={e => setCertificateName(e.target.value)} />
                <button className="bg-purple-500 text-white font-bold py-2 px-4 rounded-md mt-2 hover:bg-purple-600" onClick={() => handleTransaction("addCertificate", [certificateName, certificateStudentAddress], "certificate")} disabled={loading.certificate}>
                    {loading.certificate ? "Adding..." : "➕ Add Certificate"}
                </button>
            </div>

            <div className="inline-block bg-white p-4 rounded-md shadow-md m-4 w-96 text-center onlineCard">
                <h3 className="font-bold text-lg text-purple-700">📤 Upload File to IPFS</h3>
                <input className="w-full p-2 my-2 text-purple-700 border rounded-md" type="file" onChange={e => setSelectedFile(e.target.files[0])} />
                <button className="bg-purple-500 text-white font-bold py-2 px-4 rounded-md mt-2 hover:bg-purple-600" onClick={uploadToIPFS} disabled={loading.upload}>
                    {loading.upload ? "Uploading..." : "📤 Upload File"}
                </button>
                {fileHash && <p className="text-purple-700 font-bold mt-2">📌 IPFS Hash: {fileHash}</p>}
            </div>
        </div>
        </div>
    );
};

export default OnlinePlatform;
