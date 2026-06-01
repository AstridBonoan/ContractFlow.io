"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoUploader } from "@/components/portal/photo-uploader";
import { BUDGET_RANGES, SERVICE_TYPES, TIMELINES } from "@/lib/constants";
import { dataStore } from "@/lib/store";
import { useAppData } from "@/components/providers/data-provider";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

const schema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone number required"),
  address: z.string().min(5, "Address is required"),
  service_type: z.string().min(1, "Select a service"),
  description: z.string().min(20, "Please describe your project (min 20 characters)"),
  budget_range: z.string().min(1, "Select a budget"),
  timeline: z.string().min(1, "Select a timeline"),
  consultation_date: z.string().optional(),
  consultation_time: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProjectRequestForm() {
  const { refresh } = useAppData();
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      consultation_time: "09:00",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient()!;
        const { data: customer, error: custErr } = await supabase
          .from("customers")
          .insert({
            full_name: values.full_name,
            email: values.email,
            phone: values.phone,
            address: values.address,
          })
          .select()
          .single();
        if (custErr) throw custErr;

        const { data: lead, error: leadErr } = await supabase
          .from("leads")
          .insert({
            customer_id: customer.id,
            service_type: values.service_type,
            description: values.description,
            budget_range: values.budget_range,
            timeline: values.timeline,
            consultation_date: values.consultation_date || null,
            consultation_time: values.consultation_time || null,
            priority_score: 50,
          })
          .select()
          .single();
        if (leadErr) throw leadErr;

        for (const file of photos) {
          const path = `${lead.id}/${Date.now()}-${file.name}`;
          await supabase.storage.from("lead-photos").upload(path, file);
          await supabase.from("lead_photos").insert({ lead_id: lead.id, storage_path: path });
        }
      } else {
        dataStore.submitProjectRequest({ ...values, photos });
      }
      refresh();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      dataStore.submitProjectRequest({ ...values, photos });
      refresh();
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg text-center"
      >
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardContent className="flex flex-col items-center py-12">
            <CheckCircle2 className="h-16 w-16 text-emerald-600" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              Your request has been submitted successfully.
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              A contractor will review your project and contact you shortly.
            </p>
            <Button className="mt-6" onClick={() => setSubmitted(false)}>
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        id="request-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl"
      >
        <Card>
          <CardHeader>
            <CardTitle>Project Request Form</CardTitle>
            <CardDescription>
              Complete the form below and we&apos;ll match you with a qualified contractor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500">
                  Customer Information
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" {...register("full_name")} />
                    {errors.full_name && <p className="text-xs text-red-600">{errors.full_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" {...register("phone")} />
                    {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Property Address</Label>
                    <Input id="address" {...register("address")} />
                    {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500">
                  Project Details
                </legend>
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select
                    value={watch("service_type")}
                    onValueChange={(v) => setValue("service_type", v, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service_type && <p className="text-xs text-red-600">{errors.service_type.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea id="description" rows={5} {...register("description")} />
                  {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Budget Range</Label>
                    <Select
                      value={watch("budget_range")}
                      onValueChange={(v) => setValue("budget_range", v, { shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_RANGES.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.budget_range && <p className="text-xs text-red-600">{errors.budget_range.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Desired Timeline</Label>
                    <Select
                      value={watch("timeline")}
                      onValueChange={(v) => setValue("timeline", v, { shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMELINES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.timeline && <p className="text-xs text-red-600">{errors.timeline.message}</p>}
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500">
                  Photo Upload
                </legend>
                <PhotoUploader files={photos} onChange={setPhotos} />
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500">
                  Consultation Scheduling
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="consultation_date">Preferred Date</Label>
                    <Input id="consultation_date" type="date" {...register("consultation_date")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultation_time">Preferred Time</Label>
                    <Input id="consultation_time" type="time" {...register("consultation_time")} />
                  </div>
                </div>
              </fieldset>

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Submitting...
                  </>
                ) : (
                  "Request Estimate"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
