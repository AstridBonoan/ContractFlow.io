import type {
  ActivityItem,
  Appointment,
  Customer,
  DashboardMetrics,
  Estimate,
  Lead,
  Note,
} from "@/types";

const now = new Date();
const daysAgo = (n: number) =>
  new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    full_name: "Sarah Mitchell",
    email: "sarah.mitchell@email.com",
    phone: "(555) 234-5678",
    address: "142 Oak Street, Portland, OR 97201",
    notes: "Prefers morning consultations",
    created_at: daysAgo(14),
    updated_at: daysAgo(2),
  },
  {
    id: "cust-2",
    full_name: "James Chen",
    email: "james.chen@email.com",
    phone: "(555) 876-5432",
    address: "88 Maple Ave, Seattle, WA 98101",
    notes: null,
    created_at: daysAgo(10),
    updated_at: daysAgo(5),
  },
  {
    id: "cust-3",
    full_name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "(555) 111-2222",
    address: "501 Pine Rd, Austin, TX 78701",
    notes: "Repeat customer - kitchen 2019",
    created_at: daysAgo(30),
    updated_at: daysAgo(1),
  },
];

export const DEMO_LEADS: Lead[] = [
  {
    id: "lead-1",
    customer_id: "cust-1",
    service_type: "Kitchen Remodel",
    description:
      "Full kitchen remodel including cabinets, countertops, and new appliances. Open concept layout preferred.",
    budget_range: "$25,000-$50,000",
    timeline: "1-3 Months",
    status: "New Lead",
    priority_score: 85,
    consultation_date: "2026-06-15",
    consultation_time: "10:00",
    submitted_at: daysAgo(1),
    updated_at: daysAgo(1),
    customer: DEMO_CUSTOMERS[0],
    photos: [
      {
        id: "photo-1",
        lead_id: "lead-1",
        storage_path: "demo/kitchen1.jpg",
        url: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400",
        created_at: daysAgo(1),
      },
    ],
  },
  {
    id: "lead-2",
    customer_id: "cust-2",
    service_type: "Roofing",
    description:
      "Replace asphalt shingles on 2,200 sq ft home. Some water damage near chimney needs repair.",
    budget_range: "$10,000-$25,000",
    timeline: "ASAP",
    status: "Consultation Scheduled",
    priority_score: 92,
    consultation_date: "2026-06-08",
    consultation_time: "14:30",
    submitted_at: daysAgo(3),
    updated_at: daysAgo(2),
    customer: DEMO_CUSTOMERS[1],
    photos: [],
  },
  {
    id: "lead-3",
    customer_id: "cust-3",
    service_type: "Bathroom Remodel",
    description:
      "Master bath renovation: walk-in shower, double vanity, heated floors.",
    budget_range: "$50,000+",
    timeline: "Within 1 Month",
    status: "Estimate Sent",
    priority_score: 78,
    consultation_date: "2026-06-05",
    consultation_time: "09:00",
    submitted_at: daysAgo(7),
    updated_at: daysAgo(4),
    customer: DEMO_CUSTOMERS[2],
    photos: [],
  },
  {
    id: "lead-4",
    customer_id: "cust-1",
    service_type: "Deck Construction",
    description: "Composite deck approximately 400 sq ft with built-in seating.",
    budget_range: "$10,000-$25,000",
    timeline: "Flexible",
    status: "Negotiation",
    priority_score: 65,
    consultation_date: null,
    consultation_time: null,
    submitted_at: daysAgo(12),
    updated_at: daysAgo(6),
    customer: DEMO_CUSTOMERS[0],
    photos: [],
  },
  {
    id: "lead-5",
    customer_id: "cust-2",
    service_type: "Painting",
    description: "Interior painting for 3BR home, neutral colors.",
    budget_range: "$5,000-$10,000",
    timeline: "1-3 Months",
    status: "Won",
    priority_score: 40,
    consultation_date: null,
    consultation_time: null,
    submitted_at: daysAgo(20),
    updated_at: daysAgo(8),
    customer: DEMO_CUSTOMERS[1],
    photos: [],
  },
];

export const DEMO_ESTIMATES: Estimate[] = [
  {
    id: "est-1",
    lead_id: "lead-3",
    customer_id: "cust-3",
    status: "sent",
    subtotal: 48500,
    tax: 4001.25,
    total: 52501.25,
    notes: "Premium fixtures included",
    sent_at: daysAgo(4),
    created_at: daysAgo(5),
    updated_at: daysAgo(4),
    items: [
      {
        id: "item-1",
        estimate_id: "est-1",
        description: "Demolition & disposal",
        quantity: 1,
        unit_price: 3500,
        sort_order: 0,
      },
      {
        id: "item-2",
        estimate_id: "est-1",
        description: "Walk-in shower install",
        quantity: 1,
        unit_price: 12000,
        sort_order: 1,
      },
      {
        id: "item-3",
        estimate_id: "est-1",
        description: "Double vanity & plumbing",
        quantity: 1,
        unit_price: 8500,
        sort_order: 2,
      },
      {
        id: "item-4",
        estimate_id: "est-1",
        description: "Heated flooring",
        quantity: 120,
        unit_price: 45,
        sort_order: 3,
      },
    ],
  },
  {
    id: "est-2",
    lead_id: "lead-4",
    customer_id: "cust-1",
    status: "draft",
    subtotal: 18500,
    tax: 1526.25,
    total: 20026.25,
    notes: null,
    sent_at: null,
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    items: [
      {
        id: "item-5",
        estimate_id: "est-2",
        description: "Composite decking material",
        quantity: 400,
        unit_price: 28,
        sort_order: 0,
      },
      {
        id: "item-6",
        estimate_id: "est-2",
        description: "Labor & installation",
        quantity: 1,
        unit_price: 7300,
        sort_order: 1,
      },
    ],
  },
];

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    lead_id: "lead-2",
    customer_id: "cust-2",
    title: "Roof inspection - James Chen",
    type: "consultation",
    start_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 30).toISOString(),
    end_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 30).toISOString(),
    notes: "Bring ladder",
    created_at: daysAgo(2),
  },
  {
    id: "apt-2",
    lead_id: "lead-3",
    customer_id: "cust-3",
    title: "Estimate follow-up - Emily Rodriguez",
    type: "follow_up",
    start_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 0).toISOString(),
    end_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 30).toISOString(),
    notes: null,
    created_at: daysAgo(1),
  },
];

export const DEMO_NOTES: Note[] = [
  {
    id: "note-1",
    lead_id: "lead-1",
    customer_id: null,
    content: "Customer very motivated, budget flexible for right design.",
    created_at: daysAgo(1),
  },
];

export function computeMetrics(leads: Lead[], estimates: Estimate[]): DashboardMetrics {
  const newLeads = leads.filter((l) => l.status === "New Lead").length;
  const estimatesSent = estimates.filter((e) => e.status === "sent" || e.status === "accepted").length;
  const jobsWon = leads.filter((l) => l.status === "Won").length;
  const revenuePipeline = estimates
    .filter((e) => e.status === "sent" || e.status === "draft")
    .reduce((sum, e) => sum + e.total, 0);

  return { newLeads, estimatesSent, jobsWon, revenuePipeline };
}

export function getDemoActivities(): ActivityItem[] {
  return [
    {
      id: "act-1",
      type: "lead",
      title: "New lead received",
      description: "Sarah Mitchell submitted a Kitchen Remodel request",
      timestamp: daysAgo(1),
    },
    {
      id: "act-2",
      type: "estimate",
      title: "Estimate sent",
      description: "Bathroom remodel estimate sent to Emily Rodriguez",
      timestamp: daysAgo(4),
    },
    {
      id: "act-3",
      type: "appointment",
      title: "Consultation scheduled",
      description: "Roof inspection with James Chen",
      timestamp: daysAgo(2),
    },
    {
      id: "act-4",
      type: "lead",
      title: "Status updated",
      description: "Deck project moved to Negotiation",
      timestamp: daysAgo(6),
    },
  ];
}

export const STORAGE_KEY = "contractorflow_data";

export interface AppData {
  leads: Lead[];
  customers: Customer[];
  estimates: Estimate[];
  appointments: Appointment[];
  notes: Note[];
  settings: {
    company_name: string;
    logo_url: string | null;
    email_notifications: boolean;
    estimate_template: string;
    tax_rate: number;
  };
}

export function getInitialAppData(): AppData {
  return {
    leads: DEMO_LEADS,
    customers: DEMO_CUSTOMERS,
    estimates: DEMO_ESTIMATES,
    appointments: DEMO_APPOINTMENTS,
    notes: DEMO_NOTES,
    settings: {
      company_name: "Summit Build Co.",
      logo_url: null,
      email_notifications: true,
      estimate_template: "Professional estimate for your project",
      tax_rate: 8.25,
    },
  };
}
