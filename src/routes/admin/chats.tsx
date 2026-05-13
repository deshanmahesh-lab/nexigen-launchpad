import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PortalMessage } from "@/data/types";

export const Route = createFileRoute("/admin/chats")({ component: AdminChats });

interface ConversationSummary {
  customer_id: string;
  last_message: string;
  last_at: string;
  count: number;
}

function AdminChats() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from("portal_messages")
      .select("customer_id, message, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) { toast.error("Failed to load chats"); return; }
    const byCustomer = new Map<string, ConversationSummary>();
    for (const row of data ?? []) {
      const existing = byCustomer.get(row.customer_id);
      if (existing) {
        existing.count += 1;
      } else {
        byCustomer.set(row.customer_id, {
          customer_id: row.customer_id,
          last_message: row.message,
          last_at: row.created_at,
          count: 1,
        });
      }
    }
    setConversations(Array.from(byCustomer.values()));
  };

  useEffect(() => { void loadConversations(); }, []);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("portal_messages")
        .select("*")
        .eq("customer_id", selected)
        .order("created_at", { ascending: true });
      if (!active) return;
      if (error) { toast.error("Failed to load messages"); return; }
      setMessages((data ?? []) as PortalMessage[]);
    };
    void load();

    const channel = supabase
      .channel(`admin_portal_messages:${selected}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "portal_messages",
        filter: `customer_id=eq.${selected}`,
      }, (payload) => {
        setMessages((prev) => {
          const next = payload.new as PortalMessage;
          if (prev.some((m) => m.id === next.id)) return prev;
          return [...prev, next];
        });
      })
      .subscribe();

    return () => { active = false; void supabase.removeChannel(channel); };
  }, [selected]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const sortedConversations = useMemo(
    () => [...conversations].sort((a, b) => b.last_at.localeCompare(a.last_at)),
    [conversations],
  );

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !selected) return;
    setSending(true);
    const { error } = await supabase.from("portal_messages").insert({
      customer_id: selected, message: body, is_from_admin: true,
    });
    setSending(false);
    if (error) { toast.error("Failed to send"); return; }
    setText("");
    void supabase.functions.invoke("send-notification", {
      body: { type: "portal_reply", customer_id: selected, message: body },
    }).catch(() => { /* edge function not deployed yet */ });
    void loadConversations();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Client Chats</h1>
        <p className="mt-1 text-[color:var(--text-muted)]">Reply to messages from your customers.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="glass border-border p-2 max-h-[70vh] overflow-y-auto">
          {sortedConversations.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)] p-4 text-center">No conversations yet.</p>
          ) : sortedConversations.map((c) => (
            <button
              key={c.customer_id}
              onClick={() => setSelected(c.customer_id)}
              className={`w-full text-left rounded-lg p-3 transition-colors ${
                selected === c.customer_id
                  ? "bg-gradient-brand/20 border border-primary/30"
                  : "hover:bg-[color:var(--surface-2)]"
              }`}
            >
              <div className="text-xs font-mono truncate">{c.customer_id.slice(0, 8)}…</div>
              <div className="mt-1 text-sm truncate text-[color:var(--text-muted)]">{c.last_message}</div>
              <div className="mt-1 text-[10px] text-[color:var(--text-muted)]">{new Date(c.last_at).toLocaleString()}</div>
            </button>
          ))}
        </Card>

        <Card className="glass border-border p-0 overflow-hidden flex flex-col h-[70vh]">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-[color:var(--text-muted)] text-sm">
              Select a conversation to start replying.
            </div>
          ) : (
            <>
              <div className="border-b border-border px-5 py-3">
                <h2 className="font-display font-semibold text-sm">Customer {selected.slice(0, 8)}…</h2>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.is_from_admin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.is_from_admin
                        ? "bg-gradient-brand text-white rounded-br-sm"
                        : "bg-[color:var(--surface-2)] text-foreground rounded-bl-sm"
                    }`}>
                      <div className="whitespace-pre-wrap break-words">{m.message}</div>
                      <div className="mt-1 text-[10px] opacity-70">{new Date(m.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleReply} className="border-t border-border p-3 flex gap-2">
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a reply…" disabled={sending} />
                <Button type="submit" disabled={sending || !text.trim()} className="bg-gradient-brand hover:opacity-90">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}