import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Rocket, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchServicesAll } from "@/lib/queries";
import type { Service } from "@/data/types";
import { saveDraft, publishDraft, discardDraft, deleteItem, mergeAdminView } from "@/lib/draft-actions";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/admin/services")({ component: ServicesAdmin });

const ICON_OPTIONS = ["Code2", "Cloud", "Brain", "Smartphone", "Plug", "Palette", "Shield", "CheckCircle2", "Globe2", "Sparkles"];

function ServicesAdmin() {
  const qc = useQueryClient();
  const { data: allRows, isLoading } = useQuery({ queryKey: ["services", "admin"], queryFn: fetchServicesAll });
  const data = allRows ? mergeAdminView(allRows) : undefined;
  const [editing, setEditing] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["services"] });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const span = String(fd.get("span") ?? "none");
    const payload = {
      title: String(fd.get("title") ?? ""),
      description: String(fd.get("description") ?? ""),
      icon: String(fd.get("icon") ?? "Sparkles"),
      span: span === "none" ? null : span,
      order_index: Number(fd.get("order_index") ?? 0),
    };
    const { error } = await saveDraft("services", payload, editing, allRows ?? []);
    if (error) return toast.error("Failed to save draft");
    toast.success(editing ? "Draft saved" : "Draft created");
    setOpen(false);
    setEditing(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await deleteItem("services", deleteTarget);
    if (error) toast.error("Failed to delete service");
    else toast.success("Service deleted");
    setDeleteTarget(null);
    refresh();
  };

  const handlePublish = async (row: Service) => {
    const { error } = await publishDraft("services", row);
    if (error) toast.error("Failed to publish");
    else toast.success("Published live");
    refresh();
  };

  const handleDiscard = async (row: Service) => {
    const { error } = await discardDraft("services", row);
    if (error) toast.error("Failed to discard");
    else toast.success("Draft discarded");
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Services</h1>
          <p className="mt-1 text-[color:var(--text-muted)]">Edits create drafts. Use Publish to push them live.</p>
        </div>
        <Button
          className="bg-gradient-brand hover:opacity-90"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Service
        </Button>
      </div>

      <div className="rounded-xl glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="hidden md:table-cell">Span</TableHead>
              <TableHead className="w-20">Order</TableHead>
              <TableHead className="w-44 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-[color:var(--text-muted)]">Loading…</TableCell>
              </TableRow>
            ) : data?.length ? (
              data.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell><StatusBadge status={s.status} originalId={s.original_id} /></TableCell>
                  <TableCell className="hidden md:table-cell text-xs">{s.span ?? "—"}</TableCell>
                  <TableCell>{s.order_index}</TableCell>
                  <TableCell className="text-right">
                    {s.status === "draft" && (
                      <>
                        <Button variant="ghost" size="icon" title="Publish" onClick={() => handlePublish(s)}>
                          <Rocket className="h-4 w-4 text-emerald-400" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Discard draft" onClick={() => handleDiscard(s)}>
                          <Undo2 className="h-4 w-4 text-amber-400" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(s); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(s)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-[color:var(--text-muted)]">No services yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={editing?.title ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required defaultValue={editing?.description ?? ""} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select name="icon" defaultValue={editing?.icon ?? "Sparkles"}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="span">Span</Label>
                <Select name="span" defaultValue={editing?.span ?? "none"}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="md:col-span-2">md:col-span-2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="order_index">Order Index</Label>
              <Input id="order_index" name="order_index" type="number" defaultValue={editing?.order_index ?? 0} className="mt-1.5" />
            </div>
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
            <AlertDialogTitle>Delete service?</AlertDialogTitle>
            <AlertDialogDescription>This removes the live item and any pending draft. Cannot be undone.</AlertDialogDescription>
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