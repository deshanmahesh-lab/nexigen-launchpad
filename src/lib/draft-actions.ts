import { supabase } from "@/lib/supabase";
import type { ItemStatus } from "@/data/types";

export type DraftableTable = "services" | "projects" | "testimonials" | "stats";

export interface DraftableItem {
  id: string;
  status: ItemStatus;
  original_id: string | null;
}

/**
 * Save edits as a draft.
 *  - editing is null  → create a new draft (original_id = null)
 *  - editing is a published row → create or update its draft copy
 *  - editing is a draft → update the draft directly
 */
export async function saveDraft<T extends DraftableItem>(
  table: DraftableTable,
  payload: Record<string, unknown>,
  editing: T | null,
  allRows: T[],
) {
  if (!editing) {
    return supabase.from(table).insert({ ...payload, status: "draft", original_id: null });
  }
  if (editing.status === "draft") {
    return supabase.from(table).update(payload).eq("id", editing.id);
  }
  // editing is published — find/create draft pointing at it
  const existingDraft = allRows.find((r) => r.status === "draft" && r.original_id === editing.id);
  if (existingDraft) {
    return supabase.from(table).update(payload).eq("id", existingDraft.id);
  }
  return supabase.from(table).insert({ ...payload, status: "draft", original_id: editing.id });
}

/** Promote a draft to published. */
export async function publishDraft(table: DraftableTable, draft: DraftableItem & Record<string, unknown>) {
  if (draft.status !== "draft") return { error: null };
  if (draft.original_id) {
    // Copy draft fields onto the published row, then delete draft
    const { id, status, original_id, created_at, ...fields } = draft;
    void id; void status; void original_id; void created_at;
    const { error: upErr } = await supabase.from(table).update(fields).eq("id", draft.original_id);
    if (upErr) return { error: upErr };
    return supabase.from(table).delete().eq("id", draft.id);
  }
  // Standalone draft → flip to published
  return supabase.from(table).update({ status: "published" }).eq("id", draft.id);
}

/** Discard a draft (revert to the published version, or remove a brand-new draft entirely). */
export async function discardDraft(table: DraftableTable, draft: DraftableItem) {
  if (draft.status !== "draft") return { error: null };
  return supabase.from(table).delete().eq("id", draft.id);
}

/** Hard delete the logical item (published row + any cascading draft). */
export async function deleteItem(table: DraftableTable, item: DraftableItem) {
  const targetId = item.original_id ?? item.id;
  return supabase.from(table).delete().eq("id", targetId);
}

/** Find a pending draft for a published row, if one exists. */
export function findDraftFor<T extends DraftableItem>(rows: T[], publishedId: string): T | undefined {
  return rows.find((r) => r.status === "draft" && r.original_id === publishedId);
}

/** Build the merged admin view: one row per logical item. Drafts replace their originals. */
export function mergeAdminView<T extends DraftableItem>(rows: T[]): T[] {
  const drafts = rows.filter((r) => r.status === "draft");
  const editedIds = new Set(drafts.map((d) => d.original_id).filter((v): v is string => !!v));
  const result: T[] = [];
  for (const r of rows) {
    if (r.status === "published" && editedIds.has(r.id)) {
      const draft = drafts.find((d) => d.original_id === r.id)!;
      result.push(draft);
    } else if (r.status === "published") {
      result.push(r);
    }
  }
  for (const d of drafts) if (!d.original_id) result.push(d);
  return result;
}

export function itemBadge(item: DraftableItem): "Live" | "Edited" | "New" {
  if (item.status === "published") return "Live";
  return item.original_id ? "Edited" : "New";
}