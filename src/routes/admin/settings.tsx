import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { fetchSiteConfig } from "@/lib/queries";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

type ConfigValue = Record<string, unknown>;

function useConfigSection<T extends ConfigValue>(key: string) {
  return useQuery({
    queryKey: ["site_config", key],
    queryFn: async () => ((await fetchSiteConfig(key))?.value ?? {}) as T,
  });
}

async function saveSection(key: string, value: ConfigValue) {
  const { error } = await supabase
    .from("site_config")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  return error;
}

function SettingsAdmin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Site Settings</h1>
        <p className="mt-1 text-[color:var(--text-muted)]">Update headlines, descriptions, and contact details that appear across the public site.</p>
      </div>
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="certs">Certifications</TabsTrigger>
          <TabsTrigger value="careers">Careers Intro</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>
        <TabsContent value="hero"><HeroSection /></TabsContent>
        <TabsContent value="about"><AboutSection /></TabsContent>
        <TabsContent value="certs"><CertsSection /></TabsContent>
        <TabsContent value="careers"><CareersSection /></TabsContent>
        <TabsContent value="contact"><ContactSection /></TabsContent>
        <TabsContent value="footer"><FooterSection /></TabsContent>
      </Tabs>
    </div>
  );
}

function SectionCard({ title, hint, onSave, children, saving }: { title: string; hint?: string; onSave: () => void; children: React.ReactNode; saving: boolean }) {
  return (
    <div className="rounded-xl glass p-6 space-y-4 mt-4">
      <div>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        {hint && <p className="text-sm text-[color:var(--text-muted)] mt-1">{hint}</p>}
      </div>
      {children}
      <div className="pt-2">
        <Button onClick={onSave} disabled={saving} className="bg-gradient-brand hover:opacity-90">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

function useSectionState<T extends ConfigValue>(key: string, defaults: T) {
  const qc = useQueryClient();
  const { data } = useConfigSection<T>(key);
  const [state, setState] = useState<T>(defaults);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data) setState({ ...defaults, ...data } as T); }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = async () => {
    setSaving(true);
    const err = await saveSection(key, state as ConfigValue);
    setSaving(false);
    if (err) toast.error(err.message);
    else { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["site_config", key] }); }
  };
  return { state, setState, save, saving };
}

function HeroSection() {
  const { state, setState, save, saving } = useSectionState("hero", {
    badge: "", title_line1: "", title_line2: "", description: "",
  });
  return (
    <SectionCard title="Hero Section" hint="The top of the homepage." onSave={save} saving={saving}>
      <div><Label>Badge text</Label><Input value={state.badge} onChange={(e) => setState({ ...state, badge: e.target.value })} className="mt-1.5" /></div>
      <div><Label>Title — line 1</Label><Input value={state.title_line1} onChange={(e) => setState({ ...state, title_line1: e.target.value })} className="mt-1.5" /></div>
      <div><Label>Title — line 2 (highlighted)</Label><Input value={state.title_line2} onChange={(e) => setState({ ...state, title_line2: e.target.value })} className="mt-1.5" /></div>
      <div><Label>Description</Label><Textarea rows={4} value={state.description} onChange={(e) => setState({ ...state, description: e.target.value })} className="mt-1.5" /></div>
    </SectionCard>
  );
}

function AboutSection() {
  const { state, setState, save, saving } = useSectionState("about", {
    title: "", paragraphs: [] as string[],
  });
  const paragraphsText = (state.paragraphs ?? []).join("\n\n");
  return (
    <SectionCard title="'Built in Sri Lanka. Built for the World.' Section" hint="Last word of the title becomes a gradient highlight." onSave={save} saving={saving}>
      <div><Label>Title</Label><Input value={state.title} onChange={(e) => setState({ ...state, title: e.target.value })} className="mt-1.5" /></div>
      <div>
        <Label>Paragraphs (separate with a blank line)</Label>
        <Textarea
          rows={8}
          value={paragraphsText}
          onChange={(e) => setState({ ...state, paragraphs: e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) })}
          className="mt-1.5"
        />
      </div>
    </SectionCard>
  );
}

function CertsSection() {
  const { state, setState, save, saving } = useSectionState("certs", { title: "" });
  return (
    <SectionCard title="'Globally Certified. Enterprise Ready.' Section" onSave={save} saving={saving}>
      <div><Label>Title</Label><Input value={state.title} onChange={(e) => setState({ ...state, title: e.target.value })} className="mt-1.5" /></div>
    </SectionCard>
  );
}

function CareersSection() {
  const { state, setState, save, saving } = useSectionState("careers_intro", { description: "" });
  return (
    <SectionCard title="Careers Intro" hint="Short description shown under 'Join the Team'." onSave={save} saving={saving}>
      <div><Label>Description</Label><Textarea rows={3} value={state.description} onChange={(e) => setState({ ...state, description: e.target.value })} className="mt-1.5" /></div>
    </SectionCard>
  );
}

function ContactSection() {
  const { state, setState, save, saving } = useSectionState("contact_info", {
    email: "", phone: "", location: "", hours: "",
  });
  return (
    <SectionCard title="Contact Info" hint="Shown beneath the contact form." onSave={save} saving={saving}>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Email</Label><Input value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} className="mt-1.5" /></div>
        <div><Label>Phone</Label><Input value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value })} className="mt-1.5" /></div>
        <div><Label>Location</Label><Input value={state.location} onChange={(e) => setState({ ...state, location: e.target.value })} className="mt-1.5" /></div>
        <div><Label>Hours</Label><Input value={state.hours} onChange={(e) => setState({ ...state, hours: e.target.value })} className="mt-1.5" /></div>
      </div>
    </SectionCard>
  );
}

function FooterSection() {
  const { state, setState, save, saving } = useSectionState("footer", {
    tagline: "", email: "", location: "", copyright: "",
    linkedin: "", github: "", twitter: "", dribbble: "",
  });
  return (
    <SectionCard title="Footer / Company Details" onSave={save} saving={saving}>
      <div><Label>Tagline</Label><Input value={state.tagline} onChange={(e) => setState({ ...state, tagline: e.target.value })} className="mt-1.5" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Email</Label><Input value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} className="mt-1.5" /></div>
        <div><Label>Location</Label><Input value={state.location} onChange={(e) => setState({ ...state, location: e.target.value })} className="mt-1.5" /></div>
      </div>
      <div><Label>Copyright line</Label><Input value={state.copyright} onChange={(e) => setState({ ...state, copyright: e.target.value })} className="mt-1.5" /></div>
      <div className="pt-2 grid grid-cols-2 gap-4">
        <div><Label>LinkedIn URL</Label><Input value={state.linkedin} onChange={(e) => setState({ ...state, linkedin: e.target.value })} className="mt-1.5" /></div>
        <div><Label>GitHub URL</Label><Input value={state.github} onChange={(e) => setState({ ...state, github: e.target.value })} className="mt-1.5" /></div>
        <div><Label>Twitter URL</Label><Input value={state.twitter} onChange={(e) => setState({ ...state, twitter: e.target.value })} className="mt-1.5" /></div>
        <div><Label>Dribbble URL</Label><Input value={state.dribbble} onChange={(e) => setState({ ...state, dribbble: e.target.value })} className="mt-1.5" /></div>
      </div>
    </SectionCard>
  );
}