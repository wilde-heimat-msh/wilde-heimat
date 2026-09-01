import { renderUrkundeToPdfBlob } from "@/lib/exportUrkundePdf";

const PRINT_PREP_TIMEOUT_MS = 3000;
const PRINT_CLEANUP_MS = 120_000;

async function waitForImage(img: HTMLImageElement, timeoutMs: number): Promise<void> {
  if (img.complete) return;

  await Promise.race([
    new Promise<void>((resolve) => {
      img.addEventListener("load", () => resolve(), { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
    }),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

async function waitForUrkundePrintAssets(root: ParentNode): Promise<void> {
  const prepare = (async () => {
    await document.fonts.ready;

    const images = root.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(async (img) => {
        img.loading = "eager";
        await waitForImage(img, 1500);
        try {
          await img.decode();
        } catch {
          /* trotzdem drucken */
        }
      })
    );
  })();

  await Promise.race([
    prepare,
    new Promise<void>((resolve) => setTimeout(resolve, PRINT_PREP_TIMEOUT_MS)),
  ]);
}

function getUrkundePrintElement(): HTMLElement {
  const frame = document.querySelector(".admin-urkunden-print-source .urkunde-a4-presentation");
  if (!frame || !(frame instanceof HTMLElement)) {
    throw new Error("Urkunde nicht bereit");
  }
  return frame;
}

/**
 * Druck über dieselbe 1-seitige PDF wie „PDF speichern“ / E-Mail-Anhang.
 * Safari-HTML-Druck (window.print auf der Admin-Seite) erzeugt sonst oft 2 Seiten.
 */
export async function printUrkundeDocument(): Promise<void> {
  const article = getUrkundePrintElement();
  await waitForUrkundePrintAssets(article);

  const blob = await renderUrkundeToPdfBlob(article);
  const url = URL.createObjectURL(blob);

  await new Promise<void>((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", "Patenschaftsurkunde drucken");
    iframe.setAttribute(
      "style",
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden"
    );

    const cleanup = () => {
      URL.revokeObjectURL(url);
      iframe.remove();
    };

    const fail = (message: string) => {
      cleanup();
      reject(new Error(message));
    };

    iframe.addEventListener(
      "load",
      () => {
        const win = iframe.contentWindow;
        if (!win) {
          fail("Druckfenster konnte nicht geöffnet werden.");
          return;
        }

        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve();
        };

        win.addEventListener("afterprint", finish, { once: true });
        window.setTimeout(finish, PRINT_CLEANUP_MS);

        window.setTimeout(() => {
          win.focus();
          win.print();
          window.setTimeout(finish, 1500);
        }, 250);
      },
      { once: true }
    );

    iframe.addEventListener(
      "error",
      () => {
        fail("PDF für den Druck konnte nicht geladen werden.");
      },
      { once: true }
    );

    document.body.appendChild(iframe);
    iframe.src = url;
  });
}
