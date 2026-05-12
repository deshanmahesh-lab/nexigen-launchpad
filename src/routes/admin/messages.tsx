import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ContactMessage } from "@/data/types";

export const Route = createFileRoute("/admin/messages")({ component: MessagesAdmin });

async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return (data ?? []) as ContactMessage[];
}

function MessagesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["contact_messages"], queryFn: fetchMessages });
  const [viewing, setViewing] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["contact_messages"] });

  const toggleRead = async (m: ContactMessage) => {
    const { error } = await supabase.from("contact_messages").update({ read: !m.read }).eq("id", m.id);
    if (error) toast.error("Failed to update");
    refresh();
  };

  const open = async (m: ContactMessage) => {
    setViewing(m);
    if (!m.read) await toggleRead(m);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", deleteTarget.id);
    if (error) toast.error("Failed to delete");
    else toast.success("Deleted");
    setDeleteTarget(null);
    refresh();
  };

  const unread = data?.filter((m) => !m.read).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Messages / Leads</h1>
        <p className="mt-1 text-[color:var(--text-muted)]">
          {unread > 0 ? `${unread} unread • ${data?.length ?? 0} total` : `${data?.length ?? 0} total`}
        </p>
      </div>

      <div className="rounded-xl glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Project Type</TableHead>
              <TableHead className="hidden md:table-cell">Received</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-[color:var(--text-muted)]">Loading…</TableCell></TableRow>
            ) : data?.length ? (
              data.map((m) => (
                <TableRow key={m.id} className={m.read ? "" : "bg-primary/5"}>
                  <TableCell>{m.read ? <MailOpen className="h-4 w-4 text-[color:var(--text-muted)]" /> : <Mail className="h-4 w-4 text-primary" />}</TableCell>
                  <TableCell className={m.read ? "" : "font-semibold"}>
                    <button onClick={() => open(m)} className="hover:underline text-left">
                      {m.name}{m.company ? ` · ${m.company}` : ""}
                    </button>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{m.email}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{m.project_type ?? "—"}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-[color:var(--text-muted)]">
                    {new Date(m.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => toggleRead(m)} title={m.read ? "Mark unread" : "Mark read"}>
                      {m.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(m)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-[color:var(--text-muted)]">No messages yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{viewing?.name}{viewing?.company ? ` — ${viewing.company}` : ""}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <div><span className="text-[color:var(--text-muted)]">Email:</span> <a href={`mailto:${viewing.email}`} className="text-primary hover:underline">{viewing.email}</a></div>
              <div><span className="text-[color:var(--text-muted)]">Project type:</span> {viewing.project_type ?? "—"}</div>
              <div><span className="text-[color:var(--text-muted)]">Received:</span> {new Date(viewing.created_at).toLocaleString()}</div>
              <div className="pt-3 border-t border-border">
                <div className="text-[color:var(--text-muted)] mb-2">Message</div>
                <p className="whitespace-pre-wrap leading-relaxed">{viewing.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
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