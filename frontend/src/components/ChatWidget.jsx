import React, { useEffect, useRef, useState } from "react";
import { chat } from "../services/api";

export default function ChatWidget({ subcontractorId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text:
          `TrustVet AI initialized.\n\n` +
          `Current Vendor: ${subcontractorId}\n\n` +
          `I can answer questions about:\n` +
          `• Qualification status\n` +
          `• Proof verification\n` +
          `• Commitment hashes\n` +
          `• Submission timestamps\n\n` +
          `I cannot reveal balances, thresholds, witnesses, or any private financial information.`,
      },
    ]);
  }, [subcontractorId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const question = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await chat(
        subcontractorId,
        question
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            response?.response ??
            "No response received.",
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Unable to contact the TrustVet backend. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-container">

      <div className="chat-header">
        <h2
          style={{
            marginBottom: 8,
          }}
        >
          TrustVet AI
        </h2>

        <div
          style={{
            color: "#9fb3c8",
            fontSize: 14,
          }}
        >
          Vendor: <strong>{subcontractorId}</strong>
        </div>
      </div>

      <div className="chat-body">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user"
                ? "user"
                : "ai"
            }`}
          >
            {message.text}
          </div>
        ))}

        {loading && (
          <div className="message ai">
            TrustVet AI is analyzing proof metadata...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input">

        <input
          value={input}
          placeholder="Ask about this vendor..."
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button
          className="primary-btn"
          disabled={loading}
          onClick={sendMessage}
        >
          {loading ? "..." : "Send"}
        </button>

      </div>

      <div
        style={{
          padding: "12px 18px",
          borderTop: "1px solid #2b4965",
          fontSize: 12,
          color: "#9fb3c8",
          background: "#0b1624",
        }}
      >
        🔒 TrustVet AI only receives proof metadata (pass/fail,
        commitment hash, timestamp). It never accesses balances,
        thresholds, or any confidential financial information.
      </div>

    </div>
  );
}