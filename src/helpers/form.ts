import { rgb, degrees } from "pdf-lib";
// Función para limpiar los campos del PDF antes de imprimir la info
export function cleanPDF(page) {
  // Comprobante
  page.drawRectangle({
    x: 167.5,
    y: 390,
    width: 90,
    height: 16,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Emission Date
  page.drawRectangle({
    x: 167.5,
    y: 600,
    width: 80,
    height: 16,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Social reason
  page.drawRectangle({
    x: 245.5,
    y: 130,
    width: 100,
    height: 16,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Fiscal Agent
  page.drawRectangle({
    x: 244,
    y: 376,
    width: 100,
    height: 16,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Fiscal Period
  page.drawRectangle({
    x: 244,
    y: 587,
    width: 100,
    height: 16,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Address
  page.drawRectangle({
    x: 286,
    y: 150,
    width: 300,
    height: 16,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Subject social reason
  page.drawRectangle({
    x: 325.2,
    y: 173,
    width: 100,
    height: 12,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // RIF
  page.drawRectangle({
    x: 320,
    y: 475,
    width: 100,
    height: 10,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Parchear todos los campos de producto antes de imprimir
  // Date
  page.drawRectangle({
    x: 385,
    y: 79.3,
    width: 46,
    height: 8.5,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Billing Information; Number
  page.drawRectangle({
    x: 385,
    y: 127.3,
    width: 46,
    height: 8.5,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Control Number
  page.drawRectangle({
    x: 385,
    y: 177.3,
    width: 46,
    height: 8.5,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Debit Note Number
  page.drawRectangle({
    x: 385,
    y: 226.3,
    width: 46,
    height: 8.5,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Credit Note Number
  page.drawRectangle({
    x: 385,
    y: 284.3,
    width: 42,
    height: 8.5,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Transaction Type
  page.drawRectangle({
    x: 385,
    y: 339.3,
    width: 38,
    height: 8.5,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Billing Information; 'Affected' Number
  page.drawRectangle({
    x: 385,
    y: 385.3,
    width: 38,
    height: 8.5,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Total
  page.drawRectangle({
    x: 385,
    y: 430,
    width: 45,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // 'Compras sin derecho a Crédito I.V.A
  page.drawRectangle({
    x: 385,
    y: 484,
    width: 45,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  /* Compras internas e importaciones */
  // Base imponible
  page.drawRectangle({
    x: 385,
    y: 546,
    width: 45,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });

  // Impuesto I.V.A
  page.drawRectangle({
    x: 385,
    y: 642,
    width: 45,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // I.V.A Retenido
  page.drawRectangle({
    x: 385,
    y: 690,
    width: 45,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });

  /* FINAL 'RESULTS' ROW */
  // Total Compras Incluyendo el I.V.A
  page.drawRectangle({
    x: 430,
    y: 430,
    width: 50,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });

  // Compras sin derecho a Crédito I.V.A
  page.drawRectangle({
    x: 430,
    y: 484,
    width: 50,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });

  // Base imponible
  page.drawRectangle({
    x: 430,
    y: 544,
    width: 46,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });

  // Impuesto I.V.A
  page.drawRectangle({
    x: 430,
    y: 642,
    width: 46,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });

  // I.V.A Retenido
  page.drawRectangle({
    x: 430,
    y: 690,
    width: 46,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });

  /* Misc */
  // Total retención
  page.drawRectangle({
    x: 465,
    y: 690,
    width: 45,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });
  // Total a pagar
  page.drawRectangle({
    x: 485,
    y: 690,
    width: 45,
    height: 9,
    color: rgb(1, 1, 1),
    rotate: degrees(90)
  });


}
