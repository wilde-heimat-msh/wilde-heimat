import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportUrkundePdf(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#fdf8f0",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
  pdf.save(filename);
}

export function urkundePdfFilename(pate: string, urkundenNr: string): string {
  const safeName = pate.trim().replace(/\s+/g, "-").replace(/[^\w\-äöüÄÖÜß]/g, "") || "Patenschaft";
  const safeNr = urkundenNr.replace(/[^\w\-]/g, "");
  return `Patenschaftsurkunde-${safeName}-${safeNr}.pdf`;
}
