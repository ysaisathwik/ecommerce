import { IoChatbubbleEllipses, IoClose } from "react-icons/io5";
import { useState } from "react";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

function Chatbot() {
  const [open, setOpen] = useState(false); // start closed
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };

    let botReply = "Sorry, I didn't understand.";

    if (input.toLowerCase().includes("laptop")) {
      botReply = "We have great laptops! Check products section.";
    } else if (input.toLowerCase().includes("price")) {
      botReply = "Prices are listed on each product.";
    } else if (input.toLowerCase().includes("cart")) {
      botReply = "You can view your cart from the navbar.";
    }

    const botMessage = { text: botReply, sender: "bot" };

    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  // 🔥 When closed → show floating icon
  if (!open) {
    return (
      <IoChatbubbleEllipses
        size={55}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          cursor: "pointer",
          color: "#007bff",
          background: "white",
          borderRadius: "50%",
          padding: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
        }}
        onClick={() => setOpen(true)}
      />
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "320px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        padding: "10px"
      }}
    >
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <FaRobot />
          <strong>AI Assistant</strong>
        </div>

        {/* ❌ Close Button */}
        <IoClose
          size={22}
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(false)}
        />
      </div>

      {/* Messages */}
      <div style={{ height: "220px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className="d-flex align-items-center mb-2"
            style={{
              justifyContent:
                msg.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            {msg.sender === "bot" && (
              <FaRobot className="me-2 text-secondary" />
            )}

            <span
              style={{
                background:
                  msg.sender === "user" ? "#007bff" : "#f1f1f1",
                color: msg.sender === "user" ? "white" : "black",
                padding: "6px 10px",
                borderRadius: "10px",
                maxWidth: "70%"
              }}
            >
              {msg.text}
            </span>

            {msg.sender === "user" && (
              <FaUser className="ms-2 text-primary" />
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="d-flex mt-2">
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()} // 🔥 Enter key support
        />

        <button
          className="btn btn-primary ms-2"
          onClick={handleSend}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default Chatbot;