"use client";

import { useState } from "react";
import { useAppData } from "@/components/providers/data-provider";
import { dataStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";

export default function SettingsPage() {
  const { data, refresh, loading } = useAppData();
  const [form, setForm] = useState(data.settings);
  const [saved, setSaved] = useState(false);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const handleSave = () => {
    dataStore.updateSettings(form);
    refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Customize your contractor profile and estimates"
      />

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Branding shown on estimates and PDF exports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              placeholder="https://..."
              value={form.logo_url ?? ""}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value || null })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estimate Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tax_rate">Tax Rate (%)</Label>
            <Input
              id="tax_rate"
              type="number"
              step="0.01"
              value={form.tax_rate}
              onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimate_template">Estimate Template Header</Label>
            <Textarea
              id="estimate_template"
              value={form.estimate_template}
              onChange={(e) => setForm({ ...form, estimate_template: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email notifications for new leads</p>
              <p className="text-sm text-slate-500">Receive alerts when homeowners submit requests</p>
            </div>
            <Switch
              checked={form.email_notifications}
              onCheckedChange={(v) => setForm({ ...form, email_notifications: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full sm:w-auto">
        {saved ? "Saved!" : "Save Settings"}
      </Button>
    </div>
  );
}
