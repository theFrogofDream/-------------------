import { useNavigate } from "react-router-dom";
import { Logo } from "../common/Logo";
import { SearchBar } from "../common/SearchBar";
import { CartIcon } from "../common/CartIcon";
import { C } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export default function Header({ search, setSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const accountPath = user?.role === "admin" ? "/admin" : "/profile";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 24px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, height: 64 }}>
        <Logo onClick={() => navigate("/")} />
        <SearchBar value={search} onChange={setSearch} />
        {user ? (
          <>
            <span
              onClick={() => navigate(accountPath)}
              style={{ fontSize: 14, color: C.text, cursor: "pointer", whiteSpace: "nowrap", fontWeight: 500 }}
            >
              {user.role === "admin" ? "Админ панель" : "Личный кабинет"}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.white,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                color: C.text,
                whiteSpace: "nowrap",
              }}
            >
              Выйти
            </button>
          </>
        ) : (
          <span
            onClick={() => navigate("/login")}
            style={{ fontSize: 14, color: C.text, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Войти
          </span>
        )}
        <CartIcon count={cartCount} onClick={() => navigate("/cart")} />
      </div>
    </header>
  );
}
