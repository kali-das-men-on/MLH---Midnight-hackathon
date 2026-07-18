import React, { useEffect, useState, FormEvent } from "react";
import { getRecentProofs, closeProof, setThreshold, Proof } from "../services/api";
import ChatWidget from "../components/ChatWidget";

export default function VendorList() {
  const [vendors, setVendors] = useState<Proof[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState<string | null>(null);

  const [newVendorId, setNewVendorId] = useState("");
  const [newThreshold, setNewThreshold] = useState("250000");
  const [settingThreshold, setSettingThreshold] = useState(false);
  const [thresholdMessage, setThresholdMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setVendors(await getRecentProofs());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleClose(subcontractorId: string) {
    setClosingId(subcontractorId);
    try {
      await closeProof(subcontractorId);
      await load();
    } finally {
      setClosingId(null);
    }
  }

  async function handleSetThreshold(e: FormEvent) {
    e.preventDefault();
    setSettingThreshold(true);
    setThresholdMessage(null);
    try {
      await setThreshold(newVendorId, Number(newThreshold));
      setThresholdMessage(`Threshold set for ${newVendorId}. They can now submit.`);
      setNewVendorId("");
    } finally {
      setSettingThreshold(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: 16 }}>
      <div>
        <h2>Vendors</h2>

        <div style={{ border: "1px solid #ccc", borderRadius: 4, padding: 12, marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>Set a Vendor's Threshold</h3>
          <form onSubmit={handleSetThreshold} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <label>
              Vendor ID
              <input value={newVendorId} onChange={(e) => setNewVendorId(e.target.value)} required />
            </label>
            <label>
              Required threshold (cents)
              <input
                type="number"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={settingThreshold}>
              {settingThreshold ? "Setting..." : "Set"}
            </button>
          </form>
          {thresholdMessage && <p style={{ color: "#2e7d32" }}>{thresholdMessage}</p>}
        </div>

        <button onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        <table style={{ width: "100%", marginTop: 12 }}>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Result</th>
              <th>Decision Status</th>
              <th>Submitted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr
                key={v.subcontractorId}
                style={{ fontWeight: v.subcontractorId === selected ? "bold" : "normal" }}
              >
                <td onClick={() => setSelected(v.subcontractorId)} style={{ cursor: "pointer" }}>
                  {v.subcontractorId}
                </td>
                <td>{v.pass ? "PASS" : "FAIL"}</td>
                <td>{v.status === "closed" ? "Closed" : "Pending"}</td>
                <td>{new Date(v.timestamp).toLocaleString()}</td>
                <td>
                  {v.status === "pending" && (
                    <button
                      onClick={() => handleClose(v.subcontractorId)}
                      disabled={closingId === v.subcontractorId}
                    >
                      {closingId === v.subcontractorId ? "Closing..." : "Close"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {selected ? (
          <ChatWidget subcontractorId={selected} />
        ) : (
          <p>Select a vendor to chat about their status.</p>
        )}
      </div>
    </div>
  );
}