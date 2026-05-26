import { C } from "../../constants/colors";

export const QtySelector = ({ value, onChange, min = 1, max = 999 }) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const btn = {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 18,
    color: C.text,
    padding: "0 10px",
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        background: C.white,
        height: 36,
      }}
    >
      <button type="button" style={btn} onClick={dec}>
        −
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        style={{
          width: 36,
          textAlign: "center",
          border: "none",
          borderLeft: `1px solid ${C.border}`,
          borderRight: `1px solid ${C.border}`,
          outline: "none",
          fontSize: 14,
          padding: "6px 0",
        }}
      />
      <button type="button" style={btn} onClick={inc}>
        +
      </button>
    </div>
  );
};
