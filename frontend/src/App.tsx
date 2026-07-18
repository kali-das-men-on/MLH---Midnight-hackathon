import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import SubmitForm from "./pages/SubmitForm";
import VendorList from "./pages/VendorList";

export default function App() {
  return (
    <HashRouter>
      <nav style={{ display: "flex", gap: 16, padding: 16 }}>
        <Link to="/">Submit</Link>
        <Link to="/vendors">Vendors</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SubmitForm />} />
        <Route path="/vendors" element={<VendorList />} />
      </Routes>
    </HashRouter>
  );
}