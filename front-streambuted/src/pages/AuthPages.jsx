import { useState } from "react";

export function LoginPage({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("listener");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    if (!email) return setErr("Email requerido.");
    if (!pass) return setErr("Contraseña requerida.");
    setErr("");
    onLogin({ email, role, name: email.split("@")[0] || "Usuario" });
  };

  return (
    <div className="auth-shell">
      <div className="auth-glow" style={{ top: "-200px", left: "-100px" }} />
      <div className="auth-glow" style={{ bottom: "-200px", right: "-100px" }} />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">S</div>
        </div>
        <div className="auth-title">Bienvenido a StreamButed</div>
        <div className="auth-sub">Ingresa tu cuenta para continuar</div>

        <div style={{ marginBottom: 16 }}>
          <div className="form-label">Iniciar como</div>
          <div className="role-tabs" role="tablist" aria-label="Seleccionar rol">
            {["listener", "artist", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                className={`role-tab${role === r ? " active" : ""}`}
                onClick={() => setRole(r)}
                aria-pressed={role === r}
              >
                {r === "listener" ? "Oyente" : r === "artist" ? "Artista" : "Admin"}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {err && <div style={{ fontSize: 13, color: "var(--danger)", marginBottom: 12 }}>{err}</div>}

        <div className="forgot-row">
          <span className="auth-link" style={{ fontSize: 13 }}>
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        <button className="btn-primary" style={{ width: "100%", marginBottom: 16 }} onClick={handleLogin}>
          Iniciar Sesión
        </button>

        <div className="form-divider">
          <span>o</span>
        </div>

        <button className="btn-ghost" style={{ width: "100%", marginBottom: 16 }} type="button">
          Continuar con Google
        </button>

        <div className="auth-footer">
          ¿No tienes cuenta? <span className="auth-link" onClick={onRegister}>Regístrate</span>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage({ onLogin, onBack }) {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirm: "",
    role: "listener",
  });
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCreate = () => {
    if (!form.email || !form.username || !form.password) return setErr("Todos los campos son requeridos.");
    if (form.password !== form.confirm) return setErr("Las contraseñas no coinciden.");
    setErr("");
    onLogin({ email: form.email, role: form.role, name: form.username });
  };

  return (
    <div className="auth-shell">
      <div className="auth-glow" style={{ top: "-100px", right: "0" }} />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">S</div>
        </div>
        <div className="auth-title">Crea tu cuenta</div>
        <div className="auth-sub">Únete a StreamButed hoy</div>

        <div
          className="role-tabs"
          style={{ marginBottom: 20 }}
          role="tablist"
          aria-label="Seleccionar rol de cuenta"
        >
          {["listener", "artist"].map((r) => (
            <button
              key={r}
              type="button"
              className={`role-tab${form.role === r ? " active" : ""}`}
              onClick={() => setForm((f) => ({ ...f, role: r }))}
              aria-pressed={form.role === r}
            >
              {r === "listener" ? "Soy Oyente" : "Soy Artista"}
            </button>
          ))}
        </div>

        {["email", "username", "password", "confirm"].map((k, i) => (
          <div className="form-group" key={k}>
            <label className="form-label">
              {["Email", "Nombre de usuario", "Contraseña", "Confirmar contraseña"][i]}
            </label>
            <input
              type={k.includes("pass") || k === "confirm" ? "password" : "text"}
              placeholder={["Enter your email", "Choose a username", "Create a password", "Confirm your password"][i]}
              value={form[k]}
              onChange={set(k)}
            />
          </div>
        ))}

        {err && <div style={{ fontSize: 13, color: "var(--danger)", marginBottom: 12 }}>{err}</div>}

        <button className="btn-primary" style={{ width: "100%", marginBottom: 16 }} onClick={handleCreate}>
          Crear Cuenta
        </button>

        <div className="form-divider">
          <span>o</span>
        </div>

        <button className="btn-ghost" style={{ width: "100%", marginBottom: 16 }} type="button">
          Registrarse con Google
        </button>

        <div className="auth-footer">
          ¿Ya tienes cuenta? <span className="auth-link" onClick={onBack}>Inicia sesión</span>
        </div>
      </div>
    </div>
  );
}