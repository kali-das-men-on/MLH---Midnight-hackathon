import React, { useState } from "react";
import { submitProof } from "../services/api";

export default function SubmitForm() {
  const [subcontractorId, setSubcontractorId] = useState("");
  const [privateBalance, setPrivateBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await submitProof(subcontractorId.trim(), Number(privateBalance));
      if (data && data.error) {
        setError(data.error);
      } else {
        setResult(data);
        setPrivateBalance(""); // private input never lingers in state
      }
    } catch (err) {
      console.error(err);
      setError("Unable to reach the backend.");
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
            Stays private. Never sent past this form to the chain. Your required
            threshold is set by your prime contractor — you don't choose or see
            it here.
          </small>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Proof"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 16, padding: 12, background: "#fdecea", borderRadius: 4 }}>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16, padding: 12, background: "#e8f5e9", borderRadius: 4 }}>
          <p><strong>Submitted</strong></p>
          <p>Your submission has been received. Your prime contractor will follow up with the outcome.</p>
        </div>
      )}
    </div>
  );
}