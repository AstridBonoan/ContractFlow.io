export const SERVICE_TYPES = [
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Roofing",
  "Flooring",
  "Painting",
  "Electrical",
  "Plumbing",
  "General Construction",
  "Deck Construction",
  "Landscaping",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000-$10,000",
  "$10,000-$25,000",
  "$25,000-$50,000",
  "$50,000+",
] as const;

export const TIMELINES = [
  "ASAP",
  "Within 1 Month",
  "1-3 Months",
  "Flexible",
] as const;

export const LEAD_STATUSES = [
  "New Lead",
  "Contacted",
  "Consultation Scheduled",
  "Estimate Sent",
  "Negotiation",
  "Won",
  "Lost",
] as const;

export const ESTIMATE_STATUSES = [
  "draft",
  "sent",
  "accepted",
  "rejected",
] as const;

export const APPOINTMENT_TYPES = [
  "consultation",
  "follow_up",
  "estimate_meeting",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];
export type BudgetRange = (typeof BUDGET_RANGES)[number];
export type Timeline = (typeof TIMELINES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type EstimateStatus = (typeof ESTIMATE_STATUSES)[number];
export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];

export const FUNNEL_STAGES: LeadStatus[] = [
  "New Lead",
  "Estimate Sent",
  "Negotiation",
  "Won",
];
