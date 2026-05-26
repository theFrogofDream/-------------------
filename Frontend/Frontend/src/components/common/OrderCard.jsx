import { C } from "../../constants/colors";

export const OrderCard = ({ order, showStatusEdit, statuses, statusValue, onStatusChange, onStatusSave }) => {
  const itemCount = order.products?.reduce((s, p) => s + (p.qty || p.count || 1), 0) ?? 0;
  const total = order.full_price ?? order.Full_price ?? order.products?.reduce((s, p) => s + p.price * (p.qty || 1), 0);

  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
          padding: "16px 20px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15 }}>Заказ №{order.id}</span>
        <span style={{ fontSize: 14, color: C.muted }}>Кол-во товаров: {itemCount}</span>
        {showStatusEdit ? (
          <>
            <label style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              Статус:
              <select
                value={statusValue ?? order.status}
                onChange={(e) => onStatusChange?.(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  fontSize: 14,
                }}
              >
                {(statuses || [order.status]).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={onStatusSave}
              style={{
                marginLeft: "auto",
                padding: "8px 20px",
                borderRadius: 6,
                border: `1px solid ${C.border}`,
                background: C.white,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Изменить
            </button>
          </>
        ) : (
          <span style={{ fontSize: 14, color: C.muted }}>Статус: {order.status}</span>
        )}
        <span style={{ marginLeft: showStatusEdit ? 0 : "auto", fontWeight: 700, fontSize: 15 }}>{total} руб</span>
      </div>
      {(order.products || []).map((item) => (
        <div
          key={`${order.id}-${item.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 20px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <img
            src={item.image_url || "https://via.placeholder.com/56"}
            alt=""
            style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 4 }}
          />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Кол-во: {item.qty || item.count || 1}</div>
          </div>
          <span style={{ fontWeight: 600 }}>{item.price} руб</span>
        </div>
      ))}
    </div>
  );
};
