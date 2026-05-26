export const CartIcon = ({ count, onClick }) => (
  <div onClick={onClick} style={{ position: "relative", cursor: "pointer", padding: "4px 8px" }}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    {count > 0 && (
      <span style={{
        position: "absolute", top: 0, right: 0, background: C.redBright, color: "#fff",
        borderRadius: "50%", fontSize: 11, fontWeight: 700, width: 18, height: 18,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{count}</span>
    )}
  </div>
);