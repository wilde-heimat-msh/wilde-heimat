import type { Browser } from "puppeteer-core";
import type { PatenschaftUrkundeDaten } from "@/data/patenschaften";
import { signUrkundePrintToken } from "@/lib/urkundePrintToken";

const CHROMIUM_PACK_URL =
  process.env.CHROMIUM_REMOTE_EXEC_PATH ??
  "https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar";

function getAppBaseUrl(): string {
  if (process.env.URKUNDE_PDF_BASE_URL) {
    return process.env.URKUNDE_PDF_BASE_URL.replace(/\/$/, "");
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

async function launchBrowser(): Promise<Browser> {
  const isVercel = Boolean(process.env.VERCEL);

  if (isVercel) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    const puppeteer = await import("puppeteer-core");
    chromium.setGraphicsMode = false;

    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 794, height: 1123, deviceScaleFactor: 1 },
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: true,
    });
  }

  const puppeteer = await import("puppeteer");
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  }) as unknown as Browser;
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
    await page.emulateMediaType("print");

    // HTML serverseitig laden (zuverlässiger als page.goto auf Vercel)
    const htmlRes = await fetch(printUrl, {
      headers: {
        Accept: "text/html",
        ...printPageHeaders(),
      },
      cache: "no-store",
    });

    if (!htmlRes.ok) {
      throw new Error(`Druckseite nicht erreichbar (HTTP ${htmlRes.status}).`);
    }

    const html = await htmlRes.text();
    const htmlWithBase = html.includes("<base")
      ? html
      : html.replace(/<head([^>]*)>/i, `<head$1><base href="${baseUrl}/">`);

    await page.setContent(htmlWithBase, {
      waitUntil: "load",
      timeout: 45_000,
    });

    await page.waitForSelector(".urkunde-print-root article", { timeout: 20_000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      const images = Array.from(document.images);
      await Promise.all(
        images.map(async (img) => {
          if (img.complete) return;
          await new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          });
        })
      );
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
