import React, { useState } from "react";
import { chat } from "../services/api";

type Message = { role: "user" | "assistant"; text: string };

export default function ChatWidget({ subcontractorId }: { subcontractorId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const { response } = await chat(subcontractorId, userMsg.text);
      setMessages((m) => [...m, { role: "assistant", text: response }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12 }}>
      <h3>Vetting Assistant — {subcontractorId}</h3>
      <div style={{ height: 220, overflowY: "auto", background: "#f9f9f9", padding: 8, borderRadius: 4 }}>
        {messages.map((m, i) => (
          <p key={i} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
            <b>{m.role}:</b> {m.text}
          </p>
        ))}
        {loading && <p style={{ color: "#999" }}>Thinking...</p>}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Does this vendor qualify?"
        />
        <button onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
