import { readFile } from "fs/promises";
import path from "path";
import {
  getPatenschaftStufe,
  patenschaftUrkundeMedallionSvg,
  patenschaftUrkundeStufeRender,
  type PatenschaftUrkundeDaten,
} from "@/data/patenschaften";
import { vereinUnterschrift } from "@/data/vereinUnterschrift";
import { formatAbsoluteDateDe } from "@/lib/relativeTime";
import { siteConfig } from "@/data/site";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mimeForPath(filePath: string): string {
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

async function assetToDataUri(assetPath: string): Promise<string> {
  if (!assetPath) return "";
  if (assetPath.startsWith("data:")) return assetPath;

  if (assetPath.startsWith("/")) {
    const localPath = path.join(process.cwd(), "public", assetPath.replace(/^\//, ""));
    try {
      const buf = await readFile(localPath);
      return `data:${mimeForPath(localPath)};base64,${buf.toString("base64")}`;
    } catch {
      /* remote fallback below */
    }
  }

  const abs = assetPath.startsWith("http")
    ? assetPath
    : `${siteConfig.url.replace(/\/$/, "")}${assetPath.startsWith("/") ? "" : "/"}${assetPath}`;

  const res = await fetch(abs, { cache: "no-store" });
  if (!res.ok) return "";
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = res.headers.get("content-type") || mimeForPath(assetPath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/** Vollständiges HTML für Chromium – ohne Next.js-Seite, alles inline. */
export async function buildUrkundePrintHtml(data: PatenschaftUrkundeDaten): Promise<string> {
  const render = patenschaftUrkundeStufeRender[data.stufeId];
  const medallion = patenschaftUrkundeMedallionSvg[data.stufeId];
  const stufe = getPatenschaftStufe(data.stufeId);
  const datumLang = formatAbsoluteDateDe(data.ausgestelltAm);
  const manyLeistungen = stufe.leistungen.length >= 4;

  const [logoUri, fotoUri, signatureUri] = await Promise.all([
    assetToDataUri("/logo.svg"),
    assetToDataUri(data.waschbaerFoto || "/photos/waschbaeren/boba-portrait.jpg"),
    assetToDataUri(vereinUnterschrift.imageSrc),
  ]);

  const leistungen = stufe.leistungen
    .map(
      (leistung) => `
      <li style="display:flex;align-items:flex-start;gap:10px;color:#2a3326;line-height:1.35;font-size:${manyLeistungen ? "13px" : "14px"};">
        <span style="margin-top:6px;width:6px;height:6px;border-radius:999px;background:${render.perkDot.backgroundColor};flex-shrink:0;"></span>
        <span>${escapeHtml(leistung)}</span>
      </li>`
    )
    .join("");

  const gruss = data.grussbotschaft?.trim()
    ? `<p style="margin:8px auto 0;max-width:90%;font-size:13px;font-style:italic;color:rgba(42,51,38,0.75);line-height:1.35;">„${escapeHtml(data.grussbotschaft.trim())}“</p>`
    : "";

  const gradientStops = medallion.gradientStops
    .map((stop) => `<stop offset="${stop.offset}" stop-color="${stop.color}" />`)
    .join("");

  const bandStops =
    data.stufeId === "bronze"
      ? [
          ["0%", "#78350f"],
          ["50%", "#b45309"],
          ["100%", "#78350f"],
        ]
      : data.stufeId === "gold"
        ? [
            ["0%", "#d97706"],
            ["50%", "#facc15"],
            ["100%", "#d97706"],
          ]
        : [
            ["0%", "#78716c"],
            ["50%", "#d6d3d1"],
            ["100%", "#78716c"],
          ];

  const bandGradient = bandStops
    .map(([offset, color]) => `<stop offset="${offset}" stop-color="${color}" />`)
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 210mm;
      height: 297mm;
      background: #ffffff;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #2a3326;
    }
    .sheet {
      position: relative;
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      border: 6px double ${render.articleBorder};
      background: linear-gradient(168deg, #fdf8f0 0%, #f5ede0 48%, #efe4d4 100%);
    }
    .inner {
      position: absolute;
      inset: 10px;
      top: 14px;
      bottom: 10px;
      border: 1.5px solid ${render.innerBorder};
      pointer-events: none;
    }
    .corner {
      position: absolute;
      width: 24px;
      height: 24px;
      border-color: ${render.cornerBorder};
    }
    .content {
      position: relative;
      height: calc(100% - 8px);
      display: flex;
      flex-direction: column;
      padding: 24px 36px;
      text-align: center;
    }
  </style>
</head>
<body>
  <article class="sheet">
    <svg viewBox="0 0 800 8" preserveAspectRatio="none" style="display:block;width:100%;height:8px;">
      <defs><linearGradient id="band" x1="0%" y1="0%" x2="100%" y2="0%">${bandGradient}</linearGradient></defs>
      <rect width="800" height="8" fill="url(#band)" />
    </svg>
    <div class="inner"></div>
    <span class="corner" style="top:14px;left:14px;border-top:3px solid;border-left:3px solid;"></span>
    <span class="corner" style="top:14px;right:14px;border-top:3px solid;border-right:3px solid;"></span>
    <span class="corner" style="bottom:14px;left:14px;border-bottom:3px solid;border-left:3px solid;"></span>
    <span class="corner" style="bottom:14px;right:14px;border-bottom:3px solid;border-right:3px solid;"></span>

    <div class="content">
      <header style="flex-shrink:0;">
        <img src="${logoUri}" alt="" width="64" height="64" style="display:block;margin:0 auto;width:64px;height:64px;object-fit:contain;" />
        <p style="margin:6px 0 0;font-size:14px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(42,51,38,0.8);font-weight:500;">Wilde Heimat</p>
        <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6d685e;">Private Initiative · ${escapeHtml(data.ort)}</p>
        <div style="margin:12px 0;display:flex;align-items:center;gap:12px;" aria-hidden="true">
          <div style="height:1px;flex:1;background:linear-gradient(to right, transparent, rgba(120,53,15,0.25), transparent);"></div>
          <span style="color:rgba(146,64,14,0.4);font-size:10px;">✦</span>
          <div style="height:1px;flex:1;background:linear-gradient(to right, transparent, rgba(120,53,15,0.25), transparent);"></div>
        </div>
        <p style="margin:0;font-size:14px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(42,51,38,0.7);font-weight:600;">Patenschaftsurkunde</p>
      </header>

      <main style="flex:1;min-height:0;display:flex;flex-direction:column;padding:16px 0;">
        <div style="flex-shrink:0;">
          <p style="margin:0;font-size:14px;color:#6d685e;">Hiermit bestätigen wir, dass</p>
          <p style="margin:2px 0 0;font-size:28px;font-weight:500;color:#2a3326;line-height:1.15;">${escapeHtml(data.pate)}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6d685e;">Pate/Patin des Waschbären</p>
          <p style="margin:2px 0 0;font-size:32px;font-weight:300;color:#2a3326;line-height:1.1;letter-spacing:-0.02em;">${escapeHtml(data.waschbaer)}</p>
          ${gruss}
        </div>

        <div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:12px 0;">
          <div style="width:100%;">
            <div style="display:grid;grid-template-columns:10.5rem 1fr;gap:20px;align-items:start;">
              <figure style="margin:0;text-align:center;">
                <img src="${fotoUri}" alt="${escapeHtml(data.waschbaer)}" style="display:block;width:100%;aspect-ratio:3/4;object-fit:cover;object-position:center;border-radius:8px;border:2px solid ${render.fotoRahmen.borderColor};" />
                <figcaption style="margin-top:8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6d685e;font-weight:500;">Dein Patentier</figcaption>
              </figure>
              <div style="border:2px solid ${render.panel.borderColor};background:${render.panel.backgroundColor};border-radius:8px;padding:16px;text-align:left;">
                <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#6d685e;font-weight:500;">Patenschaftsstufe</p>
                <div style="margin-top:10px;display:flex;align-items:center;gap:12px;">
                  <svg viewBox="0 0 56 56" width="56" height="56" style="flex-shrink:0;">
                    <defs><linearGradient id="med" x1="8%" y1="8%" x2="92%" y2="92%">${gradientStops}</linearGradient></defs>
                    <circle cx="28" cy="28" r="27" fill="${medallion.ringColor}" />
                    <circle cx="28" cy="28" r="24" fill="url(#med)" stroke="${medallion.borderColor}" stroke-width="2" />
                    <ellipse cx="22" cy="18" rx="10" ry="6" fill="${medallion.highlightColor}" />
                    <text x="28" y="32" text-anchor="middle" font-size="11" font-weight="700" fill="${medallion.textColor}" font-family="system-ui,sans-serif">${escapeHtml(stufe.name)}</text>
                  </svg>
                  <div>
                    <p style="margin:0;font-size:20px;font-weight:600;line-height:1;color:${render.nameColor};">${escapeHtml(stufe.name)}</p>
                    <p style="margin:4px 0 0;font-size:20px;font-weight:300;line-height:1;color:${render.priceColor};">${stufe.preis} €<span style="font-size:12px;color:#6d685e;font-weight:400;"> / Monat</span></p>
                  </div>
                </div>
                <p style="margin:12px 0 0;font-size:13px;font-style:italic;color:#6d685e;line-height:1.35;">${escapeHtml(stufe.tagline)}</p>
                <p style="margin:10px 0 0;font-size:12px;color:rgba(42,51,38,0.75);line-height:1.35;">${escapeHtml(stufe.beschreibung)}</p>
              </div>
            </div>

            <div style="margin-top:20px;border:2px solid ${render.panel.borderColor};background:${render.panel.backgroundColor};border-radius:8px;padding:16px 20px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6d685e;font-weight:500;text-align:left;">Deine Patenschaft beinhaltet</p>
              <ul style="margin:12px 0 0;padding:0;list-style:none;display:grid;gap:10px;">${leistungen}</ul>
            </div>
          </div>
        </div>
      </main>

      <footer style="flex-shrink:0;border-top:1.5px solid rgba(120,53,15,0.15);padding-top:16px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;text-align:left;font-size:13px;margin-bottom:16px;">
          <div>
            <p style="margin:0;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#6d685e;font-weight:500;">Ausgestellt in</p>
            <p style="margin:2px 0 0;font-weight:600;color:#2a3326;">${escapeHtml(data.ort)}</p>
            <p style="margin:8px 0 0;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#6d685e;font-weight:500;">am</p>
            <p style="margin:2px 0 0;font-weight:600;color:#2a3326;">${escapeHtml(datumLang)}</p>
          </div>
          <div style="text-align:right;">
            <p style="margin:0;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#6d685e;font-weight:500;">Urkunden-Nr.</p>
            <p style="margin:2px 0 0;font-weight:600;color:#2a3326;">${escapeHtml(data.urkundenNr)}</p>
            <p style="margin:8px 0 0;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#6d685e;font-weight:500;">Ausgestellt von</p>
            <p style="margin:2px 0 0;font-weight:600;color:#2a3326;">${escapeHtml(data.unterzeichnerin)}</p>
            <p style="margin:0;font-size:11px;color:#6d685e;">${escapeHtml(data.funktion)}</p>
          </div>
        </div>
        <div style="border-top:1px solid rgba(120,53,15,0.1);padding-top:16px;display:flex;justify-content:center;">
          <div style="text-align:center;">
            <img src="${signatureUri}" alt="Unterschrift ${escapeHtml(vereinUnterschrift.name)}" width="212" height="56" style="display:block;margin:0 auto;height:56px;width:auto;max-width:100%;background:transparent;" />
            <p style="margin:4px 0 0;font-weight:500;color:#2a3326;">${escapeHtml(vereinUnterschrift.name)}</p>
            <p style="margin:0;font-size:12px;color:#6d685e;">${escapeHtml(vereinUnterschrift.funktion)}</p>
          </div>
        </div>
      </footer>
    </div>
  </article>
</body>
</html>`;
}
