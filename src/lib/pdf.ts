import type { ContractorSettings } from "@/types";
import type { Customer, Estimate, EstimateItem, Lead } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function generateEstimatePdf(params: {
  settings: ContractorSettings;
  customer: Customer;
  lead: Lead;
  estimate: Estimate;
  items: EstimateItem[];
}): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const { settings, customer, lead, estimate, items } = params;
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(22);
  doc.setTextColor(30, 58, 95);
  doc.text(settings.company_name || "ContractorFlow", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(settings.estimate_template || "Professional Project Estimate", margin, y);
  y += 15;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Customer", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(`${customer.full_name}`, margin, y);
  y += 5;
  doc.text(customer.email, margin, y);
  y += 5;
  doc.text(customer.phone, margin, y);
  y += 5;
  doc.text(customer.address, margin, y);
  y += 12;

  doc.setFontSize(12);
  doc.text("Project", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(`${lead.service_type}`, margin, y);
  y += 5;
  doc.text(`Budget: ${lead.budget_range}`, margin, y);
  y += 5;
  const descLines = doc.splitTextToSize(lead.description, 170);
  doc.text(descLines, margin, y);
  y += descLines.length * 5 + 10;

  autoTable(doc, {
    startY: y,
    head: [["Description", "Qty", "Unit Price", "Line Total"]],
    body: items.map((item) => [
      item.description,
      String(item.quantity),
      formatCurrency(item.unit_price),
      formatCurrency(item.quantity * item.unit_price),
    ]),
    theme: "striped",
    headStyles: { fillColor: [30, 58, 95] },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY ?? y + 40;
  let totalsY = finalY + 10;

  doc.setFontSize(10);
  doc.text(`Subtotal: ${formatCurrency(estimate.subtotal)}`, 140, totalsY);
  totalsY += 6;
  doc.text(`Tax (${settings.tax_rate}%): ${formatCurrency(estimate.tax)}`, 140, totalsY);
  totalsY += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${formatCurrency(estimate.total)}`, 140, totalsY);

  totalsY += 25;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Customer Signature: ___________________________", margin, totalsY);
  doc.text(`Date: ${formatDate(new Date())}`, margin, totalsY + 8);
  doc.text("Contractor Signature: ________________________", 110, totalsY);

  doc.save(`estimate-${customer.full_name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
