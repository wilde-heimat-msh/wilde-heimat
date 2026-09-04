import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import type { PatenschaftUrkundeDaten } from "@/data/patenschaften";
import {
  URKUNDE_A4_HEIGHT_PX,
  URKUNDE_A4_WIDTH_PX,
  urkundePdfFilename,
} from "@/lib/urkundeScale";

export { urkundePdfFilename };

const PDF_EXPORT_SCALE = 2;
/** Vektor-PDF auf dem Server kann beim ersten Aufruf länger dauern. */
const VECTOR_PDF_TIMEOUT_MS = 55_000;

type PdfRenderOptions = {
  backgroundColor?: string;
};

const ADMIN_PRINT_SOURCE_SELECTOR =
  ".admin-urkunden-print-source, .admin-paten-dokument-export-source";

/** Versteckte Quelle: kurz sichtbar, damit html2canvas symmetrisch erfasst. */
function revealPrintSourceForCapture(element: HTMLElement): () => void {
  const root = element.closest<HTMLElement>(ADMIN_PRINT_SOURCE_SELECTOR);
  if (!root) {
    return () => {};
  }

  const prevVisibility = root.style.visibility;
  root.style.visibility = "visible";
  void root.offsetHeight;

  return () => {
    if (prevVisibility) {
      root.style.visibility = prevVisibility;
    } else {
      root.style.removeProperty("visibility");
    }
  };
}

async function renderCanvas(
  element: HTMLElement,
  backgroundColor: string,
  scale = PDF_EXPORT_SCALE
) {
  const restoreVisibility = revealPrintSourceForCapture(element);

  try {
    return await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: element.offsetWidth || URKUNDE_A4_WIDTH_PX,
      height: element.offsetHeight || URKUNDE_A4_HEIGHT_PX,
      onclone: (_doc, cloned) => {
        cloned.style.visibility = "visible";
        cloned.style.margin = "0";
        cloned.style.padding = "0";
        cloned.style.boxShadow = "none";
      },
    });
  } finally {
    restoreVisibility();
  }
}

function canvasToPdf(canvas: HTMLCanvasElement, singlePage = false): jsPDF {
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = 210;
  const pageHeight = 297;
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (singlePage || imgHeight <= pageHeight) {
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      singlePage ? pageWidth : imgWidth,
      singlePage ? pageHeight : imgHeight
    );
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

/** Nur Vektor-PDF über Chromium – Text/SVG bleiben beim Zoomen scharf. */
export async function renderUrkundeToPdfBlob(
  data: PatenschaftUrkundeDaten
): Promise<Blob> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), VECTOR_PDF_TIMEOUT_MS);

  try {
    const res = await fetch("/api/admin/urkunden/pdf", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
      signal: controller.signal,
    });

    if (!res.ok) {
      let message = "Vektor-PDF konnte nicht erzeugt werden.";
      try {
        const json = (await res.json()) as { error?: string };
        if (json.error) message = json.error;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    const blob = await res.blob();
    if (blob.size < 8000) {
      let message = `PDF ist leer oder unvollständig (${blob.size} Bytes).`;
      try {
        const text = await blob.text();
        const json = JSON.parse(text) as { error?: string };
        if (json.error) message = json.error;
      } catch {
        /* keine JSON-Fehlermeldung */
      }
      throw new Error(message);
    }

    const header = await blob.slice(0, 4).text();
    if (header !== "%PDF") {
      throw new Error("Server lieferte keine gültige PDF-Datei.");
    }

    return blob;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "Vektor-PDF dauerte zu lange (Timeout). Bitte erneut versuchen."
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
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

export async function exportUrkundePdf(
  data: PatenschaftUrkundeDaten,
  filename: string
) {
  const blob = await renderUrkundeToPdfBlob(data);
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
