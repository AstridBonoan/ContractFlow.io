import type {
  AppointmentType,
  BudgetRange,
  EstimateStatus,
  LeadStatus,
  ServiceType,
  Timeline,
} from "@/lib/constants";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: "contractor" | "customer";
  company_name: string | null;
  logo_url: string | null;
  tax_rate: number;
  email_notifications: boolean;
  estimate_template: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  customer_id: string;
  service_type: ServiceType | string;
  description: string;
  budget_range: BudgetRange | string;
  timeline: Timeline | string;
  status: LeadStatus;
  priority_score: number;
  consultation_date: string | null;
  consultation_time: string | null;
  submitted_at: string;
  updated_at: string;
  customer?: Customer;
  photos?: LeadPhoto[];
  notes?: Note[];
}

export interface LeadPhoto {
  id: string;
  lead_id: string;
  storage_path: string;
  url: string;
  created_at: string;
}

export interface Estimate {
  id: string;
  lead_id: string;
  customer_id: string;
  status: EstimateStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  items?: EstimateItem[];
  lead?: Lead;
  customer?: Customer;
}

export interface EstimateItem {
  id: string;
  estimate_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
}

export interface Appointment {
  id: string;
  lead_id: string | null;
  customer_id: string | null;
  title: string;
  type: AppointmentType;
  start_at: string;
  end_at: string;
  notes: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  lead_id: string | null;
  customer_id: string | null;
  content: string;
  created_at: string;
}

export interface ContractorSettings {
  company_name: string;
  logo_url: string | null;
  email_notifications: boolean;
  estimate_template: string;
  tax_rate: number;
}

export interface DashboardMetrics {
  newLeads: number;
  estimatesSent: number;
  jobsWon: number;
  revenuePipeline: number;
}

export interface ActivityItem {
  id: string;
  type: "lead" | "estimate" | "appointment" | "note";
  title: string;
  description: string;
  timestamp: string;
}

export interface ProjectRequestInput {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  service_type: string;
  description: string;
  budget_range: string;
  timeline: string;
  consultation_date?: string;
  consultation_time?: string;
  photos: File[];
}
