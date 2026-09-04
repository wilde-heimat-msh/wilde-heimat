/**
 * Vorschau Christian Hoffmann + Boba – echte Vektor-PDF + Screenshot.
 * npm run preview:hoffmann-boba
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";
import { createDefaultUrkundeDaten } from "../src/data/patenschaften";
import { buildUrkundePrintHtml } from "../src/lib/urkundePrintHtml";
import { renderUrkundeVectorPdf } from "../src/lib/urkundePdfServer";
import puppeteer from "puppeteer";

function openPath(target: string) {
  const cmd =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawn(cmd, [target], { detached: true, stdio: "ignore" }).unref();
}

async function main() {
  const data = createDefaultUrkundeDaten({
    pate: "Christian Hoffmann",
    waschbaer: "Boba",
    waschbaerSlug: "boba",
    waschbaerFoto: "/photos/waschbaeren/boba-portrait.jpg",
    stufeId: "silber",
    urkundenNr: "WH-2026-BOBA",
  });

  console.log("Erzeuge Vektor-PDF …");
  const pdf = await renderUrkundeVectorPdf(data);
  const outPdf = join(process.cwd(), "tmp-urkunde-hoffmann-boba.pdf");
  writeFileSync(outPdf, pdf);
  console.log("PDF:", outPdf, `(${pdf.byteLength} Bytes)`);

  const html = await buildUrkundePrintHtml(data);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "load" });
    const outPng = join(process.cwd(), "tmp-urkunde-hoffmann-boba.png");
    await page.screenshot({ path: outPng, fullPage: false });
    console.log("PNG:", outPng);
    openPath(outPng);
    openPath(outPdf);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
