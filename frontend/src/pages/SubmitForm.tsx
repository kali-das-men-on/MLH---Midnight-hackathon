import React, { useState, FormEvent } from "react";
import { submitProof, Proof } from "../services/api";

export default function SubmitForm() {
  const [subcontractorId, setSubcontractorId] = useState("");
  const [privateBalance, setPrivateBalance] = useState("");
  const [minimumThreshold, setMinimumThreshold] = useState("250000");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Proof | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await submitProof(
        subcontractorId,
        Number(privateBalance),
        Number(minimumThreshold)
      );
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 400 }}>
      <h2>Submit Financial Proof</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label>
          Vendor ID
          <input value={subcontractorId} onChange={(e) => setSubcontractorId(e.target.value)} required />
        </label>
        <label>
          Private balance (cents)
          <input
            type="number"
            value={privateBalance}
            onChange={(e) => setPrivateBalance(e.target.value)}
            required
          />
          <small style={{ display: "block", color: "#666" }}>
            Stays private. Never sent past this form to the chain.
          </small>
        </label>
        <label>
          Threshold (cents)
          <input
            type="number"
            value={minimumThreshold}
            onChange={(e) => setMinimumThreshold(e.target.value)}
          />
          <small style={{ display: "block", color: "#666" }}>
            Also private. The chain only ever learns pass/fail.
          </small>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Proof"}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 16, padding: 12, background: "#e8f5e9", borderRadius: 4 }}>
          <p><strong>{result.pass ? "PASS" : "FAIL"}</strong></p>
          <p>Hash: {result.commitmentHash}</p>
          <p>Timestamp: {result.timestamp}</p>
        </div>
      )}
    </div>
  );
}
