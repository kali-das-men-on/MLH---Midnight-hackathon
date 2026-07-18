import React, { useEffect, useState } from "react";
import {
  getRecentProofs,
  closeProof,
  setThreshold,
} from "../services/api";
import ChatWidget from "../components/ChatWidget";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState(null);

  const [vendorId, setVendorId] = useState("");
  const [threshold, setThresholdValue] = useState("250000");

  const [settingThreshold, setSettingThreshold] = useState(false);
  const [message, setMessage] = useState("");

  async function loadVendors() {
    setLoading(true);

    try {
      const data = await getRecentProofs();

      setVendors(data);

      if (
        data.length &&
        !selectedVendor
      ) {
        setSelectedVendor(data[0].subcontractorId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendors();
  }, []);

  async function handleClose(id) {
    setClosingId(id);

    try {
      await closeProof(id);
      await loadVendors();
    } catch (err) {
      console.error(err);
    } finally {
      setClosingId(null);
    }
  }

  async function handleThreshold(e) {
    e.preventDefault();

    setSettingThreshold(true);
    setMessage("");

    try {
      await setThreshold(
        vendorId.trim(),
        Number(threshold)
      );

      setMessage(
        `Threshold successfully set for ${vendorId}.`
      );

      setVendorId("");
      setThresholdValue("250000");
    } catch (err) {
      console.error(err);
      setMessage("Unable to set threshold.");
    } finally {
      setSettingThreshold(false);
    }
  }

  return (
    <div className="page">
      <div className="grid">

        {/* LEFT COLUMN */}

        <div>

          <div
            className="card"
            style={{ marginBottom: 25 }}
          >
            <h2>Register Vendor</h2>

            <p
              style={{
                marginBottom: 25,
              }}
            >
              Assign a financial threshold before a
              subcontractor can submit a proof.
            </p>

            <form
              className="form"
              onSubmit={handleThreshold}
            >
              <label>
                Vendor ID

                <input
                  value={vendorId}
                  onChange={(e) =>
                    setVendorId(e.target.value)
                  }
                  required
                />
              </label>

              <label>
                Required Threshold (Private)

                <input
                  type="number"
                  value={threshold}
                  onChange={(e) =>
                    setThresholdValue(e.target.value)
                  }
                  required
                />
              </label>

              <button
                className="primary-btn"
                disabled={settingThreshold}
              >
                {settingThreshold
                  ? "Saving..."
                  : "Register Vendor"}
              </button>

              {message && (
                <div className="success-box">
                  {message}
                </div>
              )}
            </form>
          </div>

          <div className="card">

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h2>Vendor Registry</h2>

              <button
                className="secondary-btn"
                onClick={loadVendors}
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p>Loading vendors...</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Status</th>
                    <th>Review</th>
                    <th>Submitted</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {vendors.map((vendor) => (
                    <tr
                      key={
                        vendor.subcontractorId
                      }
                      style={{
                        cursor: "pointer",
                        background:
                          selectedVendor ===
                          vendor.subcontractorId
                            ? "#18314d"
                            : "",
                      }}
                    >
                      <td
                        onClick={() =>
                          setSelectedVendor(
                            vendor.subcontractorId
                          )
                        }
                      >
                        {
                          vendor.subcontractorId
                        }
                      </td>

                      <td>
                        <span
                          className={
                            vendor.pass
                              ? "badge success"
                              : "badge fail"
                          }
                        >
                          {vendor.pass
                            ? "PASS"
                            : "FAIL"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            vendor.status ===
                            "closed"
                              ? "badge closed"
                              : "badge pending"
                          }
                        >
                          {vendor.status.toUpperCase()}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          vendor.timestamp
                        ).toLocaleString()}
                      </td>

                      <td>
                        {vendor.status ===
                          "pending" && (
                          <button
                            className="secondary-btn"
                            disabled={
                              closingId ===
                              vendor.subcontractorId
                            }
                            onClick={() =>
                              handleClose(
                                vendor.subcontractorId
                              )
                            }
                          >
                            {closingId ===
                            vendor.subcontractorId
                              ? "Closing..."
                              : "Close"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div>

          <div
            className="card"
            style={{
              marginBottom: 20,
            }}
          >
            <h2>TrustVet AI</h2>

            <p>
              Select a vendor to ask
              questions about proof status,
              qualification,
              commitment hashes,
              and verification timestamps.
            </p>

            <br />

            <small
              style={{
                color: "#9fb3c8",
              }}
            >
              The AI never receives or reveals
              balances, thresholds,
              witnesses,
              or any private financial
              information.
            </small>
          </div>

          {selectedVendor ? (
            <ChatWidget
              subcontractorId={
                selectedVendor
              }
            />
          ) : (
            <div className="card">
              <h3>No Vendor Selected</h3>

              <p>
                Choose a vendor from the table
                to begin chatting with
                TrustVet AI.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}