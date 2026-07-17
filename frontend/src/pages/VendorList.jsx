import React, { useEffect, useMemo, useState } from "react";
import { getRecentProofs } from "../services/api";
import ChatWidget from "../components/ChatWidget";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  async function loadVendors() {
    setLoading(true);
    setError("");

    try {
      const data = await getRecentProofs();

      setVendors(data);

      if (data.length > 0 && !selectedVendor) {
        setSelectedVendor(data[0]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load vendor proofs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) =>
      vendor.subcontractorId
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [vendors, search]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "380px 1fr",
        gap: 24,
        padding: 24,
      }}
    >
      <div>
        <h2>Vendor Dashboard</h2>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: 10,
            }}
          />

          <button
            onClick={loadVendors}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: 12,
              background: "#ffeaea",
              color: "#b00020",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading vendors...</p>
        ) : filteredVendors.length === 0 ? (
          <p>No vendors found.</p>
        ) : (
          filteredVendors.map((vendor) => {
            const selected =
              selectedVendor &&
              selectedVendor.subcontractorId === vendor.subcontractorId;

            return (
              <div
                key={vendor.subcontractorId}
                onClick={() => setSelectedVendor(vendor)}
                style={{
                  cursor: "pointer",
                  padding: 16,
                  borderRadius: 10,
                  border: selected
                    ? "2px solid #2563eb"
                    : "1px solid #ddd",
                  background: selected ? "#eff6ff" : "#fff",
                  marginBottom: 12,
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: 8,
                  }}
                >
                  {vendor.subcontractorId}
                </h3>

                <div
                  style={{
                    fontWeight: "bold",
                    color: vendor.pass
                      ? "green"
                      : "#b00020",
                  }}
                >
                  {vendor.pass
                    ? "✓ Qualified"
                    : "✕ Not Qualified"}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: "#666",
                  }}
                >
                  Commitment
                </div>

                <code
                  style={{
                    fontSize: 12,
                    wordBreak: "break-word",
                  }}
                >
                  {vendor.commitmentHash}
                </code>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: "#666",
                  }}
                >
                  Verified
                </div>

                <small>
                  {new Date(
                    vendor.timestamp
                  ).toLocaleString()}
                </small>
              </div>
            );
          })
        )}
      </div>

      <div>
        {selectedVendor ? (
          <>
            <div
              style={{
                marginBottom: 20,
                padding: 18,
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                }}
              >
                {selectedVendor.subcontractorId}
              </h2>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: selectedVendor.pass
                      ? "green"
                      : "#b00020",
                  }}
                >
                  {selectedVendor.pass
                    ? "Qualified"
                    : "Not Qualified"}
                </span>
              </p>

              <p>
                <strong>Commitment Hash</strong>
              </p>

              <code
                style={{
                  wordBreak: "break-word",
                }}
              >
                {selectedVendor.commitmentHash}
              </code>

              <p
                style={{
                  marginTop: 14,
                }}
              >
                <strong>Last Verification</strong>
              </p>

              <small>
                {new Date(
                  selectedVendor.timestamp
                ).toLocaleString()}
              </small>
            </div>

            <ChatWidget
              subcontractorId={
                selectedVendor.subcontractorId
              }
            />
          </>
        ) : (
          <div
            style={{
              padding: 40,
              border: "1px dashed #ccc",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            Select a vendor to open TrustVet AI.
          </div>
        )}
      </div>
    </div>
  );
}