"use client";

import type { CSSProperties } from "react";

export default function PerfilClient({
  cliente,
  documentos,
  clienteId,
}: {
  cliente: any;
  documentos: any[];
  clienteId: string;
}) {
  const PRIMARY = "#0b2d5c"; // azul logo
  const ACCENT = "#2aa9ff"; // acento que combina
  const BG = "#071528";

  const page: CSSProperties = {
    padding: 24,
    fontFamily: "system-ui",
    paddingBottom: 90,
    background: BG,
    color: "white",
    minHeight: "100vh",
  };

  const topbar: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  };

  const pill: CSSProperties = {
    display: "inline-flex",
    gap: 8,
    alignItems: "center",
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    fontSize: 12,
    opacity: 0.95,
  };

  const box: CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
    background: "rgba(255,255,255,0.04)",
  };

  const title: CSSProperties = {
    fontWeight: 900,
    marginBottom: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  };

  const hr: CSSProperties = {
    border: "none",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    margin: "12px 0",
  };

  const row: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  };

  const fieldLabel: CSSProperties = { fontSize: 12, opacity: 0.75 };
  const fieldValue: CSSProperties = { fontSize: 14, fontWeight: 800 };

  const smallBtn: CSSProperties = {
    padding: "8px 10px",
    borderRadius: 12,
    border: `1px solid rgba(42,169,255,0.35)`,
    background: "rgba(42,169,255,0.10)",
    color: "white",
    fontWeight: 900,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  const tag = (estatus?: string) => {
    const ok = (estatus || "").toLowerCase() === "validado";
    const bad = (estatus || "").toLowerCase() === "rechazado";
    return {
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 900,
      border: "1px solid rgba(255,255,255,0.14)",
      background: ok
        ? "rgba(34,197,94,0.15)"
        : bad
        ? "rgba(239,68,68,0.15)"
        : "rgba(255,255,255,0.08)",
      color: ok ? "#86efac" : bad ? "#fca5a5" : "rgba(255,255,255,0.85)",
    } as CSSProperties;
  };

  const beneficiarios: any[] = Array.isArray(cliente?.beneficiarios)
    ? cliente.beneficiarios
    : [];

  return (
    <main style={page}>
      <div style={topbar}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Perfil</h1>
          <p style={{ opacity: 0.8, marginTop: 6 }}>
            Datos del cliente y configuración básica.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={pill}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: ACCENT,
                }}
              />
              {cliente?.nombre || "Cliente"}
            </span>
            <span style={pill}>ID: {clienteId}</span>
          </div>
        </div>

        <a href="/admin" style={smallBtn}>
          ← Volver a admin
        </a>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {/* Datos personales / fiscales */}
        <section style={box}>
          <div style={title}>
            <span>Datos personales y fiscales</span>
            <span style={{ fontSize: 12, opacity: 0.75 }}>(MVP: solo lectura)</span>
          </div>
          <div style={hr} />

          <div style={row}>
            <div>
              <div style={fieldLabel}>Nombre</div>
              <div style={fieldValue}>{cliente?.nombre || "-"}</div>
            </div>
            <div>
              <div style={fieldLabel}>Email</div>
              <div style={fieldValue}>{cliente?.email || "-"}</div>
            </div>
            <div>
              <div style={fieldLabel}>Teléfono</div>
              <div style={fieldValue}>{cliente?.telefono || "-"}</div>
            </div>
            <div>
              <div style={fieldLabel}>RFC</div>
              <div style={fieldValue}>{cliente?.rfc || "-"}</div>
            </div>
            <div>
              <div style={fieldLabel}>CURP</div>
              <div style={fieldValue}>{cliente?.curp || "-"}</div>
            </div>
            <div>
              <div style={fieldLabel}>Domicilio</div>
              <div style={fieldValue}>{cliente?.direccion || "-"}</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Beneficiarios</div>
            {beneficiarios.length ? (
              <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
                {beneficiarios.map((b, idx) => (
                  <li key={idx}>
                    {b?.nombre || "Beneficiario"}{" "}
                    {b?.relacion ? `(${b.relacion})` : ""}{" "}
                    {b?.porcentaje ? `— ${b.porcentaje}%` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ opacity: 0.75, fontSize: 13 }}>
                Aún no hay beneficiarios registrados.
              </div>
            )}
          </div>
        </section>

        {/* Cuenta bancaria */}
        <section style={box}>
          <div style={title}>
            <span>Cuenta bancaria registrada</span>
            <span style={tag(cliente?.clabe_validada ? "validado" : "pendiente")}>
              {cliente?.clabe_validada ? "Validada" : "Pendiente"}
            </span>
          </div>
          <div style={hr} />

          <div style={row}>
            <div>
              <div style={fieldLabel}>CLABE</div>
              <div style={fieldValue}>{cliente?.clabe || "-"}</div>
            </div>
            <div>
              <div style={fieldLabel}>Banco</div>
              <div style={fieldValue}>{cliente?.banco || "-"}</div>
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
            * En el MVP, la validación la marca Admin.
          </div>
        </section>

        {/* Documentos */}
        <section style={box}>
          <div style={title}>
            <span>Documentos</span>
            <span style={{ fontSize: 12, opacity: 0.75 }}>INE / Domicilio / Contratos</span>
          </div>
          <div style={hr} />

          {documentos?.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {documentos.map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 900 }}>
                      {(d.tipo || "documento").toUpperCase()}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>
                      {d.nombre || "Sin nombre"} · {d.estatus || "pendiente"}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    {d.url ? (
                      <a
                        href={d.url}
                        style={smallBtn}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver / Descargar
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, opacity: 0.7 }}>Sin URL</span>
                    )}
                    <span style={tag(d.estatus)}>{d.estatus || "pendiente"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ opacity: 0.75, fontSize: 13 }}>
              Aún no hay documentos cargados.
            </div>
          )}
        </section>

        {/* Preferencias */}
        <section style={box}>
          <div style={title}>
            <span>Preferencias</span>
            <span style={{ fontSize: 12, opacity: 0.75 }}>(MVP: solo lectura)</span>
          </div>
          <div style={hr} />

          <div style={row}>
            <div>
              <div style={fieldLabel}>Idioma</div>
              <div style={fieldValue}>{cliente?.idioma || "es"}</div>
            </div>
            <div>
              <div style={fieldLabel}>Contacto preferido</div>
              <div style={fieldValue}>{cliente?.contacto_preferido || "email"}</div>
            </div>
            <div>
              <div style={fieldLabel}>Notificaciones Email</div>
              <div style={fieldValue}>{cliente?.notif_email ? "Sí" : "No"}</div>
            </div>
            <div>
              <div style={fieldLabel}>Notificaciones WhatsApp</div>
              <div style={fieldValue}>{cliente?.notif_whatsapp ? "Sí" : "No"}</div>
            </div>
          </div>
        </section>
      </div>

      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.65 }}>
        Paleta: <b>{PRIMARY}</b> (principal) + <b>{ACCENT}</b> (acento) + fondo
        <b> {BG}</b>.
      </div>
    </main>
  );
}