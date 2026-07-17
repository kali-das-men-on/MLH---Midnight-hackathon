import React, { useState } from "react";
import { submitProof } from "../services/api";

export default function SubmitForm() {
  const [subcontractorId, setSubcontractorId] = useState("");
  const [privateBalance, setPrivateBalance] = useState("");
  const [minimumThreshold, setMinimumThreshold] = useState("250000");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const proof = await submitProof(
        subcontractorId.trim(),
        Number(privateBalance),
        Number(minimumThreshold)
      );

      setResult(proof);

      // Clear only private inputs
      setPrivateBalance("");
      setMinimumThreshold("250000");
    } catch (err) {
      console.error(err);
      setError("Unable to submit proof.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #ddd",
        borderRadius: 12,
        background: "#fff",
      }}
    >
      <h2>Submit Financial Proof</h2>

      <p
        style={{
          color: "#666",
          marginBottom: 24,
        }}
      >
        Submit a zero-knowledge proof for vendor qualification.
        Financial values remain private and are never returned by the API.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div>
          <label>Vendor ID</label>

          <input
            value={subcontractorId}
            onChange={(e) => setSubcontractorId(e.target.value)}
            placeholder="vendor-001"
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 6,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label>Private Balance</label>

          <input
            type="number"
            value={privateBalance}
            onChange={(e) => setPrivateBalance(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 6,
              boxSizing: "border-box",
            }}
          />

          <small
            style={{
              display: "block",
              marginTop: 4,
              color: "#666",
            }}
          >
            This amount is private and never exposed.
          </small>
        </div>

        <div>
          <label>Minimum Threshold</label>

          <input
            type="number"
            value={minimumThreshold}
            onChange={(e) => setMinimumThreshold(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 6,
              boxSizing: "border-box",
            }}
          />

          <small
            style={{
              display: "block",
              marginTop: 4,
              color: "#666",
            }}
          >
            This value is also private. Only qualification status is revealed.
          </small>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Generating Proof..." : "Submit Proof"}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 8,
            background: "#ffecec",
            color: "#b00020",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 10,
            background: result.pass ? "#eaf8ef" : "#fdecec",
            border: `1px solid ${
              result.pass ? "#8fd19e" : "#ef9a9a"
            }`,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              color: result.pass ? "green" : "#b00020",
            }}
          >
            {result.pass
              ? "✓ Vendor Qualified"
              : "✕ Vendor Not Qualified"}
          </h3>

          <p>
            <strong>Vendor</strong>
            <br />
            {result.subcontractorId}
          </p>

          <p>
            <strong>Commitment Hash</strong>
            <br />
            <code>{result.commitmentHash}</code>
          </p>

          <p>
            <strong>Timestamp</strong>
            <br />
            {new Date(result.timestamp).toLocaleString()}
          </p>

          <hr />

          <small
            style={{
              color: "#666",
            }}
          >
            Private balance and threshold are never stored,
            displayed, or returned.
          </small>
        </div>
      )}
    </div>
  );
}