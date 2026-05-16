import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
import { fetchPerks } from "@/lib/queries";
import type { Perk } from "@/data/types";

export const Route = createFileRoute("/admin/perks")({ component: PerksAdmin });

function PerksAdmin() {
  return (
    <SimpleCrud<Perk>
      title="Perks"
      description="Manage the 'Why Join Us' perks shown on the Careers section."
      table="perks"
      queryKey="perks"
      fetchAll={fetchPerks}
      defaultValues={() => ({ emoji: "✨", title: "", description: "", order_index: 0 })}
      columns={[
        { label: "", render: (r) => <span className="text-xl">{r.emoji}</span>, className: "w-12" },
        { label: "Title", render: (r) => r.title },
        { label: "Order", render: (r) => r.order_index, className: "w-20" },
      ]}
      buildPayload={(s) => ({
        emoji: s.emoji ?? "✨",
        title: s.title ?? "",
        description: s.description ?? "",
        order_index: Number(s.order_index ?? 0),
      })}
      renderForm={(s, setS) => (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Emoji</Label>
              <Input value={s.emoji ?? ""} onChange={(e) => setS({ ...s, emoji: e.target.value })} maxLength={4} className="mt-1.5" />
            </div>
            <div className="col-span-2">
              <Label>Title</Label>
              <Input value={s.title ?? ""} onChange={(e) => setS({ ...s, title: e.target.value })} required className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={s.description ?? ""} onChange={(e) => setS({ ...s, description: e.target.value })} required className="mt-1.5" />
          </div>
          <div>
            <Label>Order</Label>
            <Input type="number" value={s.order_index ?? 0} onChange={(e) => setS({ ...s, order_index: Number(e.target.value) })} className="mt-1.5" />
          </div>
        </>
      )}
    />
  );
}