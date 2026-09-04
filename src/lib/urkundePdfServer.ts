import type { Browser } from "puppeteer-core";
import { siteConfig } from "@/data/site";
import type { PatenschaftUrkundeDaten } from "@/data/patenschaften";
import { signUrkundePrintToken } from "@/lib/urkundePrintToken";

const MIN_PDF_BYTES = 8_000;

function getAppBaseUrl(): string {
  if (process.env.URKUNDE_PDF_BASE_URL) {
    return process.env.URKUNDE_PDF_BASE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_ENV === "production") {
    return siteConfig.url.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "http://127.0.0.1:3000";
}

function printPageHeaders(): Record<string, string> {
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (!bypass) return {};
  return {
    "x-vercel-protection-bypass": bypass,
    "x-vercel-set-bypass-cookie": "true",
  };
}

/** Überschreibt Print-CSS, das sonst eine leere PDF erzeugt (visibility:hidden). */
const PDF_PRINT_OVERRIDE_CSS = `
@media print {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    width: 210mm !important;
    height: 297mm !important;
  }
  body * {
    visibility: visible !important;
  }
  body > :not(main) {
    display: none !important;
  }
  body > main {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .urkunde-print-root {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: #fdf8f0 !important;
  }
  .urkunde-print-root,
  .urkunde-print-root * {
    visibility: visible !important;
  }
  .urkunde-print-root article {
    box-shadow: none !important;
    border-radius: 0 !important;
  }
}
`;

async function launchBrowser(): Promise<Browser> {
  const isVercel = Boolean(process.env.VERCEL);

  if (isVercel) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    chromium.setGraphicsMode = false;

    return puppeteer.launch({
      args: [...chromium.args, "--font-render-hinting=none", "--hide-scrollbars"],
      defaultViewport: { width: 794, height: 1123, deviceScaleFactor: 1 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const puppeteer = await import("puppeteer");
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  }) as unknown as Browser;
}

function assertValidPdf(pdf: Buffer): void {
  if (pdf.byteLength < MIN_PDF_BYTES) {
    throw new Error(
      `PDF ist leer oder unvollständig (${pdf.byteLength} Bytes). Bitte erneut versuchen.`
    );
  }
  if (pdf.subarray(0, 4).toString("utf8") !== "%PDF") {
    throw new Error("Server lieferte keine gültige PDF-Datei.");
  }
}

/** Erzeugt eine echte Chromium-Vektor-PDF (Text/SVG bleiben scharf). */
export async function renderUrkundeVectorPdf(
  data: PatenschaftUrkundeDaten
): Promise<Buffer> {
  const token = signUrkundePrintToken(data);
  const baseUrl = getAppBaseUrl();
  const printUrl = `${baseUrl}/admin/urkunden/print?t=${encodeURIComponent(token)}`;

  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders(printPageHeaders());
    // Wichtig: NICHT emulateMediaType("print") vor dem Laden –
    // sonst greift visibility:hidden und die PDF wird weiß/leer.

    const htmlRes = await fetch(printUrl, {
      headers: {
        Accept: "text/html",
        ...printPageHeaders(),
      },
      cache: "no-store",
    });

    if (!htmlRes.ok) {
      throw new Error(
        `Druckseite nicht erreichbar (HTTP ${htmlRes.status}) unter ${baseUrl}.`
      );
    }

    const html = await htmlRes.text();
    if (!html.includes("urkunde-print-root") || !html.includes("<article")) {
      throw new Error("Druckseite ohne Urkunden-Inhalt empfangen.");
    }

    const htmlWithBase = html.includes("<base")
      ? html
      : html.replace(/<head([^>]*)>/i, `<head$1><base href="${baseUrl}/">`);

    await page.setContent(htmlWithBase, {
      waitUntil: "load",
      timeout: 45_000,
    });

    await page.waitForSelector(".urkunde-print-root article", { timeout: 20_000 });
    await page.addStyleTag({ content: PDF_PRINT_OVERRIDE_CSS });

    await page.evaluate(async () => {
      await document.fonts.ready;
      const images = Array.from(document.images);
      await Promise.all(
        images.map(async (img) => {
          if (!img.getAttribute("src")) return;
          if (img.complete && img.naturalWidth > 0) return;
          await new Promise<void>((resolve) => {
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          });
        })
      );
    });

    const articleBox = await page.$eval(".urkunde-print-root article", (el) => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height, text: (el.textContent ?? "").trim().length };
    });

    if (articleBox.width < 100 || articleBox.height < 100 || articleBox.text < 20) {
      throw new Error("Urkunde wurde nicht vollständig gerendert.");
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const pdf = Buffer.from(
      await page.pdf({
        width: "210mm",
        height: "297mm",
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      })
    );

    assertValidPdf(pdf);
    return pdf;
  } finally {
    await browser.close();
  }
}
