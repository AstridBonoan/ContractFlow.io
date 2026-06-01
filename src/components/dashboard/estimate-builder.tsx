"use client";

import { useEffect, useState } from "react";
import { Download, Plus, Save, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { dataStore } from "@/lib/store";
import { useAppData } from "@/components/providers/data-provider";
import { generateEstimatePdf } from "@/lib/pdf";
import type { EstimateItem, Lead } from "@/types";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export function EstimateBuilder({ lead }: { lead: Lead }) {
  const { data, refresh } = useAppData();
  const existing = data.estimates.find((e) => e.lead_id === lead.id);
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, unit_price: 0 },
  ]);
  const [status, setStatus] = useState<"draft" | "sent" | "accepted" | "rejected">("draft");

  useEffect(() => {
    if (existing?.items?.length) {
      setItems(
        existing.items.map((i) => ({
          id: i.id,
          description: i.description,
          quantity: i.quantity,
          unit_price: i.unit_price,
        }))
      );
      setStatus(existing.status);
    }
  }, [existing]);

  const taxRate = data.settings.tax_rate / 100;
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const addLine = () => {
    setItems([...items, { id: String(Date.now()), description: "", quantity: 1, unit_price: 0 }]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id));
  };

  const save = (newStatus: typeof status) => {
    const estimateItems: EstimateItem[] = items.map((item, i) => ({
      id: item.id,
      estimate_id: existing?.id ?? "",
      description: item.description,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      sort_order: i,
    }));

    dataStore.saveEstimate({
      id: existing?.id,
      lead_id: lead.id,
      customer_id: lead.customer_id,
      status: newStatus,
      subtotal,
      tax,
      total,
      notes: null,
      sent_at: newStatus === "sent" ? new Date().toISOString() : existing?.sent_at ?? null,
      items: estimateItems,
    });

    if (newStatus === "sent") {
      dataStore.updateLeadStatus(lead.id, "Estimate Sent");
    }
    if (newStatus === "accepted") {
      dataStore.updateLeadStatus(lead.id, "Won");
    }
    setStatus(newStatus);
    refresh();
  };

  const downloadPdf = async () => {
    const customer = lead.customer ?? data.customers.find((c) => c.id === lead.customer_id);
    if (!customer) return;
    await generateEstimatePdf({
      settings: data.settings,
      customer,
      lead,
      estimate: {
        id: existing?.id ?? "new",
        lead_id: lead.id,
        customer_id: lead.customer_id,
        status,
        subtotal,
        tax,
        total,
        notes: null,
        sent_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      items: items.map((item, i) => ({
        id: item.id,
        estimate_id: existing?.id ?? "",
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        sort_order: i,
      })),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Estimate Builder</h1>
          <p className="text-slate-500">
            {lead.customer?.full_name} — {lead.service_type}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => save("draft")}>
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button onClick={() => save("sent")}>
            <Send className="h-4 w-4" /> Send Estimate
          </Button>
          <Button variant="outline" onClick={downloadPdf}>
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button size="sm" variant="outline" onClick={addLine}>
            <Plus className="h-4 w-4" /> Add Line
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <Label className="text-xs">Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Labor, materials..."
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Qty</Label>
                <Input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Unit Price</Label>
                <Input
                  type="number"
                  min={0}
                  value={item.unit_price}
                  onChange={(e) => updateItem(item.id, "unit_price", Number(e.target.value))}
                />
              </div>
              <div className="flex items-end justify-between sm:col-span-3">
                <p className="font-semibold">
                  {formatCurrency(item.quantity * item.unit_price)}
                </p>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          <div className="ml-auto max-w-xs space-y-2 border-t pt-4 text-right">
            <p className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </p>
            <p className="flex justify-between text-sm">
              <span>Tax ({data.settings.tax_rate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </p>
            <p className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-amber-700">{formatCurrency(total)}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => save("accepted")}>
          Mark Accepted
        </Button>
        <Button variant="destructive" onClick={() => save("rejected")}>
          Mark Rejected
        </Button>
      </div>
    </div>
  );
}
