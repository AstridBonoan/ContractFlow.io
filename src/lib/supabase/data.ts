import type { AppData } from "@/lib/demo-data";
import { getInitialAppData } from "@/lib/demo-data";
import type {
  Appointment,
  Customer,
  Estimate,
  EstimateItem,
  Lead,
  LeadPhoto,
  Note,
} from "@/types";
import { getSupabaseClient } from "@/lib/supabase/client";

function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    full_name: row.full_name as string,
    email: row.email as string,
    phone: row.phone as string,
    address: row.address as string,
    notes: (row.notes as string) ?? null,
    created_at: row.created_at as string,
    updated_at: (row.updated_at as string) ?? (row.created_at as string),
  };
}

function mapLead(row: Record<string, unknown>, customer?: Customer): Lead {
  return {
    id: row.id as string,
    customer_id: row.customer_id as string,
    service_type: row.service_type as string,
    description: row.description as string,
    budget_range: row.budget_range as string,
    timeline: row.timeline as string,
    status: row.status as Lead["status"],
    priority_score: (row.priority_score as number) ?? 50,
    consultation_date: (row.consultation_date as string) ?? null,
    consultation_time: (row.consultation_time as string) ?? null,
    submitted_at: row.submitted_at as string,
    updated_at: row.updated_at as string,
    customer,
    photos: [],
  };
}

export async function fetchAppDataFromSupabase(): Promise<AppData> {
  const supabase = getSupabaseClient()!;

  const [
    { data: customers, error: custErr },
    { data: leads, error: leadErr },
    { data: photos, error: photoErr },
    { data: estimates, error: estErr },
    { data: items, error: itemErr },
    { data: appointments, error: aptErr },
    { data: notes, error: noteErr },
  ] = await Promise.all([
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("submitted_at", { ascending: false }),
    supabase.from("lead_photos").select("*"),
    supabase.from("estimates").select("*").order("updated_at", { ascending: false }),
    supabase.from("estimate_items").select("*").order("sort_order", { ascending: true }),
    supabase.from("appointments").select("*").order("start_at", { ascending: true }),
    supabase.from("notes").select("*").order("created_at", { ascending: false }),
  ]);

  if (custErr) throw custErr;
  if (leadErr) throw leadErr;
  if (photoErr) throw photoErr;
  if (estErr) throw estErr;
  if (itemErr) throw itemErr;
  if (aptErr) throw aptErr;
  if (noteErr) throw noteErr;

  const customerMap = new Map(
    (customers ?? []).map((c) => [c.id as string, mapCustomer(c as Record<string, unknown>)])
  );

  const photoUrls = await Promise.all(
    (photos ?? []).map(async (p) => {
      const path = p.storage_path as string;
      const { data } = supabase.storage.from("lead-photos").getPublicUrl(path);
      return {
        id: p.id as string,
        lead_id: p.lead_id as string,
        storage_path: path,
        url: data.publicUrl,
        created_at: p.created_at as string,
      } satisfies LeadPhoto;
    })
  );

  const photosByLead = new Map<string, LeadPhoto[]>();
  for (const photo of photoUrls) {
    const list = photosByLead.get(photo.lead_id) ?? [];
    list.push(photo);
    photosByLead.set(photo.lead_id, list);
  }

  const mappedLeads: Lead[] = (leads ?? []).map((row) => {
    const lead = mapLead(row as Record<string, unknown>, customerMap.get(row.customer_id as string));
    lead.photos = photosByLead.get(lead.id) ?? [];
    return lead;
  });

  const itemsByEstimate = new Map<string, EstimateItem[]>();
  for (const item of items ?? []) {
    const estId = item.estimate_id as string;
    const list = itemsByEstimate.get(estId) ?? [];
    list.push({
      id: item.id as string,
      estimate_id: estId,
      description: item.description as string,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      sort_order: (item.sort_order as number) ?? 0,
    });
    itemsByEstimate.set(estId, list);
  }

  const mappedEstimates: Estimate[] = (estimates ?? []).map((row) => ({
    id: row.id as string,
    lead_id: row.lead_id as string,
    customer_id: row.customer_id as string,
    status: row.status as Estimate["status"],
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    total: Number(row.total),
    notes: (row.notes as string) ?? null,
    sent_at: (row.sent_at as string) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    items: itemsByEstimate.get(row.id as string) ?? [],
  }));

  const { data: profile } = await supabase
    .from("users")
    .select("company_name, logo_url, email_notifications, estimate_template, tax_rate")
    .maybeSingle();

  const defaults = getInitialAppData();

  return {
    customers: Array.from(customerMap.values()),
    leads: mappedLeads,
    estimates: mappedEstimates,
    appointments: (appointments ?? []) as Appointment[],
    notes: (notes ?? []) as Note[],
    settings: {
      company_name: (profile?.company_name as string) ?? defaults.settings.company_name,
      logo_url: (profile?.logo_url as string) ?? null,
      email_notifications: (profile?.email_notifications as boolean) ?? true,
      estimate_template:
        (profile?.estimate_template as string) ?? defaults.settings.estimate_template,
      tax_rate: Number(profile?.tax_rate ?? defaults.settings.tax_rate),
    },
  };
}

export async function hasSupabaseSession(): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}
