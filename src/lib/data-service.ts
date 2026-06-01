import type { AppData } from "@/lib/demo-data";
import { dataStore } from "@/lib/store";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase/client";
import { fetchAppDataFromSupabase, hasSupabaseSession } from "@/lib/supabase/data";
import type { Lead, ProjectRequestInput } from "@/types";

/** Load dashboard data: Supabase when contractor has a session, otherwise localStorage. */
export async function loadAppData(): Promise<AppData> {
  if (isSupabaseConfigured() && (await hasSupabaseSession())) {
    try {
      return await fetchAppDataFromSupabase();
    } catch (err) {
      console.error("Failed to load from Supabase, using local data:", err);
    }
  }
  return dataStore.get();
}

/** Submit homeowner request — always saves locally; also writes to Supabase when available. */
export async function submitProjectRequest(input: ProjectRequestInput): Promise<Lead> {
  const lead = dataStore.submitProjectRequest(input);

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient()!;
      const { data: customer, error: custErr } = await supabase
        .from("customers")
        .insert({
          full_name: input.full_name,
          email: input.email,
          phone: input.phone,
          address: input.address,
        })
        .select()
        .single();
      if (custErr) throw custErr;

      const { data: remoteLead, error: leadErr } = await supabase
        .from("leads")
        .insert({
          customer_id: customer.id,
          service_type: input.service_type,
          description: input.description,
          budget_range: input.budget_range,
          timeline: input.timeline,
          consultation_date: input.consultation_date || null,
          consultation_time: input.consultation_time || null,
          priority_score: lead.priority_score,
          status: "New Lead",
        })
        .select()
        .single();
      if (leadErr) throw leadErr;

      for (const file of input.photos) {
        const path = `${remoteLead.id}/${Date.now()}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("lead-photos").upload(path, file);
        if (!uploadErr) {
          await supabase.from("lead_photos").insert({
            lead_id: remoteLead.id,
            storage_path: path,
          });
        }
      }

      if (input.consultation_date) {
        const start = new Date(
          `${input.consultation_date}T${input.consultation_time || "09:00"}`
        );
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        await supabase.from("appointments").insert({
          lead_id: remoteLead.id,
          customer_id: customer.id,
          title: `Consultation - ${input.full_name}`,
          type: "consultation",
          start_at: start.toISOString(),
          end_at: end.toISOString(),
          notes: input.service_type,
        });
      }
    } catch (err) {
      console.error("Supabase submit failed; lead saved locally for this browser:", err);
    }
  }

  return lead;
}

export async function updateLeadStatus(leadId: string, status: Lead["status"]) {
  dataStore.updateLeadStatus(leadId, status);
  if (!(await hasSupabaseSession())) return;

  const supabase = getSupabaseClient()!;
  await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", leadId);
}

export async function addLeadNote(leadId: string, content: string) {
  dataStore.addLeadNote(leadId, content);
  if (!(await hasSupabaseSession())) return;

  const supabase = getSupabaseClient()!;
  await supabase.from("notes").insert({ lead_id: leadId, content });
}
