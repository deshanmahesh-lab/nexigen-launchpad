import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
import { fetchTechStack } from "@/lib/queries";
import type { TechGroup } from "@/data/types";

export const Route = createFileRoute("/admin/tech")({ component: TechAdmin });

function TechAdmin() {
  return (
    <SimpleCrud<TechGroup>
      title="Tech Stack"
      description="Manage the categories shown in 'Our Tech Stack'."
      table="tech_stack"
      queryKey="tech_stack"
      fetchAll={fetchTechStack}
      defaultValues={() => ({ category: "", items: [], order_index: 0 })}
      columns={[
        { label: "Category", render: (r) => r.category },
        { label: "Items", render: (r) => r.items.join(", ") },
        { label: "Order", render: (r) => r.order_index, className: "w-20" },
      ]}
      buildPayload={(s) => ({
        category: s.category ?? "",
        items: Array.isArray(s.items) ? s.items : String(s.items ?? "").split(",").map((x) => x.trim()).filter(Boolean),
        order_index: Number(s.order_index ?? 0),
      })}
      renderForm={(s, setS) => {
        const itemsText = Array.isArray(s.items) ? s.items.join(", ") : (s.items as unknown as string) ?? "";
        return (
          <>
            <div>
              <Label>Category (e.g. Frontend)</Label>
              <Input value={s.category ?? ""} onChange={(e) => setS({ ...s, category: e.target.value })} required className="mt-1.5" />
            </div>
            <div>
              <Label>Items (comma-separated)</Label>
              <Textarea
                value={itemsText}
                onChange={(e) => setS({ ...s, items: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })}
                placeholder="React, Next.js, TypeScript"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={s.order_index ?? 0} onChange={(e) => setS({ ...s, order_index: Number(e.target.value) })} className="mt-1.5" />
            </div>
          </>
        );
      }}
    />
  );
}