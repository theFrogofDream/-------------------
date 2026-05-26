import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/layout/Header";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import { C } from "./constants/colors";

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        minHeight: "100vh",
        background: C.bg,
      }}
    >
      <Header search={search} setSearch={setSearch} />

      <Routes>
        <Route path="/" element={<CatalogPage search={search} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
