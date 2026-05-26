import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";
import { Btn } from "../components/common/Btn";
import { C } from "../constants/colors";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/login", { method: "POST", body: { email, password } });
      login(data.user, data.token);
      navigate(data.user?.role === "admin" ? "/admin" : "/");
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, color: C.red, marginBottom: 28 }}>Авторизация</h1>
      <div
        style={{
          background: C.white,
          borderRadius: 16,
          padding: "36px 40px",
          width: 360,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}
      >
        {err && (
          <div style={{ color: C.redBright, fontSize: 13, marginBottom: 14, textAlign: "center" }}>{err}</div>
        )}
        {[
          { label: "Почта", val: email, set: setEmail, type: "email" },
          { label: "Пароль", val: password, set: setPassword, type: "password" },
        ].map((f) => (
          <div key={f.label} style={{ borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
            <input
              value={f.val}
              onChange={(e) => f.set(e.target.value)}
              type={f.type}
              placeholder={f.label}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: 15,
                padding: "8px 0",
                background: "none",
                color: C.text,
              }}
            />
          </div>
        ))}
        <Btn onClick={handleLogin} disabled={loading} style={{ width: "100%", borderRadius: 24, marginBottom: 12 }}>
          {loading ? "Вход..." : "Войти"}
        </Btn>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <Btn variant="ghost" style={{ width: "100%", borderRadius: 24 }}>
            Зарегистрироваться
          </Btn>
        </Link>
      </div>
    </div>
  );
}
