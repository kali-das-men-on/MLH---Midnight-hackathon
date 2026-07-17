import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/vendors`)
      .then((r) => r.json())
      .then(setVendors);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Vendors</h2>
      <table>
        <thead>
          <tr><th>Vendor</th><th>Status</th><th>Proof ID</th></tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v.vendorId}>
              <td>{v.vendorId}</td>
              <td>{v.status}</td>
              <td>{v.proofId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
