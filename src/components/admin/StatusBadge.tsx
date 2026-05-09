import type { ItemStatus } from "@/data/types";

export function StatusBadge({
  status,
  originalId,
}: {
  status: ItemStatus;
  originalId: string | null;
}) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
      </span>
    );
  }
  if (originalId) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Edited
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> New
    </span>
  );
}