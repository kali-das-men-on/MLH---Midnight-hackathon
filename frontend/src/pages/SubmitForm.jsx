import React, { useState } from "react";
import { submitProof } from "../services/api";

export default function SubmitForm() {
  const [subcontractorId, setSubcontractorId] = useState("");
  const [privateBalance, setPrivateBalance] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await submitProof(
        subcontractorId.trim(),
        Number(privateBalance)
      );

      if (response?.error) {
        setError(response.error);
      } else {
        setResult(response);

        // Never keep private financial data longer than necessary.
        setPrivateBalance("");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to contact the TrustVet backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div
        className="card"
        style={{
          maxWidth: 650,
          margin: "0 auto",
        }}
      >
        <h2>Submit Zero-Knowledge Financial Proof</h2>

        <p
          style={{
            marginBottom: 30,
          }}
        >
          Submit a proof that demonstrates your organization satisfies the
          financial requirements without exposing confidential financial
          information.
        </p>

        <form
          className="form"
          onSubmit={handleSubmit}
        >
          <label>
            Vendor ID

            <input
              type="text"
              value={subcontractorId}
              placeholder="vendor-001"
              onChange={(e) =>
                setSubcontractorId(e.target.value)
              }
              required
            />
          </label>

          <label>
            Private Balance

            <input
              type="number"
              value={privateBalance}
              placeholder="Private Balance"
              onChange={(e) =>
                setPrivateBalance(e.target.value)
              }
              required
            />

            <small
              style={{
                color: "#9fb3c8",
                marginTop: 8,
              }}
            >
              Your financial balance never leaves the
              zero-knowledge proving process. Neither the
              blockchain nor TrustVet stores this value.
            </small>
          </label>

          <button
            className="primary-btn"
            disabled={loading}
            type="submit"
          >
            {loading
              ? "Generating Proof..."
              : "Generate & Submit Proof"}
          </button>
        </form>

        {error && (
          <div className="error-box">
            <strong>Error</strong>

            <p
              style={{
                marginTop: 10,
              }}
            >
              {error}
            </p>
          </div>
        )}

        {result && (
          <div className="success-box">
            <h3
              style={{
                marginBottom: 12,
              }}
            >
              ✓ Proof Submitted
            </h3>

            <p>
              Your proof has been successfully submitted for
              verification.
            </p>

            <br />

            <p>
              The reviewing organization will determine whether
              your submission qualifies.
            </p>

            <br />

            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <div>
                <strong>Vendor</strong>

                <div>{subcontractorId}</div>
              </div>

              {result.commitmentHash && (
                <div>
                  <strong>Commitment Hash</strong>

                  <div
                    style={{
                      wordBreak: "break-all",
                      color: "#4ec9ff",
                    }}
                  >
                    {result.commitmentHash}
                  </div>
                </div>
              )}

              {result.timestamp && (
                <div>
                  <strong>Submitted</strong>

                  <div>
                    {new Date(
                      result.timestamp
                    ).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            <hr
              style={{
                margin: "20px 0",
                borderColor: "#2b4965",
              }}
            />

            <small
              style={{
                color: "#9fb3c8",
              }}
            >
              Privacy Notice: This interface never displays your
              balance or the required financial threshold. Only the
              zero-knowledge proof and commitment are recorded.
            </small>
          </div>
        )}
      </div>
    </div>
  );
}