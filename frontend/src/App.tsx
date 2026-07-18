import React from "react";
import {
  HashRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import SubmitForm from "./pages/SubmitForm";
import VendorList from "./pages/VendorList";

export default function App() {
  return (
    <HashRouter>
      <nav className="navbar">
        <div className="brand">
          TRUST
          <span className="brand-accent">VET</span>
        </div>

        <div className="nav-links">
          <NavLink to="/">
            Submit Proof
          </NavLink>

          <NavLink to="/vendors">
            Vendors
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<SubmitForm />}
        />

        <Route
          path="/vendors"
          element={<VendorList />}
        />
      </Routes>
    </HashRouter>
  );
}