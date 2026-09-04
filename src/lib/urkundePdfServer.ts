import type { Browser } from "puppeteer-core";
import type { PatenschaftUrkundeDaten } from "@/data/patenschaften";
import { buildUrkundePrintHtml } from "@/lib/urkundePrintHtml";

const MIN_PDF_BYTES = 8_000;

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

/** Erzeugt eine echte Chromium-Vektor-PDF aus self-contained HTML. */
export async function renderUrkundeVectorPdf(
  data: PatenschaftUrkundeDaten
): Promise<Buffer> {
  const html = await buildUrkundePrintHtml(data);
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "load",
      timeout: 45_000,
    });

    await page.waitForSelector("article.sheet", { timeout: 15_000 });

    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map(async (img) => {
          if (img.complete && img.naturalWidth > 0) return;
          await new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          });
        })
      );
    });

    const textLen = await page.$eval("article.sheet", (el) => (el.textContent ?? "").trim().length);
    if (textLen < 40) {
      throw new Error("Urkunde wurde nicht vollständig gerendert.");
    }

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
