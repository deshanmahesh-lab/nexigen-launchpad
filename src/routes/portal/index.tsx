import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { PortalMessage } from "@/data/types";

export const Route = createFileRoute("/portal/")({ component: PortalHome });

function PortalHome() {
  return (
    <Tabs defaultValue="chat" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="chat">Project Chat</TabsTrigger>
        <TabsTrigger value="review">Leave a Review</TabsTrigger>
      </TabsList>
      <TabsContent value="chat"><ProjectChat /></TabsContent>
      <TabsContent value="review"><LeaveReview /></TabsContent>
    </Tabs>
  );
}

function ProjectChat() {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("portal_messages")
        .select("*")
        .eq("customer_id", userId)
        .order("created_at", { ascending: true });
      if (!active) return;
      if (error) { toast.error("Failed to load chat"); return; }
      setMessages((data ?? []) as PortalMessage[]);
    };
    void load();

    const channel = supabase
      .channel(`portal_messages:${userId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "portal_messages",
        filter: `customer_id=eq.${userId}`,
      }, (payload) => {
        setMessages((prev) => {
          const next = payload.new as PortalMessage;
          if (prev.some((m) => m.id === next.id)) return prev;
          return [...prev, next];
        });
      })
      .subscribe();

    return () => { active = false; void supabase.removeChannel(channel); };
  }, [userId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !userId) return;
    setSending(true);
    const { error } = await supabase.from("portal_messages").insert({
      customer_id: userId, message: body, is_from_admin: false,
    });
    setSending(false);
    if (error) { toast.error("Failed to send"); return; }
    setText("");
  };

  return (
    <Card className="glass border-border p-0 overflow-hidden flex flex-col h-[60vh]">
      <div className="border-b border-border px-5 py-3">
        <h2 className="font-display font-semibold">Chat with our team</h2>
        <p className="text-xs text-[color:var(--text-muted)]">We typically reply within a few business hours.</p>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--text-muted)] py-12">No messages yet — say hello 👋</p>
        ) : messages.map((m) => (
          <div key={m.id} className={`flex ${m.is_from_admin ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              m.is_from_admin
                ? "bg-[color:var(--surface-2)] text-foreground rounded-bl-sm"
                : "bg-gradient-brand text-white rounded-br-sm"
            }`}>
              <div className="whitespace-pre-wrap break-words">{m.message}</div>
              <div className="mt-1 text-[10px] opacity-70">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="border-t border-border p-3 flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" disabled={sending} />
        <Button type="submit" disabled={sending || !text.trim()} className="bg-gradient-brand hover:opacity-90">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}

function LeaveReview() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { data: ures } = await supabase.auth.getUser();
    const uid = ures.user?.id;
    if (!uid) { toast.error("Not signed in"); return; }
    const payload = {
      quote: String(fd.get("quote") ?? "").trim().slice(0, 1000),
      name: String(fd.get("name") ?? "").trim().slice(0, 120),
      role: String(fd.get("role") ?? "").trim().slice(0, 120),
      flag: String(fd.get("flag") ?? "").trim().slice(0, 8) || "🌟",
      status: "draft" as const,
      customer_id: uid,
    };
    if (!payload.quote || !payload.name || !payload.role) {
      toast.error("Please fill in all fields"); return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("testimonials").insert(payload);
    setSubmitting(false);
    if (error) { toast.error("Failed to submit review"); return; }
    toast.success("Thanks! Your review is pending approval.");
    setDone(true);
  };

  if (done) {
    return (
      <Card className="glass border-border p-10 text-center">
        <Star className="h-10 w-10 mx-auto text-primary" />
        <h2 className="mt-3 font-display text-2xl font-semibold">Thank you!</h2>
        <p className="mt-2 text-[color:var(--text-muted)]">Your testimonial has been sent for review.</p>
        <Button onClick={() => setDone(false)} variant="ghost" className="mt-6">Submit another</Button>
      </Card>
    );
  }

  return (
    <Card className="glass border-border p-6 md:p-8">
      <h2 className="font-display text-2xl font-semibold">Leave a testimonial</h2>
      <p className="mt-1 text-sm text-[color:var(--text-muted)]">Share your experience working with us. An admin will review before publishing.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="quote">Your testimonial</Label>
          <Textarea id="quote" name="quote" rows={5} required maxLength={1000} className="mt-1.5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" name="name" required maxLength={120} className="mt-1.5" />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="role">Role / Company</Label>
            <Input id="role" name="role" required maxLength={120} className="mt-1.5" placeholder="CTO, Acme Inc." />
          </div>
          <div>
            <Label htmlFor="flag">Flag (emoji)</Label>
            <Input id="flag" name="flag" maxLength={8} className="mt-1.5" placeholder="🇺🇸" />
          </div>
        </div>
        <Button type="submit" disabled={submitting} className="bg-gradient-brand hover:opacity-90">
          {submitting ? "Submitting…" : "Submit for review"}
        </Button>
      </form>
    </Card>
  );
}