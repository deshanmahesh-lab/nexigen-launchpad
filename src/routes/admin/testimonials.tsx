import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
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
import { supabase } from "@/lib/supabase";
import { fetchTestimonialsAll } from "@/lib/queries";
import type { Testimonial } from "@/data/types";

export const Route = createFileRoute("/admin/testimonials")({ component: TestimonialsAdmin });

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["testimonials", "all"], queryFn: fetchTestimonialsAll });
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["testimonials"] });

  const drafts = (data ?? []).filter((t) => t.status === "draft");
  const published = (data ?? []).filter((t) => t.status === "published");

  const publishDraft = async (id: string) => {
    const { error } = await supabase.from("testimonials").update({ status: "published" }).eq("id", id);
    if (error) return toast.error("Failed to publish");
    toast.success("Testimonial published");
    refresh();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      quote: String(fd.get("quote") ?? ""),
      name: String(fd.get("name") ?? ""),
      role: String(fd.get("role") ?? ""),
      flag: String(fd.get("flag") ?? ""),
    };
    if (editing) {
      const { error } = await supabase.from("testimonials").update(payload).eq("id", editing.id);
      if (error) return toast.error("Failed to update testimonial");
      toast.success("Testimonial updated successfully");
    } else {
      const { error } = await supabase.from("testimonials").insert(payload);
      if (error) return toast.error("Failed to add testimonial");
      toast.success("Testimonial added successfully");
    }
    setOpen(false);
    setEditing(null);
    refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", deleteId);
    if (error) toast.error("Failed to delete testimonial");
    else toast.success("Testimonial deleted");
    setDeleteId(null);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Testimonials</h1>
          <p className="mt-1 text-[color:var(--text-muted)]">Client quotes and reviews.</p>
        </div>
        <Button className="bg-gradient-brand hover:opacity-90" onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Testimonial
        </Button>
      </div>

      {drafts.length > 0 && (
        <div className="rounded-xl glass overflow-hidden border border-primary/30">
          <div className="px-4 py-3 border-b border-border bg-gradient-brand/10">
            <h2 className="font-display font-semibold">Pending review ({drafts.length})</h2>
            <p className="text-xs text-[color:var(--text-muted)]">Customer-submitted testimonials awaiting approval.</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden lg:table-cell">Quote</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.flag} {t.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs">{t.role}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs max-w-md truncate">{t.quote}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Approve" onClick={() => publishDraft(t.id)}>
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => { setEditing(t); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Reject" onClick={() => setDeleteId(t.id)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="rounded-xl glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="w-16">Flag</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-[color:var(--text-muted)]">Loading…</TableCell></TableRow>
            ) : published.length ? (
              published.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs">{t.role}</TableCell>
                  <TableCell>{t.flag}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(t); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-[color:var(--text-muted)]">No published testimonials yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="quote">Quote</Label>
              <Textarea id="quote" name="quote" required defaultValue={editing?.quote ?? ""} className="mt-1.5" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required defaultValue={editing?.name ?? ""} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="flag">Flag (emoji)</Label>
                <Input id="flag" name="flag" required defaultValue={editing?.flag ?? ""} className="mt-1.5" placeholder="🇺🇸" />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" required defaultValue={editing?.role ?? ""} className="mt-1.5" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-brand hover:opacity-90">{editing ? "Save" : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
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