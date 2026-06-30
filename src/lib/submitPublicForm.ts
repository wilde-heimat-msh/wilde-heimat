import type { FormType } from "@/lib/forms/types";

export async function submitPublicForm(
  type: FormType,
  form: HTMLFormElement
): Promise<{ ok: true } | { ok: false; error: string }> {
  const formData = new FormData(form);
  formData.set("type", type);

  const res = await fetch("/api/forms/submit", {
    method: "POST",
    body: formData,
  });

  const data = (await res.json()) as { error?: string };

  if (!res.ok) {
    return { ok: false, error: data.error ?? "Senden fehlgeschlagen. Bitte erneut versuchen." };
  }

  return { ok: true };
}
