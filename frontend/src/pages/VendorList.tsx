import React, { useEffect, useState } from "react";
import { getRecentProofs, Proof } from "../services/api";
import ChatWidget from "../components/ChatWidget";

export default function VendorList() {
  const [vendors, setVendors] = useState<Proof[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setVendors(await getRecentProofs());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: 16 }}>
      <div>
        <h2>Vendors</h2>
        <button onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        <table style={{ width: "100%", marginTop: 12 }}>
          <thead>
            <tr><th>Vendor</th><th>Status</th><th>Submitted</th></tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr
                key={v.subcontractorId}
                onClick={() => setSelected(v.subcontractorId)}
                style={{ cursor: "pointer", fontWeight: v.subcontractorId === selected ? "bold" : "normal" }}
              >
                <td>{v.subcontractorId}</td>
                <td>{v.pass ? "PASS" : "FAIL"}</td>
                <td>{new Date(v.timestamp).toLocaleString()}</td>
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
