import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

type PdfRenderOptions = {
  backgroundColor?: string;
  /** Niedrigere Auflösung für E-Mail-Anhänge (kleinere Dateien). */
  forMail?: boolean;
};

/**
 * html2canvas 1.x kann Tailwind-4-Farben (oklab/oklch) in Stylesheets nicht parsen.
 * Vor dem Rendern Stylesheets im Clone entfernen und berechnete RGB-Werte inline setzen.
 */
const HTML2CANVAS_INLINE_PROPS = [
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "z-index",
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "margin",
  "padding",
  "border",
  "border-width",
  "border-style",
  "border-color",
  "border-radius",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "background",
  "background-color",
  "background-image",
  "background-size",
  "background-position",
  "background-repeat",
  "color",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-transform",
  "text-decoration",
  "white-space",
  "word-break",
  "flex",
  "flex-direction",
  "flex-wrap",
  "flex-grow",
  "flex-shrink",
  "align-items",
  "align-self",
  "justify-content",
  "justify-self",
  "gap",
  "grid-template-columns",
  "grid-column",
  "grid-row",
  "object-fit",
  "object-position",
  "opacity",
  "box-shadow",
  "overflow",
  "overflow-wrap",
  "transform",
  "transform-origin",
  "vertical-align",
  "list-style",
  "list-style-type",
  "border-collapse",
  "table-layout",
  "fill",
  "stroke",
  "stroke-width",
] as const;

const MODERN_COLOR_RE = /oklab|oklch|color-mix|lab\(|lch\(/i;

let colorProbe: HTMLSpanElement | null = null;

function resolveModernColor(value: string, property: "color" | "background-color" | "border-color"): string {
  if (!MODERN_COLOR_RE.test(value)) return value;
  if (typeof document === "undefined") return value;

  if (!colorProbe) {
    colorProbe = document.createElement("span");
    colorProbe.style.position = "absolute";
    colorProbe.style.visibility = "hidden";
    colorProbe.style.pointerEvents = "none";
    document.body.appendChild(colorProbe);
  }

  colorProbe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;";
  colorProbe.style.setProperty(property, value);
  const resolved = window.getComputedStyle(colorProbe).getPropertyValue(property).trim();
  return resolved && !MODERN_COLOR_RE.test(resolved) ? resolved : value;
}

function stripUnsupportedStylesheets(clonedDoc: Document) {
  clonedDoc.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => {
    node.parentNode?.removeChild(node);
  });
}

function inlineResolvedStyles(source: Element, target: HTMLElement) {
  const computed = window.getComputedStyle(source);

  for (const prop of HTML2CANVAS_INLINE_PROPS) {
    let value = computed.getPropertyValue(prop).trim();
    if (!value) continue;

    if (prop === "color" || prop === "background-color" || prop === "border-color") {
      value = resolveModernColor(value, prop);
    } else if (MODERN_COLOR_RE.test(value)) {
      continue;
    }

    target.style.setProperty(prop, value);
  }
}

function prepareHtml2CanvasClone(
  originalRoot: HTMLElement,
  clonedRoot: HTMLElement,
  clonedDoc: Document
) {
  stripUnsupportedStylesheets(clonedDoc);

  const originals = [originalRoot, ...originalRoot.querySelectorAll("*")];
  const clones = [clonedRoot, ...clonedRoot.querySelectorAll("*")];
  const count = Math.min(originals.length, clones.length);

  for (let index = 0; index < count; index += 1) {
    inlineResolvedStyles(originals[index], clones[index] as HTMLElement);
  }
}

async function renderCanvas(element: HTMLElement, backgroundColor: string, scale = 2) {
  return html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor,
    logging: false,
    onclone: (clonedDoc, clonedElement) => {
      prepareHtml2CanvasClone(element, clonedElement, clonedDoc);
    },
  });
}

function canvasToPdf(
  canvas: HTMLCanvasElement,
  singlePage = false,
  options: { forMail?: boolean } = {}
): jsPDF {
  const format = options.forMail ? "image/jpeg" : "image/png";
  const quality = options.forMail ? 0.82 : undefined;
  const imgData = canvas.toDataURL(format, quality);
  const imageType = options.forMail ? "JPEG" : "PNG";
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = 210;
  const pageHeight = 297;
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (singlePage || imgHeight <= pageHeight) {
    pdf.addImage(
      imgData,
      imageType,
      0,
      0,
      singlePage ? pageWidth : imgWidth,
      singlePage ? pageHeight : imgHeight
    );
    return pdf;
  }

  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(imgData, imageType, 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, imageType, 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf;
}

export async function renderElementToPdfBlob(
  element: HTMLElement,
  options: PdfRenderOptions = {}
): Promise<Blob> {
  const scale = options.forMail ? 1.35 : 2;
  const canvas = await renderCanvas(element, options.backgroundColor ?? "#ffffff", scale);
  const pdf = canvasToPdf(canvas, false, { forMail: options.forMail });
  return pdf.output("blob");
}

export async function renderUrkundeToPdfBlob(
  element: HTMLElement,
  options: Pick<PdfRenderOptions, "forMail"> = {}
): Promise<Blob> {
  const scale = options.forMail ? 1.35 : 2;
  const canvas = await renderCanvas(element, "#fdf8f0", scale);
  const pdf = canvasToPdf(canvas, true, { forMail: options.forMail });
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
