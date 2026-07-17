import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg.text }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
  }

  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, width: 300, border: "1px solid #ccc", padding: 8 }}>
      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.role}:</b> {m.text}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Does X qualify?" style={{ width: "100%" }} />
    </div>
  );
}
