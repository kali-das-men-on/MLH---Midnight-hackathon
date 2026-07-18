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
          `Hello! I'm TrustVet AI.\n\n` +
          `I'm currently focused on ${subcontractorId}.\n\n` +
          `I can help explain:\n` +
          `• Whether the vendor qualifies\n` +
          `• Proof verification status\n` +
          `• Commitment hashes\n` +
          `• Verification timestamps\n\n` +
          `I cannot reveal private balances or financial thresholds.`,
      },
    ]);
  }, [subcontractorId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const question = input.trim();

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const result = await chat(subcontractorId, question);
      setMessages((prev) => [...prev, { role: "assistant", text: result.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "I couldn't reach the TrustVet backend. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "600px", border: "1px solid #ddd", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      <div style={{ padding: 16, borderBottom: "1px solid #ddd", background: "#f8fafc" }}>
        <h3 style={{ margin: 0 }}>TrustVet AI</h3>
        <small style={{ color: "#666" }}>Vendor: {subcontractorId}</small>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#fafafa" }}>
        {messages.map((message, index) => (
          <div key={index} style={{ display: "flex", justifyContent: message.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <div style={{ maxWidth: "75%", padding: "12px 14px", borderRadius: 10, whiteSpace: "pre-wrap", background: message.role === "user" ? "#2563eb" : "#ffffff", color: message.role === "user" ? "#fff" : "#111", border: message.role === "assistant" ? "1px solid #ddd" : "none" }}>
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "inline-block", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", background: "#fff" }}>
              TrustVet AI is thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 10, padding: 16, borderTop: "1px solid #ddd", background: "#fff" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this vendor..."
          style={{ flex: 1, padding: 12 }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ padding: "12px 18px", cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
}