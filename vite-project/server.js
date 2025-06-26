const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { ethers } = require("ethers");
const contractABI = require("./contractABI.json"); // ABI of Digital_identity.sol
require("dotenv").config();

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

// Blockchain Setup
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Chatbot API Route
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ reply: "Message cannot be empty." });
    }

    try {
        if (userMessage.includes("verify certificate")) {
            const [_, student, hash] = userMessage.split(" ");
            const isValid = await contract.student_certificate(student, contractAddress, hash);
            return res.json({ reply: isValid ? "Certificate is valid." : "Certificate is invalid." });
        }

        const ollamaResponse = await axios.post(
            "http://localhost:11434/api/generate",
            { model: "llama3", prompt: userMessage }
        );

        res.json({ reply: ollamaResponse.data.reply || "I didn't understand that." });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ reply: "An error occurred." });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
