import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import contractABI from "../Json/Digital_identity.json";

const contractAddress = "0x1aeF3816F9676d3FE1e36f8eEd6bE839a2c362AD";

const GrantAccessPage = () => {
    const [searchParams] = useSearchParams();
    const viewer = searchParams.get("viewer"); // Extract viewer from URL
    const [institution, setInstitution] = useState("");
    const [certificateHash, setCertificateHash] = useState("");
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
                const deployedContract = new web3.eth.Contract(contractABI.abi, contractAddress);
                setContract(deployedContract);
            } catch (error) {
                console.error("Error loading contract:", error);
            }
        };
        loadBlockchainData();
    }, []);

    const grantAccess = async () => {
        if (!contract || !account || !viewer || !institution || !certificateHash) {
            return alert("All fields are required!");
        }

        try {
            await contract.methods.grantCertificateAccess(viewer, institution, certificateHash)
                .send({ from: account });

            alert("Access granted successfully!");
            navigate("/");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>🔑 Grant Certificate Access</h2>
            <p>Viewer (Company Address): {viewer}</p>
            
            <input
                type="text"
                placeholder="Enter Institution Address"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                style={{ margin: "10px", padding: "5px" }}
            />
            <input
                type="text"
                placeholder="Enter Certificate Hash"
                value={certificateHash}
                onChange={(e) => setCertificateHash(e.target.value)}
                style={{ margin: "10px", padding: "5px" }}
            />
            <br />
            <button onClick={grantAccess}>
                ✅ Submit
            </button>
        </div>
    );
};

export default GrantAccessPage;
