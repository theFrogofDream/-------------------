import { C } from "../../constants/colors";

export const SearchBar = ({ value, onChange, placeholder = "Поиск" }) => (
  <div style={{ position: "relative", flex: 1, maxWidth: 600 }}>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "10px 44px 10px 16px",
        borderRadius: 8,
        border: `1px solid ${C.border}`,
        background: C.white,
        fontSize: 15,
        outline: "none",
        boxSizing: "border-box",
        color: C.text,
      }}
    />
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={C.muted}
      strokeWidth="2"
      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  </div>
);
