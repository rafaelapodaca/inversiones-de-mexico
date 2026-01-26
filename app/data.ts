export const demo = {
  saldo: 1250000.5,
  mtd: 0.012,
  ytd: 0.087,
  movimientos: [
    { fecha: "03 Ene 2026", tipo: "Aportación", monto: 50000 },
    { fecha: "02 Ene 2026", tipo: "Comisión", monto: 1200 },
    { fecha: "20 Dic 2025", tipo: "Retiro", monto: 30000 },
  ],
  documentos: [
    {
      nombre: "Estado de cuenta - Dic 2025",
      tipo: "PDF",
      url: "/documentos/estado-cuenta-dic-2025.pdf",
    },
    {
      nombre: "Contrato de inversión",
      tipo: "PDF",
      url: "/documentos/contrato-inversion.pdf",
    },
    {
      nombre: "Carta al inversionista - Semana 1",
      tipo: "PDF",
      url: "/documentos/carta-inversionista-semana-1.pdf",
    },
  ],
  boletines: [
    {
      id: "2026-w03",
      titulo: "Boletín semanal — Semana 3 (2026)",
      fecha: "19 Ene 2026",
      resumen: "Informe semanal en PDF (proyección semanal).",
      contenido: "• Ver PDF adjunto.\n",
      pdfUrl:
        "/boletines/05-01-2026%20-%20Informe%20de%20proyeccion%20semanal%20-%20APODACA%20KAPITAL.pdf",
    },
    {
      id: "2026-w01",
      titulo: "Boletín semanal — Semana 1 (2026)",
      fecha: "05 Ene 2026",
      resumen: "Resumen de mercado, performance del fondo y próximos eventos.",
      contenido:
        "• Mercado: ...\n" +
        "• Fondo: ...\n" +
        "• Riesgos: ...\n" +
        "• Próxima semana: ...\n",
    },
    {
      id: "2026-w02",
      titulo: "Boletín semanal — Semana 2 (2026)",
      fecha: "12 Ene 2026",
      resumen: "Seguimiento de tesis, cambios relevantes y notas del gestor.",
      contenido:
        "• Mercado: ...\n" +
        "• Fondo: ...\n" +
        "• Cambios: ...\n" +
        "• Observaciones: ...\n",
    },
  ],
};
