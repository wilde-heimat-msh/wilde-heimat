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

const HIDDEN_EXPORT_SOURCE_SELECTOR =
  ".admin-urkunden-print-source, .admin-paten-dokument-export-source";

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

async function renderCanvas(
  element: HTMLElement,
  backgroundColor: string,
  scale = PDF_EXPORT_SCALE,
  options: { preserveShadows?: boolean } = {}
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
      width: element.offsetWidth || URKUNDE_A4_WIDTH_PX,
      height: element.offsetHeight || URKUNDE_A4_HEIGHT_PX,
      onclone: (_doc, cloned) => {
        if (!options.preserveShadows) {
          stripShadows(cloned);
        }
        unhideCloneForCapture(cloned);
      },
    });
  } finally {
    restoreVisibility();
  }
}

/** Urkunde 1:1 auf A4 – exakt wie Vorschau, ohne Skalierung/Letterboxing. */
function canvasToPdfExactA4(canvas: HTMLCanvasElement): jsPDF {
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "PNG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  return pdf;
}

function canvasToPdf(canvas: HTMLCanvasElement, singlePage = false): jsPDF {
  if (singlePage) {
    return canvasToPdfExactA4(canvas);
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
  const canvas = await renderCanvas(element, "#ffffff", URKUNDE_PDF_EXPORT_SCALE, {
    preserveShadows: true,
  });
  const pdf = canvasToPdfExactA4(canvas);
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
