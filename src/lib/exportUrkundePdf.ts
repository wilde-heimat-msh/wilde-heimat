import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

type PdfRenderOptions = {
  backgroundColor?: string;
};

async function renderCanvas(element: HTMLElement, backgroundColor: string) {
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor,
    logging: false,
  });
}

function canvasToPdf(canvas: HTMLCanvasElement, singlePage = false): jsPDF {
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = 210;
  const pageHeight = 297;
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (singlePage || imgHeight <= pageHeight) {
    pdf.addImage(imgData, "PNG", 0, 0, singlePage ? pageWidth : imgWidth, singlePage ? pageHeight : imgHeight);
    return pdf;
  }

  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf;
}

export async function renderElementToPdfBlob(
  element: HTMLElement,
  options: PdfRenderOptions = {}
): Promise<Blob> {
  const canvas = await renderCanvas(element, options.backgroundColor ?? "#ffffff");
  const pdf = canvasToPdf(canvas, false);
  return pdf.output("blob");
}

export async function renderUrkundeToPdfBlob(element: HTMLElement): Promise<Blob> {
  const canvas = await renderCanvas(element, "#fdf8f0");
  const pdf = canvasToPdf(canvas, true);
  return pdf.output("blob");
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("PDF konnte nicht gelesen werden."));
        return;
      }
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("PDF konnte nicht kodiert werden."));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("PDF konnte nicht gelesen werden."));
    reader.readAsDataURL(blob);
  });
}

export async function exportHtmlToPdf(element: HTMLElement, filename: string) {
  const blob = await renderElementToPdfBlob(element);
  downloadPdfBlob(blob, filename);
}

export async function exportUrkundePdf(element: HTMLElement, filename: string) {
  const blob = await renderUrkundeToPdfBlob(element);
  downloadPdfBlob(blob, filename);
}

function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function urkundePdfFilename(pate: string, urkundenNr: string): string {
  const safeName = pate.trim().replace(/\s+/g, "-").replace(/[^\w\-äöüÄÖÜß]/g, "") || "Patenschaft";
  const safeNr = urkundenNr.replace(/[^\w\-]/g, "");
  return `Patenschaftsurkunde-${safeName}-${safeNr}.pdf`;
}
