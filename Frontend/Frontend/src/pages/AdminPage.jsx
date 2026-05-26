import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { C } from "../constants/colors";
import { Btn } from "../components/common/Btn";
import { QtySelector } from "../components/common/QtySelector";
import { OrderCard } from "../components/common/OrderCard";
import { ORDER_STATUSES } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useOrders } from "../hooks/useOrders";
import { apiFetch } from "../api/apiFetch";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts(0);
  const { orders, setOrders, loading: ordersLoading } = useOrders(0);
  const [statusEdits, setStatusEdits] = useState({});
  const [productEdits, setProductEdits] = useState({});

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  const getProductEdit = (p) => productEdits[p.id] ?? p;

  const updateProductField = (id, field, value) => {
    setProductEdits((prev) => {
      const base = prev[id] ?? products.find((x) => x.id === id);
      return { ...prev, [id]: { ...base, [field]: value } };
    });
  };

  const saveProduct = async (p) => {
    const data = getProductEdit(p);
    try {
      await apiFetch(`/api/productp/${p.id}`, {
        method: "PUT",
        body: {
          name: data.name,
          description: data.description,
          price: Number(data.price),
          count: Number(data.count),
          image_url: data.image_url,
          tag_id: data.tag_id,
        },
      });
    } catch {
      /* mock mode */
    }
  };

  const saveOrderStatus = async (order) => {
    const status = statusEdits[order.id] ?? order.status;
    try {
      await apiFetch(`/api/order/${order.id}`, {
        method: "PATCH",
        body: { status },
      });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    } catch {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    }
  };

  return (
    <main style={{ background: C.bg, minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, textAlign: "left", color: C.text }}>
            Админ панель
          </h1>
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

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: "left" }}>Заказы</h2>
          {ordersLoading ? (
            <p style={{ color: C.muted }}>Загрузка...</p>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                showStatusEdit
                statuses={ORDER_STATUSES}
                statusValue={statusEdits[order.id] ?? order.status}
                onStatusChange={(s) => setStatusEdits((prev) => ({ ...prev, [order.id]: s }))}
                onStatusSave={() => saveOrderStatus(order)}
              />
            ))
          )}
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: "left" }}>Товары</h2>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            {productsLoading ? (
              <p style={{ padding: 24, color: C.muted }}>Загрузка...</p>
            ) : (
              products.map((p) => {
                const edit = getProductEdit(p);
                return (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 20px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <img
                      src={edit.image_url || "https://via.placeholder.com/56"}
                      alt=""
                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 4 }}
                    />
                    <input
                      value={edit.name}
                      onChange={(e) => updateProductField(p.id, "name", e.target.value)}
                      style={{ flex: "1 1 120px", minWidth: 100, padding: 8, border: `1px solid ${C.border}`, borderRadius: 6 }}
                    />
                    <textarea
                      value={edit.description || ""}
                      onChange={(e) => updateProductField(p.id, "description", e.target.value)}
                      rows={2}
                      style={{ flex: "2 1 200px", minWidth: 160, padding: 8, border: `1px solid ${C.border}`, borderRadius: 6, resize: "vertical" }}
                    />
                    <input
                      type="number"
                      value={edit.price}
                      onChange={(e) => updateProductField(p.id, "price", e.target.value)}
                      style={{ width: 80, padding: 8, border: `1px solid ${C.border}`, borderRadius: 6 }}
                    />
                    <QtySelector
                      value={Number(edit.count) || 1}
                      onChange={(n) => updateProductField(p.id, "count", n)}
                    />
                    <Btn variant="danger" onClick={() => saveProduct({ ...edit, count: 0 })} style={{ borderRadius: 6 }}>
                      Удалить
                    </Btn>
                    <Btn variant="outline" onClick={() => saveProduct(edit)} style={{ borderRadius: 6 }}>
                      Изменить
                    </Btn>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
