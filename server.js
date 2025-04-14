const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // ✅ Serve static files

// Chat API Route
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Message cannot be empty." });
    }

    try {
        console.log(`🔹 Received message: ${userMessage}`);

        // Call Ollama API with stream handling
        const ollamaResponse = await axios.post(
            "http://localhost:11434/api/generate",
            { model: "llama3", prompt: userMessage },
            { responseType: "stream" } // ✅ Fix: Handle NDJSON streaming
        );

        let botReply = "";
        for await (const chunk of ollamaResponse.data) {
            const jsonData = JSON.parse(chunk.toString()); // ✅ Convert NDJSON chunk to JSON
            if (jsonData.response) botReply += jsonData.response;
        }

        console.log(`🔹 Bot reply: ${botReply}`);
        res.json({ reply: botReply });
    } catch (error) {
        console.error("❌ Error communicating with Ollama:", error.message);
        res.status(500).json({ reply: "Error fetching response from AI." });
    }
});

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
