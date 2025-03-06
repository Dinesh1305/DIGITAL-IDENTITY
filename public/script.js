let isFetching = false; // Prevent multiple requests

async function sendMessage() {
    let userInput = document.getElementById("userInput").value.trim();
    let messagesDiv = document.getElementById("messages");

    if (!userInput || isFetching) return; // Prevent empty messages and multiple requests

    isFetching = true; // Lock sending while waiting for response

    // Display user message
    let userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.innerHTML = `<strong>You:</strong> ${userInput}`;
    messagesDiv.appendChild(userMessage);

    document.getElementById("userInput").value = ""; // Clear input
    document.getElementById("userInput").focus(); // Refocus input field

    // Display "typing" indicator
    let typingIndicator = document.createElement("div");
    typingIndicator.classList.add("bot-message", "typing");
    typingIndicator.innerHTML = `<strong>Bot:</strong> <em>Typing...</em>`;
    messagesDiv.appendChild(typingIndicator);

    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll

    try {
        let response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        let data = await response.json();
        let botResponse = data.reply || "Error: No response from AI.";

        // Remove "typing" indicator
        typingIndicator.remove();

        // Display bot response
        let botMessage = document.createElement("div");
        botMessage.classList.add("bot-message");
        botMessage.innerHTML = `<strong>Bot:</strong> ${botResponse}`;
        messagesDiv.appendChild(botMessage);

    } catch (error) {
        console.error("❌ Error fetching response:", error);
        typingIndicator.remove(); // Remove typing indicator if error occurs

        let errorMessage = document.createElement("div");
        errorMessage.classList.add("bot-message", "error");
        errorMessage.innerHTML = `<strong>Bot:</strong> ⚠️ Error fetching response. Please try again.`;
        messagesDiv.appendChild(errorMessage);
    }

    isFetching = false; // Unlock sending
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
}
