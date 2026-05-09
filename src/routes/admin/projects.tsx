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
import { fetchProjectsAll } from "@/lib/queries";
import type { Project } from "@/data/types";
import { saveDraft, publishDraft, discardDraft, deleteItem, mergeAdminView } from "@/lib/draft-actions";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/admin/projects")({ component: ProjectsAdmin });

function ProjectsAdmin() {
  const qc = useQueryClient();
  const { data: allRows, isLoading } = useQuery({ queryKey: ["projects", "admin"], queryFn: fetchProjectsAll });
  const data = allRows ? mergeAdminView(allRows) : undefined;
  const [editing, setEditing] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["projects"] });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      category: String(fd.get("category") ?? ""),
      problem: String(fd.get("problem") ?? ""),
      stack: String(fd.get("stack") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      metric: String(fd.get("metric") ?? ""),
      gradient: String(fd.get("gradient") ?? ""),
    };
    const { error } = await saveDraft("projects", payload, editing, allRows ?? []);
    if (error) return toast.error("Failed to save draft");
    toast.success(editing ? "Draft saved" : "Draft created");
    setOpen(false);
    setEditing(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await deleteItem("projects", deleteTarget);
    if (error) toast.error("Failed to delete project");
    else toast.success("Project deleted");
    setDeleteTarget(null);
    refresh();
  };

  const handlePublish = async (row: Project) => {
    const { error } = await publishDraft("projects", row);
    if (error) toast.error("Failed to publish"); else toast.success("Published live");
    refresh();
  };
  const handleDiscard = async (row: Project) => {
    const { error } = await discardDraft("projects", row);
    if (error) toast.error("Failed to discard"); else toast.success("Draft discarded");
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-[color:var(--text-muted)]">Edits create drafts. Use Publish to push them live.</p>
        </div>
        <Button className="bg-gradient-brand hover:opacity-90" onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Project
        </Button>
      </div>

      <div className="rounded-xl glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Metric</TableHead>
              <TableHead className="w-44 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-[color:var(--text-muted)]">Loading…</TableCell></TableRow>
            ) : data?.length ? (
              data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><StatusBadge status={p.status} originalId={p.original_id} /></TableCell>
                  <TableCell className="hidden md:table-cell">{p.category}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">{p.metric}</TableCell>
                  <TableCell className="text-right">
                    {p.status === "draft" && (
                      <>
                        <Button variant="ghost" size="icon" title="Publish" onClick={() => handlePublish(p)}>
                          <Rocket className="h-4 w-4 text-emerald-400" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Discard draft" onClick={() => handleDiscard(p)}>
                          <Undo2 className="h-4 w-4 text-amber-400" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(p)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-[color:var(--text-muted)]">No projects yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name ?? ""} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" required defaultValue={editing?.category ?? ""} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="metric">Metric</Label>
                <Input id="metric" name="metric" required defaultValue={editing?.metric ?? ""} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="problem">Problem</Label>
              <Textarea id="problem" name="problem" required defaultValue={editing?.problem ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="stack">Stack (comma-separated)</Label>
              <Input id="stack" name="stack" required defaultValue={editing?.stack.join(", ") ?? ""} className="mt-1.5" placeholder="React, Node.js, AWS" />
            </div>
            <div>
              <Label htmlFor="gradient">Gradient</Label>
              <Input id="gradient" name="gradient" required defaultValue={editing?.gradient ?? "from-[#7CC4E8]/30 to-[#8B6EC4]/30"} className="mt-1.5" />
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
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
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