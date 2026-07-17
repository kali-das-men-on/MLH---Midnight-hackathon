import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SubmitForm from "./pages/SubmitForm.jsx";
import VendorList from "./pages/VendorList.jsx";
import ChatWidget from "./components/ChatWidget.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 16, padding: 16 }}>
        <Link to="/">Submit</Link>
        <Link to="/vendors">Vendors</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SubmitForm />} />
        <Route path="/vendors" element={<VendorList />} />
      </Routes>
      <ChatWidget />
    </BrowserRouter>
  );
}
