/**
 * Lokale Vorschau der Vektor-Urkunde (Druckseite + PDF).
 * Voraussetzung: `npm run dev` läuft auf Port 3000.
 */
import { createHmac } from "crypto";
import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawn } from "child_process";
import puppeteer from "puppeteer";

const BASE = process.env.URKUNDE_PDF_BASE_URL ?? "http://127.0.0.1:3000";
const SECRET =
  process.env.ADMIN_SESSION_SECRET ??
  process.env.ADMIN_URKUNDEN_PASSWORD ??
  "dev-urkunde-print-secret";

const data = {
  pate: "Max Mustermann",
  waschbaer: "Pedro",
  waschbaerSlug: "pedro",
  waschbaerFoto: "/photos/waschbaeren/pedro.png",
  stufeId: "silber",
  ausgestelltAm: "2026-06-22",
  urkundenNr: "WH-2026-0042",
  ort: "Mansfeld-Südharz",
  unterzeichnerin: "Julia Rothmann",
  funktion: "Gründerin, Wilde Heimat",
};

function signToken(payload) {
  const body = Buffer.from(
    JSON.stringify({ data: payload, exp: Date.now() + 5 * 60 * 1000 }),
    "utf8"
  ).toString("base64url");
  const signature = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function openPath(target) {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawn(cmd, [target], { detached: true, stdio: "ignore" }).unref();
}

async function main() {
  const token = signToken(data);
  const printUrl = `${BASE}/admin/urkunden/print?t=${encodeURIComponent(token)}`;
  console.log("Druckvorschau:", printUrl);

  const health = await fetch(BASE).catch(() => null);
  if (!health?.ok && health?.status !== 404) {
    console.error("Dev-Server nicht erreichbar. Bitte zuerst `npm run dev` starten.");
    process.exit(1);
  }

  openPath(printUrl);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    await page.emulateMediaType("print");
    const res = await page.goto(printUrl, { waitUntil: "networkidle0", timeout: 60_000 });
    if (!res?.ok()) {
      throw new Error(`Druckseite Status ${res?.status()}`);
    }
    await page.waitForSelector(".urkunde-print-root article", { timeout: 30_000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    const out = join(tmpdir(), "wilde-heimat-urkunde-vektor.pdf");
    writeFileSync(out, pdf);
    console.log("Vektor-PDF gespeichert:", out);
    openPath(out);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
