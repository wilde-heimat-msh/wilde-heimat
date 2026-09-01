const PRINT_PREP_TIMEOUT_MS = 3000;

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

async function waitForUrkundePrintAssets(): Promise<void> {
  if (typeof document === "undefined") return;

  const prepare = (async () => {
    await document.fonts.ready;

    const printRoot = document.querySelector(".admin-urkunden-print-source");
    if (!printRoot) return;

    const images = printRoot.querySelectorAll("img");
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

/**
 * Scharfe Urkunde als Vektor-PDF oder Druck.
 * Im Dialog: „Als PDF speichern“ oder Drucker wählen.
 * (Nicht html2canvas – Schrift und Logo bleiben scharf.)
 */
export async function printUrkundeDocument(): Promise<void> {
  await waitForUrkundePrintAssets();
  window.print();
}
