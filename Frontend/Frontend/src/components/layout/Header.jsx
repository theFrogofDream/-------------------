import { Navigate } from "react-router-dom";
import { Logo } from "../common/Logo";
import { SearchBar } from "../common/SearchBar";
import { CartIcon } from "../common/CartIcon";

export const Header = ({ page, setPage, cartCount, search, setSearch, user, onLogout }) => (
  <header style={{
    background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100,
    padding: "0 24px",
  }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, height: 64 }}>
      <Logo onClick={() => <Navigate to="/" replace />} />
      <SearchBar value={search} onChange={setSearch} />
      {user ? (
        <span onClick={() => <Navigate to={user.role === "admin" ? "/admin" : "/profile"} replace />}
          style={{ fontSize: 14, color: C.text, cursor: "pointer", whiteSpace: "nowrap", fontWeight: 500 }}>
          {user.role === "admin" ? "Админ панель" : "Личный кабинет"}
        </span>
      ) : (
        <span onClick={() => <Navigate to="/login" replace />} style={{ fontSize: 14, color: C.text, cursor: "pointer", whiteSpace: "nowrap" }}>
          Войти
        </span>
      )}
      <CartIcon count={cartCount} onClick={() => <Navigate to="/cart" replace />} />
    </div>
  </header>
);
