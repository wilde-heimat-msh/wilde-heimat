import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import type { PatenschaftUrkundeDaten } from "@/data/patenschaften";
import {
  URKUNDE_A4_HEIGHT_PX,
  URKUNDE_A4_WIDTH_PX,
  URKUNDE_PDF_EXPORT_SCALE,
  urkundePdfFilename,
} from "@/lib/urkundeScale";

export { urkundePdfFilename };

const PDF_EXPORT_SCALE = 2;
/** Server-Vektor-PDF: nach dieser Zeit Client-Fallback. */
const VECTOR_PDF_TIMEOUT_MS = 18_000;

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

async function waitForElementAssets(element: HTMLElement): Promise<void> {
  await document.fonts.ready;

  const images = element.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(async (img) => {
      img.loading = "eager";
      if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        });
      }
      try {
        await img.decode();
      } catch {
        /* trotzdem exportieren */
      }
    })
  );
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

function canvasToPdf(
  canvas: HTMLCanvasElement,
  singlePage = false,
  format: "PNG" | "JPEG" = "PNG"
): jsPDF {
  const imgData =
    format === "JPEG"
      ? canvas.toDataURL("image/jpeg", 0.95)
      : canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = 210;
  const pageHeight = 297;
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (singlePage || imgHeight <= pageHeight) {
    pdf.addImage(
      imgData,
      format,
      0,
      0,
      singlePage ? pageWidth : imgWidth,
      singlePage ? pageHeight : imgHeight
    );
    return pdf;
  }

  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, format, 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, format, 0, position, imgWidth, imgHeight);
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

async function renderUrkundeRasterFallback(element: HTMLElement): Promise<Blob> {
  await waitForElementAssets(element);
  const canvas = await renderCanvas(element, "#fdf8f0", URKUNDE_PDF_EXPORT_SCALE);
  const pdf = canvasToPdf(canvas, true, "JPEG");
  return pdf.output("blob");
}

async function renderUrkundeVectorFromApi(
  data: PatenschaftUrkundeDaten,
  timeoutMs: number
): Promise<Blob> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

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

    return res.blob();
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Urkunden-PDF: zuerst schneller hochauflösender Client-Export.
 * Ohne DOM-Fallback: Vektor über Chromium-API.
 */
export async function renderUrkundeToPdfBlob(
  data: PatenschaftUrkundeDaten,
  fallbackElement?: HTMLElement | null
): Promise<Blob> {
  if (fallbackElement) {
    return renderUrkundeRasterFallback(fallbackElement);
  }
  return renderUrkundeVectorFromApi(data, VECTOR_PDF_TIMEOUT_MS);
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
  filename: string,
  fallbackElement?: HTMLElement | null
) {
  const blob = await renderUrkundeToPdfBlob(data, fallbackElement);
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
