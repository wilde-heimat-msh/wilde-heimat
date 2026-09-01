import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import {
  URKUNDE_A4_HEIGHT_PX,
  URKUNDE_A4_WIDTH_PX,
  URKUNDE_PDF_EXPORT_SCALE,
} from "@/lib/urkundeScale";

const PDF_EXPORT_SCALE = 2;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

type PdfRenderOptions = {
  backgroundColor?: string;
};

function stripShadows(root: HTMLElement) {
  root.style.boxShadow = "none";
  root.style.textShadow = "none";
  root.style.filter = "none";
  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    el.style.boxShadow = "none";
    el.style.textShadow = "none";
    el.style.filter = "none";
  });
}

const HIDDEN_EXPORT_SOURCE_SELECTOR =
  ".admin-urkunden-print-source, .admin-paten-dokument-export-source";

/** Export-Quelle ist per CSS unsichtbar – html2canvas braucht sie kurz sichtbar. */
function revealPrintSourceForCapture(element: HTMLElement): () => void {
  const root = element.closest<HTMLElement>(HIDDEN_EXPORT_SOURCE_SELECTOR);
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

function unhideCloneForCapture(cloned: HTMLElement) {
  cloned.style.visibility = "visible";
  let parent = cloned.parentElement;
  while (parent) {
    if (
      parent.classList.contains("admin-urkunden-print-source") ||
      parent.classList.contains("admin-paten-dokument-export-source")
    ) {
      parent.style.visibility = "visible";
      break;
    }
    parent = parent.parentElement;
  }
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

function prepareUrkundeCloneForCapture(cloned: HTMLElement) {
  cloned.style.overflow = "visible";
  cloned.style.height = "auto";
  cloned.style.maxHeight = "none";
  cloned.classList.remove("overflow-hidden");

  cloned.querySelectorAll<HTMLElement>("*").forEach((el) => {
    el.classList.remove("overflow-hidden");
    if (getComputedStyle(el).overflow === "hidden") {
      el.style.overflow = "visible";
    }
  });
}

async function renderCanvas(
  element: HTMLElement,
  backgroundColor: string,
  scale = PDF_EXPORT_SCALE,
  options: { fullHeight?: boolean } = {}
) {
  const restoreVisibility = revealPrintSourceForCapture(element);

  try {
    const canvasOptions: Parameters<typeof html2canvas>[1] = {
      scale,
      useCORS: true,
      backgroundColor,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      onclone: (_doc, cloned) => {
        stripShadows(cloned);
        unhideCloneForCapture(cloned);
        if (options.fullHeight) {
          prepareUrkundeCloneForCapture(cloned);
        }
      },
    };

    if (!options.fullHeight) {
      canvasOptions.width = element.offsetWidth || URKUNDE_A4_WIDTH_PX;
      canvasOptions.height = element.offsetHeight || URKUNDE_A4_HEIGHT_PX;
    }

    return await html2canvas(element, canvasOptions);
  } finally {
    restoreVisibility();
  }
}

function parseHexBackground(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return [255, 255, 255];
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function canvasToFitSingleA4Page(
  canvas: HTMLCanvasElement,
  backgroundColor = "#ffffff"
): jsPDF {
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = A4_WIDTH_MM;
  const pageHeight = A4_HEIGHT_MM;
  const imgAspect = canvas.width / canvas.height;
  const pageAspect = pageWidth / pageHeight;

  let drawWidth: number;
  let drawHeight: number;
  let offsetX = 0;
  let offsetY = 0;

  if (imgAspect > pageAspect) {
    drawWidth = pageWidth;
    drawHeight = pageWidth / imgAspect;
    offsetY = (pageHeight - drawHeight) / 2;
  } else {
    drawHeight = pageHeight;
    drawWidth = pageHeight * imgAspect;
    offsetX = (pageWidth - drawWidth) / 2;
  }

  const [r, g, b] = parseHexBackground(backgroundColor);
  pdf.setFillColor(r, g, b);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  pdf.addImage(imgData, "PNG", offsetX, offsetY, drawWidth, drawHeight);
  return pdf;
}

function canvasToPdf(canvas: HTMLCanvasElement, singlePage = false): jsPDF {
  if (singlePage) {
    return canvasToFitSingleA4Page(canvas);
  }

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = A4_WIDTH_MM;
  const pageHeight = A4_HEIGHT_MM;
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
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
  await waitForElementAssets(element);
  const canvas = await renderCanvas(element, "#fdf8f0", URKUNDE_PDF_EXPORT_SCALE, {
    fullHeight: true,
  });
  const pdf = canvasToFitSingleA4Page(canvas, "#fdf8f0");
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
