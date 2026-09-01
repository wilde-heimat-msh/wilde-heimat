/** Wartet auf Schriftarten und Bilder in der versteckten Druckquelle. */
export async function waitForUrkundePrintAssets(): Promise<void> {
  if (typeof document === "undefined") return;

  await document.fonts.ready;

  const printRoot = document.querySelector(".admin-urkunden-print-source");
  if (!printRoot) return;

  const images = printRoot.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        })
    )
  );
}

/**
 * Scharfer Druck / PDF über den Browser (Vektortext, scharfes Logo).
 * Im Druckdialog: Drucker wählen oder „Als PDF speichern“.
 */
export async function printUrkundeDocument(): Promise<void> {
  await waitForUrkundePrintAssets();
  window.print();
}
