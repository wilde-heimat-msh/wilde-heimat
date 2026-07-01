import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { resolveAttachmentPreviewUrl } from "@/lib/supabase/storage";

export type FormSubmissionRecord = {
  id: string;
  type: string;
  payload: Record<string, string | undefined>;
  replyTo?: string;
  attachmentUrl?: string;
  createdAt: string;
};

type FormSubmissionRow = {
  id: string;
  type: string;
  payload: Record<string, string | undefined>;
  reply_to: string | null;
  attachment_url: string | null;
  created_at: string;
};

export async function listFormSubmissions(limit = 100): Promise<FormSubmissionRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(
    (data as FormSubmissionRow[]).map(async (row) => {
      let attachmentUrl = row.attachment_url ?? undefined;
      if (attachmentUrl) {
        const resolved = await resolveAttachmentPreviewUrl(attachmentUrl);
        attachmentUrl = resolved ?? undefined;
      }

      return {
        id: row.id,
        type: row.type,
        payload: row.payload ?? {},
        replyTo: row.reply_to ?? undefined,
        attachmentUrl,
        createdAt: row.created_at,
      };
    })
  );
}

export async function deleteFormSubmission(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("form_submissions")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
}
