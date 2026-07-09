export const PATEN_MAIL_INLINE_MAX_BYTES = 3 * 1024 * 1024;

export type PatenMailPdfBlob = {
  filename: string;
  blob: Blob;
};

export type PatenMailStorageAttachment = {
  storagePath: string;
  filename: string;
};

export async function uploadPatenMailPdf(
  pateId: string,
  file: PatenMailPdfBlob
): Promise<PatenMailStorageAttachment> {
  const prepRes = await fetch(
    `/api/admin/paten/${encodeURIComponent(pateId)}/mail-attachments`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.filename,
        sizeBytes: file.blob.size,
      }),
    }
  );

  const prep = (await prepRes.json()) as {
    error?: string;
    storagePath?: string;
    signedUrl?: string;
  };

  if (!prepRes.ok || !prep.storagePath || !prep.signedUrl) {
    throw new Error(prep.error ?? "PDF-Upload konnte nicht vorbereitet werden.");
  }

  const uploadRes = await fetch(prep.signedUrl, {
    method: "PUT",
    body: file.blob,
    headers: {
      "Content-Type": "application/pdf",
    },
  });

  if (!uploadRes.ok) {
    throw new Error("PDF konnte nicht hochgeladen werden.");
  }

  return {
    storagePath: prep.storagePath,
    filename: file.filename,
  };
}

export async function uploadPatenMailPdfs(
  pateId: string,
  files: PatenMailPdfBlob[]
): Promise<PatenMailStorageAttachment[]> {
  const uploaded: PatenMailStorageAttachment[] = [];
  for (const file of files) {
    uploaded.push(await uploadPatenMailPdf(pateId, file));
  }
  return uploaded;
}
