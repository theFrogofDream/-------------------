import { useMemo, useState } from "react";
import { C } from "../constants/colors";
import { CATEGORIES } from "../data/mockData";
import { ProductCard } from "../components/common/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";

export default function CatalogPage({ search = "" }) {
  const [tagId, setTagId] = useState(0);
  const [sort, setSort] = useState("cheap");
  const { products, loading, error } = useProducts(tagId);
  const { addToCart } = useCart();

  const filtered = useMemo(() => {
    let list = [...products];
    if (tagId) list = list.filter((p) => p.tag_id === tagId);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(q));
    }
    if (sort === "cheap") list.sort((a, b) => a.price - b.price);
    if (sort === "expensive") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, tagId, search, sort]);

  return (
    <main style={{ background: C.bg, minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 24px", textAlign: "left", color: C.text }}>
          Каталог
        </h1>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <aside
            style={{
              width: 280,
              flexShrink: 0,
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setTagId(0)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 16px",
                border: "none",
                borderBottom: `1px solid ${C.border}`,
                background: tagId === 0 ? C.bg : C.white,
                cursor: "pointer",
                fontWeight: tagId === 0 ? 700 : 400,
                fontSize: 14,
              }}
            >
              Все категории
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setTagId(cat.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "14px 16px",
                  border: "none",
                  borderBottom: `1px solid ${C.border}`,
                  background: tagId === cat.id ? C.bg : C.white,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                  color: C.text,
                }}
              >
                <span>{cat.name}</span>
                <span style={{ color: C.muted }}>›</span>
              </button>
            ))}
          </aside>

          <section style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 14, color: C.muted }}>{filtered.length} товаров</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  fontSize: 14,
                  background: C.white,
                }}
              >
                <option value="cheap">Сначала дешёвые</option>
                <option value="expensive">Сначала дорогие</option>
              </select>
            </div>

            {error && <p style={{ color: C.redBright }}>{error}</p>}
            {loading ? (
              <p style={{ color: C.muted }}>Загрузка...</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 20,
                }}
              >
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
