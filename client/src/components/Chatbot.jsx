import { useState, useEffect, useRef, useContext } from "react";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaComments,
} from "react-icons/fa";
import { CartContext } from "../context/CartContext";

function Chatbot({ products = [] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 Ask me about products!" },
  ]);
  const [input, setInput] = useState("");

  const { addToCart } = useContext(CartContext);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     AI INTENT HANDLER 🔥
  ========================= */
  const handleAI = async (userText) => {
    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      let data = await res.json();

      // 🛡️ Safety
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return { sender: "bot", text: data };
        }
      }

      console.log("🤖 AI RESPONSE:", data);

      /* 🔥 ADD TO CART */
      if (data.intent === "add_to_cart") {
        const query = data.query?.toLowerCase() || "";

        const found = products.find((p) => {
          const title = p.title?.toLowerCase() || "";
          const description = p.description?.toLowerCase() || "";

          return title.includes(query) || description.includes(query);
        });

        if (found) {
          addToCart({
            id: found._id || found.id,
            title: found.title,
            price: found.price,
            image: found.image,
            quantity: 1,
          });

          return {
            sender: "bot",
            text: `${found.title} added to cart 🛒`,
          };
        }

        return { sender: "bot", text: "Product not found 😅" };
      }

      /* 🔥 SHOW PRODUCTS */
      if (data.intent === "show_products") {
        let filtered = [...products];
        const text = userText.toLowerCase();

        // 🔥 SMART MATCH
        if (data.query) {
          const words = data.query.toLowerCase().split(" ");

          filtered = filtered.filter((p) => {
            const title = p.title?.toLowerCase() || "";
            const category = p.category?.toLowerCase() || "";
            const description = p.description?.toLowerCase() || "";

            return words.some(
              (w) =>
                title.includes(w) ||
                category.includes(w) ||
                description.includes(w)
            );
          });
        }

        // 🔥 CHEAPEST LOGIC
        if (
          text.includes("cheap") ||
          text.includes("cheapest") ||
          text.includes("lowest")
        ) {
          filtered = filtered.sort((a, b) => a.price - b.price);
        }
        // 🔥 PRICE FILTER
        else if (data.price) {
          filtered = filtered.filter((p) => p.price <= data.price);
        }

        // 🔥 Fallback
        if (filtered.length === 0) {
          return {
            sender: "bot",
            text: "No match 😅 Showing best products 👇",
            type: "products",
            data: products.slice(0, 3),
          };
        }

        return {
          sender: "bot",
          text: "Here are some products 👇",
          type: "products",
          data: filtered.slice(0, 3),
        };
      }

      /* 🔥 NORMAL CHAT */
      if (data.intent === "normal_chat") {
        return { sender: "bot", text: data.reply };
      }

      return { sender: "bot", text: "I didn't understand 🤔" };
    } catch (err) {
      console.error(err);
      return { sender: "bot", text: "AI error" };
    }
  };

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    const userMessage = { sender: "user", text: userText };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    const ruleReply = getBotResponse(userText);

    if (ruleReply) {
      console.log("⚡ Rule-based response");
      setMessages((prev) => [...prev, ruleReply]);
      return;
    }

    console.log("🤖 AI CALLED");

    const botReply = await handleAI(userText);

    setMessages((prev) => [...prev, botReply]);
  };

  /* =========================
     RULE BASED (FIXED)
  ========================= */
  const getBotResponse = (query) => {
    const text = query.toLowerCase();

    // 🚫 DO NOT HANDLE ADD TO CART HERE
    if (text.includes("add") || text.includes("cart")) {
      return null;
    }

    // 🔥 CHEAPEST
    if (
      text.includes("cheap") ||
      text.includes("cheapest") ||
      text.includes("lowest")
    ) {
      const sorted = [...products].sort((a, b) => a.price - b.price);

      return sorted.length
        ? {
            sender: "bot",
            text: "Here are the cheapest products 💸",
            type: "products",
            data: sorted.slice(0, 3),
          }
        : { sender: "bot", text: "No products found." };
    }

    // 🔥 PRICE FILTER
    const match = text.match(/under\s?₹?(\d+)/);
    if (match) {
      const price = parseInt(match[1]);
      const filtered = products.filter((p) => p.price <= price);

      return filtered.length
        ? { sender: "bot", type: "products", data: filtered.slice(0, 3) }
        : { sender: "bot", text: "No products found." };
    }

    // 🔥 SMART SEARCH
    const words = text.split(" ");

    const found = products.filter((p) => {
      const title = p.title?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const description = p.description?.toLowerCase() || "";

      return words.some(
        (w) =>
          title.includes(w) ||
          category.includes(w) ||
          description.includes(w)
      );
    });

    if (found.length) {
      return {
        sender: "bot",
        type: "products",
        data: found.slice(0, 3),
      };
    }

    return null;
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        className="btn btn-primary rounded-circle position-fixed shadow"
        style={{
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          zIndex: 1000,
        }}
        onClick={() => setOpen(!open)}
      >
        <FaComments size={20} />
      </button>

      {open && (
        <div
          className="card position-fixed shadow-lg"
          style={{
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "450px",
            borderRadius: "12px",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* HEADER */}
          <div className="card-header bg-dark text-white d-flex justify-content-between">
            <span>
              <FaRobot /> Chat
            </span>
            <button
              className="btn btn-sm btn-light"
              onClick={() => setOpen(false)}
            >
              X
            </button>
          </div>

          {/* MESSAGES */}
          <div className="card-body overflow-auto d-flex flex-column p-2 bg-light">
            {messages.map((msg, i) => (
              <div
                key={`${msg.sender}-${i}`}
                className={`d-flex mb-2 ${
                  msg.sender === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <FaRobot className="me-2 mt-1 text-secondary" />
                )}

                <div
                  className={`p-2 rounded shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-white"
                  }`}
                  style={{
                    maxWidth: "75%",
                    fontSize: "14px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {msg.text && msg.text}

                  {msg.type === "products" && (
                    <div className="d-flex flex-column gap-2 mt-2">
                      {msg.data.map((p) => (
                        <div
                          key={p._id || p.id}
                          className="border rounded p-2 d-flex align-items-center gap-2"
                        >
                          <img
                            src={
                              p.image ||
                              "https://dummyimage.com/50x50/cccccc/000000&text=No+Img"
                            }
                            alt={p.title}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />

                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "bold" }}>
                              {p.title}
                            </div>
                            <div>₹{p.price}</div>
                          </div>

                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              addToCart({
                                id: p._id || p.id,
                                title: p.title,
                                price: p.price,
                                image: p.image,
                                quantity: 1,
                              });

                              setMessages((prev) => [
                                ...prev,
                                {
                                  sender: "bot",
                                  text: `${p.title} added to cart 🛒`,
                                },
                              ]);
                            }}
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <FaUser className="ms-2 mt-1 text-primary" />
                )}
              </div>
            ))}

            <div ref={bottomRef}></div>
          </div>

          {/* INPUT */}
          <div className="card-footer d-flex">
            <input
              className="form-control me-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="btn btn-success" onClick={handleSend}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;