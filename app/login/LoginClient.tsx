"use client";

import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const LOGIN_ENDPOINT = "/api/auth/login";

function sanitizeRedirect(raw: string | null): string | null {
  if (!raw) return null;
  const r = raw.trim();
  if (!r.startsWith("/")) return null;
  if (r.startsWith("//")) return null;
  return r;
}

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const requestedRedirect = useMemo(() => sanitizeRedirect(sp.get("redirect")), [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Ingresa tu correo y tu contraseña.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          email: email.trim(),
          password,
          remember,
          redirectTo: requestedRedirect, // el server lo sanitiza y decide
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.message || "No se pudo iniciar sesión.");
        return;
      }

      const dest = sanitizeRedirect(data?.redirectTo) || "/inicio";
      router.replace(dest); // mejor que push (evita volver a login con back)
      router.refresh();
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // --- estilos (mockup) ---
  const label: CSSProperties = {
    fontSize: 18,
    fontWeight: 750,
    color: "#1c2a3a",
    marginBottom: 8,
  };

  const fieldWrap: CSSProperties = {
    position: "relative",
    height: 48,
    borderRadius: 14,
    border: "1px solid #D6DDE7",
    background: "#F6F8FB",
    display: "flex",
    alignItems: "center",
    paddingLeft: 44,
    paddingRight: 12,
  };

  const icon: CSSProperties = {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.65,
  };

  const input: CSSProperties = {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 16,
    color: "#0f2236",
  };

  const showBtn: CSSProperties = {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#1E64F0",
    fontWeight: 750,
    cursor: "pointer",
  };

  const checkboxRow: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  };

  const submit: CSSProperties = {
    marginTop: 14,
    width: "100%",
    height: 50,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.06)",
    background: "linear-gradient(180deg, #2A6AF3, #1E56D8)",
    color: "#fff",
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(30, 100, 240, 0.25)",
    opacity: loading ? 0.85 : 1,
  };

  const helpLink: CSSProperties = {
    marginTop: 12,
    display: "inline-block",
    color: "#1E64F0",
    fontWeight: 700,
    textDecoration: "underline",
  };

  const helpText: CSSProperties = {
    marginTop: 8,
    color: "#5b6b7c",
    lineHeight: 1.4,
  };

  const errorBox: CSSProperties = {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(220, 38, 38, 0.25)",
    background: "rgba(220, 38, 38, 0.07)",
    color: "#7f1d1d",
    fontWeight: 650,
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gap: 10 }}>
        <div style={label}>Correo electrónico</div>
        <div style={fieldWrap}>
          <span style={icon} aria-hidden="true">
            {/* Email icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6.5h16c.8 0 1.5.7 1.5 1.5v9c0 .8-.7 1.5-1.5 1.5H4c-.8 0-1.5-.7-1.5-1.5V8c0-.8.7-1.5 1.5-1.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                opacity="0.9"
              />
              <path
                d="m4.5 8.2 7.2 5.2c.2.1.4.2.6.2s.4-.1.6-.2l7.2-5.2"
                stroke="currentColor"
                strokeWidth="1.8"
                opacity="0.9"
              />
            </svg>
          </span>

          <input
            style={input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            autoComplete="email"
            inputMode="email"
            aria-label="Correo electrónico"
          />
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div style={label}>Clave de acceso</div>
        <div style={fieldWrap}>
          <span style={icon} aria-hidden="true">
            {/* Lock icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M7.5 10.5V8.8a4.5 4.5 0 0 1 9 0v1.7"
                stroke="currentColor"
                strokeWidth="1.8"
                opacity="0.9"
              />
              <path
                d="M7.2 10.5h9.6c.9 0 1.7.8 1.7 1.7v6.2c0 .9-.8 1.7-1.7 1.7H7.2c-.9 0-1.7-.8-1.7-1.7v-6.2c0-.9.8-1.7 1.7-1.7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                opacity="0.9"
              />
            </svg>
          </span>

          <input
            style={{ ...input, paddingRight: 76 }}
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            autoComplete="current-password"
            aria-label="Contraseña"
          />

          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            style={showBtn}
            aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPass ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>

      <label style={checkboxRow}>
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          style={{ width: 20, height: 20, accentColor: "#1E64F0" }}
        />
        <span style={{ fontSize: 18, fontWeight: 700, color: "#1c2a3a" }}>
          Recordarme
        </span>
      </label>

      <button type="submit" style={submit} disabled={loading}>
        {loading ? "Iniciando…" : "Iniciar sesión"}
      </button>

      <a href="/soporte" style={helpLink}>
        ¿Olvidaste tu contraseña?
      </a>
      <div style={helpText}>Contacta a tu asesor o al área administrativa.</div>

      {error ? <div style={errorBox}>{error}</div> : null}
    </form>
  );
}