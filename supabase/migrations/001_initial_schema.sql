-- ContractorFlow initial schema
-- Run in Supabase SQL Editor or via CLI

create extension if not exists "uuid-ossp";

create type user_role as enum ('contractor', 'customer');
create type lead_status as enum (
  'New Lead',
  'Contacted',
  'Consultation Scheduled',
  'Estimate Sent',
  'Negotiation',
  'Won',
  'Lost'
);
create type estimate_status as enum ('draft', 'sent', 'accepted', 'rejected');
create type appointment_type as enum ('consultation', 'follow_up', 'estimate_meeting');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role user_role not null default 'contractor',
  company_name text,
  logo_url text,
  tax_rate numeric(5,2) default 8.25,
  email_notifications boolean default true,
  estimate_template text,
  created_at timestamptz default now()
);

create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  service_type text not null,
  description text not null,
  budget_range text not null,
  timeline text not null,
  status lead_status not null default 'New Lead',
  priority_score integer default 50,
  consultation_date date,
  consultation_time time,
  submitted_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.lead_photos (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz default now()
);

create table public.estimates (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  status estimate_status not null default 'draft',
  subtotal numeric(12,2) default 0,
  tax numeric(12,2) default 0,
  total numeric(12,2) default 0,
  notes text,
  sent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.estimate_items (
  id uuid primary key default uuid_generate_v4(),
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  sort_order integer default 0
);

create table public.appointments (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  title text not null,
  type appointment_type not null default 'consultation',
  start_at timestamptz not null,
  end_at timestamptz not null,
  notes text,
  created_at timestamptz default now()
);

create table public.notes (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create index idx_leads_status on public.leads(status);
create index idx_leads_customer on public.leads(customer_id);
create index idx_estimates_lead on public.estimates(lead_id);
create index idx_appointments_start on public.appointments(start_at);

alter table public.users enable row level security;
alter table public.customers enable row level security;
alter table public.leads enable row level security;
alter table public.lead_photos enable row level security;
alter table public.estimates enable row level security;
alter table public.estimate_items enable row level security;
alter table public.appointments enable row level security;
alter table public.notes enable row level security;

-- Public can insert leads (customer portal)
create policy "Anyone can create customers" on public.customers
  for insert with check (true);

create policy "Anyone can create leads" on public.leads
  for insert with check (true);

create policy "Anyone can upload lead photos" on public.lead_photos
  for insert with check (true);

-- Contractors (authenticated) full access
create policy "Contractors manage customers" on public.customers
  for all using (auth.role() = 'authenticated');

create policy "Contractors manage leads" on public.leads
  for all using (auth.role() = 'authenticated');

create policy "Contractors manage photos" on public.lead_photos
  for all using (auth.role() = 'authenticated');

create policy "Contractors manage estimates" on public.estimates
  for all using (auth.role() = 'authenticated');

create policy "Contractors manage estimate items" on public.estimate_items
  for all using (auth.role() = 'authenticated');

create policy "Contractors manage appointments" on public.appointments
  for all using (auth.role() = 'authenticated');

create policy "Contractors manage notes" on public.notes
  for all using (auth.role() = 'authenticated');

create policy "Users manage own profile" on public.users
  for all using (auth.uid() = id);

-- Storage bucket: lead-photos (create in dashboard)
-- insert into storage.buckets (id, name, public) values ('lead-photos', 'lead-photos', true);
