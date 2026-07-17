import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function SubmitForm() {
  const [vendorId, setVendorId] = useState("");
  const [balance, setBalance] = useState("");
  const [threshold, setThreshold] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorId,
        balance: Number(balance),
        threshold: Number(threshold),
      }),
    });
    setResult(await res.json());
  }

  return (
    <div style={{ padding: 16, maxWidth: 400 }}>
      <h2>Submit Vetting Proof</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input placeholder="Vendor ID" value={vendorId} onChange={(e) => setVendorId(e.target.value)} />
        <input placeholder="Balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
        <input placeholder="Threshold" type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
