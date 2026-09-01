const PRINT_PREP_TIMEOUT_MS = 3000;

function waitForImage(img: HTMLImageElement, timeoutMs: number): Promise<void> {
  if (img.complete) return Promise.resolve();

  return Promise.race([
    new Promise<void>((resolve) => {
      img.addEventListener("load", () => resolve(), { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
    }),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

/** Wartet auf Schriftarten und Bilder in der versteckten Druckquelle (mit Timeout). */
export async function waitForUrkundePrintAssets(): Promise<void> {
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
          /* Bild trotzdem drucken */
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
 * Scharfer Druck / PDF über den Browser (Vektortext, scharfes Logo).
 * Im Druckdialog: Drucker wählen oder „Als PDF speichern“.
 */
export async function printUrkundeDocument(): Promise<void> {
  await waitForUrkundePrintAssets();
  window.print();
}
