import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";
import { Btn } from "../components/common/Btn";
import { C } from "../constants/colors";

export default function RegisterPage() {
  const [form, setForm] = useState({ login: "", fio: "", email: "", password: "", password2: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleRegister = async () => {
    setErr("");
    if (form.password !== form.password2) {
      setErr("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/register", {
        method: "POST",
        body: {
          login: form.login,
          fio: form.fio,
          email: form.email,
          password: form.password,
        },
      });
      navigate("/login");
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
      <h1 style={{ fontSize: 28, fontWeight: 700, color: C.red, marginBottom: 28 }}>Регистрация</h1>
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
          { label: "Логин", k: "login" },
          { label: "ФИО", k: "fio" },
          { label: "E-mail", k: "email", type: "email" },
          { label: "Пароль", k: "password", type: "password" },
          { label: "Повторите пароль", k: "password2", type: "password" },
        ].map((f) => (
          <div key={f.k} style={{ borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
            <input
              value={form[f.k]}
              onChange={set(f.k)}
              type={f.type || "text"}
              placeholder={f.label}
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
        <Btn onClick={handleRegister} disabled={loading} style={{ width: "100%", borderRadius: 24, marginBottom: 12 }}>
          {loading ? "..." : "Зарегистрироваться"}
        </Btn>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Btn variant="ghost" style={{ width: "100%", borderRadius: 24 }}>
            Войти
          </Btn>
        </Link>
      </div>
    </div>
  );
}
