import { C } from "../../constants/colors";

export const Btn = ({ children, onClick, variant = "primary", style: s = {}, disabled }) => {
  const base = {
    padding: "11px 24px", borderRadius: 8, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600, fontSize: 15, transition: "opacity 0.15s", opacity: disabled ? 0.5 : 1,
  };
  const styles = {
    primary: { background: C.red, color: "#fff" },
    outline: { background: C.bg, color: C.text, border: `1px solid ${C.border}` },
    danger: { background: C.redBright, color: "#fff" },
    ghost: { background: "none", color: C.muted, border: `1px solid ${C.border}` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...styles[variant], ...s }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
      {children}
    </button>
  );
};