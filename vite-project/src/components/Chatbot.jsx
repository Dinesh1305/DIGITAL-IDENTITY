import { useState } from "react";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });
            
            const data = await response.json();
            const botMessage = { text: data.reply, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2>Chatbot</h2>
            <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "5px 0" }}>
                        <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: "70%", padding: "5px" }}
            />
            <button onClick={handleSend} style={{ padding: "5px 10px", marginLeft: "10px" }}>Send</button>
        </div>
    );
};

export default Chatbot;
