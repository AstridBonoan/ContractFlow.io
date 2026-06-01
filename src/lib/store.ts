"use client";

import type { AppData } from "@/lib/demo-data";
import { getInitialAppData, STORAGE_KEY } from "@/lib/demo-data";
import type {
  Appointment,
  Customer,
  Estimate,
  EstimateItem,
  Lead,
  Note,
  ProjectRequestInput,
} from "@/types";

function load(): AppData {
  if (typeof window === "undefined") return getInitialAppData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    /* use defaults */
  }
  return getInitialAppData();
}

function save(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function calculatePriority(budget: string, timeline: string): number {
  let score = 50;
  if (budget.includes("50,000")) score += 25;
  else if (budget.includes("25,000")) score += 15;
  else if (budget.includes("10,000")) score += 10;
  if (timeline === "ASAP") score += 20;
  else if (timeline === "Within 1 Month") score += 10;
  return Math.min(100, score);
}

export const dataStore = {
  get(): AppData {
    return load();
  },

  reset() {
    save(getInitialAppData());
  },

  submitProjectRequest(input: ProjectRequestInput): Lead {
    const data = load();
    const customerId = uid("cust");
    const customer: Customer = {
      id: customerId,
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const leadId = uid("lead");
    const photos = input.photos.map((file, i) => ({
      id: uid("photo"),
      lead_id: leadId,
      storage_path: `local/${leadId}/${i}`,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      created_at: new Date().toISOString(),
    }));

    const lead: Lead = {
      id: leadId,
      customer_id: customerId,
      service_type: input.service_type,
      description: input.description,
      budget_range: input.budget_range,
      timeline: input.timeline,
      status: "New Lead",
      priority_score: calculatePriority(input.budget_range, input.timeline),
      consultation_date: input.consultation_date ?? null,
      consultation_time: input.consultation_time ?? null,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer,
      photos,
    };

    if (input.consultation_date) {
      const start = new Date(`${input.consultation_date}T${input.consultation_time || "09:00"}`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      data.appointments.push({
        id: uid("apt"),
        lead_id: leadId,
        customer_id: customerId,
        title: `Consultation - ${input.full_name}`,
        type: "consultation",
        start_at: start.toISOString(),
        end_at: end.toISOString(),
        notes: input.service_type,
        created_at: new Date().toISOString(),
      });
    }

    data.customers.push(customer);
    data.leads.unshift(lead);
    save(data);
    return lead;
  },

  updateLeadStatus(leadId: string, status: Lead["status"]) {
    const data = load();
    const lead = data.leads.find((l) => l.id === leadId);
    if (lead) {
      lead.status = status;
      lead.updated_at = new Date().toISOString();
      save(data);
    }
  },

  addLeadNote(leadId: string, content: string) {
    const data = load();
    const note: Note = {
      id: uid("note"),
      lead_id: leadId,
      customer_id: null,
      content,
      created_at: new Date().toISOString(),
    };
    data.notes.push(note);
    save(data);
    return note;
  },

  getLeadNotes(leadId: string): Note[] {
    return load().notes.filter((n) => n.lead_id === leadId);
  },

  saveEstimate(estimate: Omit<Estimate, "id" | "created_at" | "updated_at"> & { id?: string; items: EstimateItem[] }) {
    const data = load();
    const taxRate = data.settings.tax_rate / 100;
    const subtotal = estimate.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    if (estimate.id) {
      const idx = data.estimates.findIndex((e) => e.id === estimate.id);
      if (idx >= 0) {
        data.estimates[idx] = {
          ...data.estimates[idx],
          ...estimate,
          subtotal,
          tax,
          total,
          updated_at: new Date().toISOString(),
          items: estimate.items,
        };
      }
    } else {
      const id = uid("est");
      data.estimates.push({
        id,
        lead_id: estimate.lead_id,
        customer_id: estimate.customer_id,
        status: estimate.status,
        subtotal,
        tax,
        total,
        notes: estimate.notes ?? null,
        sent_at: estimate.sent_at ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: estimate.items.map((item, i) => ({ ...item, id: item.id || uid("item"), estimate_id: id, sort_order: i })),
      });
    }
    save(data);
    return load().estimates.find((e) => e.lead_id === estimate.lead_id && e.status === estimate.status);
  },

  updateSettings(settings: Partial<AppData["settings"]>) {
    const data = load();
    data.settings = { ...data.settings, ...settings };
    save(data);
  },

  upsertAppointment(apt: Appointment) {
    const data = load();
    const idx = data.appointments.findIndex((a) => a.id === apt.id);
    if (idx >= 0) data.appointments[idx] = apt;
    else data.appointments.push(apt);
    save(data);
  },
};
