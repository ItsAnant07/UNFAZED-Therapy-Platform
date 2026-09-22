const PDFDocument = require("pdfkit");

function createInvoice(res, payment) {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=unfazed-invoice.pdf");
  doc.pipe(res);
  doc.fontSize(24).text("unfazed.", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text("Payment Invoice");
  doc.moveDown();
  doc.text(`Transaction: ${payment.gateway_transaction_id || "N/A"}`);
  doc.text(`Amount: INR ${payment.amount || 0}`);
  doc.text(`Status: ${payment.status}`);
  doc.end();
}
module.exports = { createInvoice };
