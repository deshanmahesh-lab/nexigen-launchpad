import { useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

// Dynamic table name access — bypass generated table-literal types.
const db = supabase as unknown as {
  from: (t: string) => {
    insert: (v: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
    update: (v: Record<string, unknown>) => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
    delete: () => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
  };
};

export interface ColumnDef<T> {
  label: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface SimpleCrudProps<T extends { id: string }> {
  title: string;
  description?: string;
  table: string;
  queryKey: string;
  fetchAll: () => Promise<T[]>;
  columns: ColumnDef<T>[];
  defaultValues: () => Omit<T, "id">;
  renderForm: (state: Partial<T>, setState: (v: Partial<T>) => void) => ReactNode;
  buildPayload: (state: Partial<T>) => Record<string, unknown>;
}

export function SimpleCrud<T extends { id: string }>({
  title, description, table, queryKey, fetchAll, columns, defaultValues, renderForm, buildPayload,
}: SimpleCrudProps<T>) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: [queryKey, "admin"], queryFn: fetchAll });
  const [editing, setEditing] = useState<T | null>(null);
  const [formState, setFormState] = useState<Partial<T>>({});
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: [queryKey] });

  const openNew = () => {
    setEditing(null);
    setFormState(defaultValues() as Partial<T>);
    setOpen(true);
  };
  const openEdit = (row: T) => {
    setEditing(row);
    setFormState({ ...row });
    setOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = buildPayload(formState);
    if (editing) {
      const { error } = await db.from(table).update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message || "Failed to save");
      toast.success("Updated");
    } else {
      const { error } = await db.from(table).insert(payload);
      if (error) return toast.error(error.message || "Failed to add");
      toast.success("Created");
    }
    setOpen(false);
    setEditing(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await db.from(table).delete().eq("id", deleteTarget.id);
    if (error) toast.error(error.message || "Failed to delete");
    else toast.success("Deleted");
    setDeleteTarget(null);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          {description && <p className="mt-1 text-[color:var(--text-muted)]">{description}</p>}
        </div>
        <Button className="bg-gradient-brand hover:opacity-90" onClick={openNew}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="rounded-xl glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.label} className={c.className}>{c.label}</TableHead>
              ))}
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-8 text-[color:var(--text-muted)]">Loading…</TableCell></TableRow>
            ) : data?.length ? (
              data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((c) => (
                    <TableCell key={c.label} className={c.className}>{c.render(row)}</TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-8 text-[color:var(--text-muted)]">No items yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add new"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderForm(formState, setFormState)}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-brand hover:opacity-90">{editing ? "Save" : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}