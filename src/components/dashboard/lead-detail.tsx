"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge, statusToBadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUSES } from "@/lib/constants";
import { dataStore } from "@/lib/store";
import { useAppData } from "@/components/providers/data-provider";
import { withBasePath } from "@/lib/utils";
import type { Lead } from "@/types";
import type { LeadStatus } from "@/lib/constants";

export function LeadDetail({ lead }: { lead: Lead }) {
  const { refresh, data } = useAppData();
  const [note, setNote] = useState("");
  const notes = data.notes.filter((n) => n.lead_id === lead.id);

  const updateStatus = (status: LeadStatus) => {
    dataStore.updateLeadStatus(lead.id, status);
    refresh();
  };

  const addNote = () => {
    if (!note.trim()) return;
    dataStore.addLeadNote(lead.id, note);
    setNote("");
    refresh();
  };

  const customer = lead.customer;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{customer?.full_name}</h1>
          <p className="text-slate-500">{lead.service_type}</p>
        </div>
        <Badge variant={statusToBadgeVariant(lead.status)} className="text-sm">
          {lead.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">{lead.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>Budget: {lead.budget_range}</span>
                <span>Timeline: {lead.timeline}</span>
                <span>Priority: {lead.priority_score}</span>
              </div>
            </CardContent>
          </Card>

          {lead.photos && lead.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {lead.photos.map((photo) => (
                    <a
                      key={photo.id}
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square overflow-hidden rounded-lg"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt="" className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notes.map((n) => (
                <div key={n.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-sm">{n.content}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(n.created_at)}</p>
                </div>
              ))}
              <div className="space-y-2">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." />
                <Button onClick={addNote}>Add Note</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{customer?.email}</p>
              <p>{customer?.phone}</p>
              <p>{customer?.address}</p>
              {lead.consultation_date && (
                <p className="pt-2 font-medium text-amber-700">
                  Consultation: {formatDate(lead.consultation_date)} at {lead.consultation_time}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={lead.status} onValueChange={(v) => updateStatus(v as LeadStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" asChild>
                <Link href={withBasePath(`/dashboard/estimates/?leadId=${lead.id}`)}>
                  Create Estimate
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
