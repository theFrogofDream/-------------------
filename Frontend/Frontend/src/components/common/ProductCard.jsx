import { useState } from "react";
import { C } from "../../constants/colors";
import { Btn } from "./Btn";
import { QtySelector } from "./QtySelector";

export const ProductCard = ({ product, onAddToCart }) => {
  const [qty, setQty] = useState(1);
  const inStock = (product.count ?? 0) > 0;

  return (
    <article
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 160,
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
        }}
      >
        <img
          src={product.image_url || "https://via.placeholder.com/200x140?text=Товар"}
          alt={product.name}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
        />
      </div>
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: C.text, textAlign: "left" }}>
          {product.name}
        </h3>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.4,
            textAlign: "left",
            flex: 1,
          }}
        >
          {product.description || "Описание Описание Описание Описание"}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{product.price} руб</span>
          {inStock ? (
            <span
              style={{
                fontSize: 12,
                color: C.green,
                background: C.greenBg,
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              в наличии
            </span>
          ) : (
            <span style={{ fontSize: 12, color: C.muted }}>нет в наличии</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <QtySelector value={qty} onChange={setQty} max={product.count || 999} />
          <Btn
            onClick={() => onAddToCart({ ...product, qty })}
            disabled={!inStock}
            style={{ flex: 1, borderRadius: 6 }}
          >
            Корзина
          </Btn>
        </div>
      </div>
    </article>
  );
};
