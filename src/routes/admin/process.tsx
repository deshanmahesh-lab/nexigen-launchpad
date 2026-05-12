import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SimpleCrud } from "@/components/admin/SimpleCrud";
import { fetchProcessSteps } from "@/lib/queries";
import type { ProcessStep } from "@/data/types";

export const Route = createFileRoute("/admin/process")({ component: ProcessAdmin });

function ProcessAdmin() {
  return (
    <SimpleCrud<ProcessStep>
      title="Process Steps"
      description="Manage the 'Our Process' roadmap."
      table="process_steps"
      queryKey="process_steps"
      fetchAll={fetchProcessSteps}
      defaultValues={() => ({ number: "", title: "", description: "", order_index: 0 })}
      columns={[
        { label: "Number", render: (r) => r.number, className: "w-24" },
        { label: "Title", render: (r) => r.title },
        { label: "Order", render: (r) => r.order_index, className: "w-20" },
      ]}
      buildPayload={(s) => ({
        number: s.number ?? "",
        title: s.title ?? "",
        description: s.description ?? "",
        order_index: Number(s.order_index ?? 0),
      })}
      renderForm={(s, setS) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Number (e.g. 01)</Label>
              <Input value={s.number ?? ""} onChange={(e) => setS({ ...s, number: e.target.value })} required className="mt-1.5" />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={s.order_index ?? 0} onChange={(e) => setS({ ...s, order_index: Number(e.target.value) })} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Title</Label>
            <Input value={s.title ?? ""} onChange={(e) => setS({ ...s, title: e.target.value })} required className="mt-1.5" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={s.description ?? ""} onChange={(e) => setS({ ...s, description: e.target.value })} required className="mt-1.5" />
          </div>
        </>
      )}
    />
  );
}