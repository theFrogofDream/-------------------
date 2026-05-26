import { C } from "../../constants/colors";

export const Logo = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}
  >
    <svg width="36" height="36" viewBox="0 0 36 36">
      <polygon points="18,2 34,11 34,25 18,34 2,25 2,11" fill={C.red} />
    </svg>
    <span style={{ fontWeight: 800, fontSize: 18, color: C.red, letterSpacing: 0.3 }}>УралСтройБаза</span>
  </div>
);
