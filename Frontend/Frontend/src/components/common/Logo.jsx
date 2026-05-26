

export const Logo = ({ onClick }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
    <svg width="36" height="36" viewBox="0 0 36 36">
      <img width="36" height="36" src="https://www.uralstroybaza.ru/wp-content/uploads/2023/01/logo-3.png" alt="" />
      </svg>
    <span style={{ fontWeight: 800, fontSize: 18, color: C.red, letterSpacing: 0.3 }}>УралСтройБаза</span>
  </div>
);