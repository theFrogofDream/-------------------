import { Navigate, useNavigate } from "react-router-dom";
import { C } from "../constants/colors";
import { OrderCard } from "../components/common/OrderCard";
import { useAuth } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { orders, loading, error } = useOrders(user?.id, { enabled: !!user });

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;

  return (
    <main style={{ background: C.bg, minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, color: C.text }}>Личный кабинет</h1>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.white,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Выйти
          </button>
        </div>

        {error && <p style={{ color: C.redBright }}>{error}</p>}
        {loading ? (
          <p style={{ color: C.muted }}>Загрузка заказов...</p>
        ) : orders.length === 0 ? (
          <p style={{ color: C.muted }}>У вас пока нет заказов</p>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </main>
  );
}
