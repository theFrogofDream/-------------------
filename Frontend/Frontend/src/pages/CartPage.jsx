import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../constants/colors";
import { Btn } from "../components/common/Btn";
import { QtySelector } from "../components/common/QtySelector";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/apiFetch";

export default function CartPage() {
  const { cart, total, removeFromCart, setQty, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!cart.length) {
      setErr("Корзина пуста");
      return;
    }
    if (!address.trim() || !date.trim()) {
      setErr("Укажите адрес и дату доставки");
      return;
    }

    setErr("");
    setLoading(true);
    try {
      const order = {
        user_id: user.id,
        adress: address,
        date,
        products: cart.map((i) => ({
          product_id: i.id,
          count: i.qty,
          price: i.price,
        })),
        full_price: total,
      };
      await apiFetch("/api/regpay", { method: "POST", body: order });
      clearCart();
      navigate("/profile");
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  return (
    <main style={{ background: C.bg, minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 24px", textAlign: "left", color: C.text }}>
          Корзина
        </h1>

        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          <div style={{ flex: 1, background: C.white, borderRadius: 8, border: `1px solid ${C.border}` }}>
            {cart.length === 0 ? (
              <p style={{ padding: 40, color: C.muted }}>Корзина пуста</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: "20px 24px",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <img
                    src={item.image_url || "https://via.placeholder.com/72"}
                    alt=""
                    style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 4 }}
                  />
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>в наличии</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{item.price} руб</div>
                  <QtySelector value={item.qty} onChange={(q) => setQty(item.id, q)} />
                  <Btn variant="danger" onClick={() => removeFromCart(item.id)} style={{ borderRadius: 6 }}>
                    Удалить
                  </Btn>
                </div>
              ))
            )}
          </div>

          <aside
            style={{
              width: 320,
              flexShrink: 0,
              background: C.white,
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            }}
          >
            <input
              placeholder="Адрес"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                marginBottom: 12,
                boxSizing: "border-box",
                fontSize: 14,
              }}
            />
            <input
              placeholder="Дата"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                marginBottom: 20,
                boxSizing: "border-box",
                fontSize: 14,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontWeight: 700 }}>
              <span>Стоимость:</span>
              <span style={{ fontSize: 18 }}>{total} руб</span>
            </div>
            {err && <p style={{ color: C.redBright, fontSize: 13, marginBottom: 12 }}>{err}</p>}
            <Btn
              onClick={handlePay}
              disabled={loading}
              style={{ width: "100%", borderRadius: 24, padding: "14px 0" }}
            >
              {loading ? "..." : "Оплатить"}
            </Btn>
            <p style={{ fontSize: 11, color: C.muted, marginTop: 16, lineHeight: 1.5 }}>
              Нажимая «Оплатить», вы соглашаетесь с обработкой персональных данных и правилами сайта.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
