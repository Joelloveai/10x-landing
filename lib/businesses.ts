export type BusinessSlug = "property" | "clinics" | "education" | "home-services" | "appointments";

export type BusinessCategory = {
  slug: BusinessSlug;
  /** Tab label. */
  name: string;
  /** Uppercase label used as the scenario title. */
  label: string;
  examples: string[];
  /** The leak, in one or two short sentences. */
  problem: string;
  workflow: string[];
  aiActions: string[];
  /** Only set where a value range was supplied by 10X. Never invent one. */
  valueRange?: string;
  valueLabel?: string;
  /** Starting value (RM) for the loss calculator preset. Illustrative only. */
  calculatorValue: number;
  /** Optional boundary note shown with AI actions. */
  aiNote?: string;
  /** Fictional demo data for product simulations. */
  demo: {
    board: { stage: string; name: string; meta: string }[];
    nextAction: string;
    chat: { from: "lead" | "ai" | "event"; text: string }[];
  };
  /** Used in contextual CTAs, e.g. "for your property team". */
  ctaContext: string;
};

export const businesses: BusinessCategory[] = [
  {
    slug: "property",
    name: "Property",
    label: "PROPERTY",
    examples: ["Property agents", "Sales teams", "Agencies"],
    problem: "The enquiry arrives after hours. The lead waits for someone to reply.",
    workflow: ["Enquiry", "Qualify", "Viewing", "Follow-Up"],
    aiActions: [
      "Capture enquiry",
      "Qualify budget, area and timeline",
      "Book viewings",
      "Follow-up",
      "Reactivation",
      "Listing copy draft",
    ],
    valueRange: "RM5,000–RM20,000",
    valueLabel: "Deal value",
    calculatorValue: 10000,
    demo: {
      board: [
        { stage: "Enquiry", name: "Sarah Tan", meta: "Mont Kiara · 11:42 PM" },
        { stage: "Qualify", name: "Daniel Lim", meta: "RM700k · this month" },
        { stage: "Viewing", name: "Aisyah R.", meta: "Sat · 2:00 PM" },
        { stage: "Follow-Up", name: "Kumar S.", meta: "Day 3 · due today" },
      ],
      nextAction: "Viewing with Sarah Tan · Saturday 2:00 PM",
      chat: [
        { from: "lead", text: "Hi, is this unit still available?" },
        { from: "ai", text: "Hi Sarah, yes it is. To shortlist the right units, what budget and move-in timing are you looking at?" },
        { from: "lead", text: "Around RM700k. This month if possible." },
        { from: "ai", text: "Noted. Jason can show you two units this Saturday. 11:00 AM or 2:00 PM?" },
        { from: "event", text: "Viewing request sent to Jason for approval" },
      ],
    },
    ctaContext: "property team",
  },
  {
    slug: "clinics",
    name: "Clinics",
    label: "CLINICS",
    examples: ["Aesthetic", "Dental"],
    problem: "Calls, messages and appointments keep coming while staff are serving customers.",
    workflow: ["Enquiry", "Qualification", "Booking", "Reminder", "Recall"],
    aiActions: ["Booking", "Qualification", "Reminder", "Recall", "Review request", "Follow-up"],
    valueRange: "RM150–RM5,000",
    valueLabel: "Treatment value",
    calculatorValue: 1000,
    aiNote: "AI supports the team. It does not replace clinical judgment.",
    demo: {
      board: [
        { stage: "Enquiry", name: "Nurul A.", meta: "Acne scars · 10:15 PM" },
        { stage: "Qualification", name: "Mr. Lee", meta: "Scaling & polish" },
        { stage: "Booking", name: "Grace L.", meta: "Thu · 3:30 PM" },
        { stage: "Reminder", name: "Priya N.", meta: "Tomorrow · 9:30 AM" },
        { stage: "Recall", name: "Siti H.", meta: "6-month recall due" },
      ],
      nextAction: "Consultation with Nurul A. · Thursday 11:00 AM",
      chat: [
        { from: "lead", text: "My tooth very painful since last night. Can see doctor today?" },
        { from: "ai", text: "I'm sorry you're in pain. I'm alerting the clinic team now so someone can call you shortly." },
        { from: "event", text: "Escalated to clinic team · severe pain" },
        { from: "ai", text: "While you wait, may I confirm your name and the best number to reach you?" },
      ],
    },
    ctaContext: "clinic",
  },
  {
    slug: "education",
    name: "Education & Training",
    label: "EDUCATION & TRAINING",
    examples: ["Tuition", "Academies", "Training providers", "Coaches", "Courses"],
    problem: "Someone asks about a programme. Nobody follows up after the first conversation.",
    workflow: ["Enquiry", "Qualification", "Trial/Class Booking", "Follow-Up", "Enrolment"],
    aiActions: [
      "Course enquiry",
      "Programme matching",
      "Trial class booking",
      "Reminder",
      "Parent/student follow-up",
      "Unresponsive-lead follow-up",
      "Enrolment follow-up",
    ],
    calculatorValue: 1500,
    demo: {
      board: [
        { stage: "Enquiry", name: "Mrs. Wong", meta: "Year 5 Maths · 9:40 PM" },
        { stage: "Qualification", name: "Hafiz R.", meta: "IELTS · evening classes" },
        { stage: "Trial/Class Booking", name: "Chloe T.", meta: "Trial · Sat 10:00 AM" },
        { stage: "Follow-Up", name: "Arjun K.", meta: "No reply · Day 3" },
        { stage: "Enrolment", name: "Mei Xin", meta: "Term 2 · form sent" },
      ],
      nextAction: "Trial class for Mrs. Wong's son · Saturday 10:00 AM",
      chat: [
        { from: "lead", text: "Hi, do you have maths tuition for Year 5? What's the fee?" },
        { from: "ai", text: "Hi! Yes, we do. Is it for school exams or catching up on basics? And which days suit your child?" },
        { from: "lead", text: "School exams. Saturday morning better." },
        { from: "ai", text: "There's a free trial class this Saturday at 10:00 AM. Shall I reserve a seat?" },
        { from: "event", text: "Trial class booked · reminder scheduled for Friday" },
      ],
    },
    ctaContext: "centre",
  },
  {
    slug: "home-services",
    name: "Home Services",
    label: "HOME SERVICES",
    examples: ["Aircon", "Plumbing", "Electrical", "Cleaning", "Maintenance"],
    problem: "The schedule changes. The customer needs an update.",
    workflow: ["Request", "Assign", "Dispatch", "Update", "Complete"],
    aiActions: [
      "Job request",
      "Assignment",
      "Scheduling",
      "Customer update",
      "Quotation follow-up",
      "Payment reminder",
      "Review request",
    ],
    valueRange: "RM150–RM5,000",
    valueLabel: "Job value",
    calculatorValue: 600,
    demo: {
      board: [
        { stage: "Request", name: "Aircon service", meta: "Puchong · 2 units" },
        { stage: "Assign", name: "Pipe leak", meta: "Cheras · Faiz" },
        { stage: "Dispatch", name: "Deep cleaning", meta: "Subang · 10:00 AM" },
        { stage: "Update", name: "Wiring check", meta: "Running 20 min late" },
        { stage: "Complete", name: "Water heater", meta: "Done · review sent" },
      ],
      nextAction: "Faiz · Aircon service, Puchong · Tuesday 10:00 AM",
      chat: [
        { from: "lead", text: "Aircon not cold. Can send someone tomorrow?" },
        { from: "ai", text: "Sure. How many units, and is Tuesday 10:00 AM or 3:00 PM better?" },
        { from: "lead", text: "2 units. 10am ok." },
        { from: "ai", text: "Booked. Faiz will attend. You'll get an update when he's on the way." },
        { from: "event", text: "Technician assigned · Faiz · Tue 10:00 AM" },
      ],
    },
    ctaContext: "service team",
  },
  {
    slug: "appointments",
    name: "Appointment Businesses",
    label: "APPOINTMENT BUSINESSES",
    examples: ["Beauty", "Wellness", "Fitness", "Consulting", "Professional services"],
    problem: "The customer wants an appointment now. Your team may not be ready to respond now.",
    workflow: ["Enquiry", "Qualify", "Book", "Reminder", "Return"],
    aiActions: ["Enquiry", "Qualification", "Booking", "Reminder", "No-show follow-up", "Rebooking", "Return visit"],
    calculatorValue: 250,
    demo: {
      board: [
        { stage: "Enquiry", name: "Jess L.", meta: "Massage · 8:55 PM" },
        { stage: "Qualify", name: "Ryan O.", meta: "PT package · weekdays" },
        { stage: "Book", name: "Farah Z.", meta: "Fri · 7:00 PM" },
        { stage: "Reminder", name: "Ken W.", meta: "Tomorrow · 11:00 AM" },
        { stage: "Return", name: "Aina M.", meta: "Due for next session" },
      ],
      nextAction: "Massage for Jess L. · Friday 7:00 PM",
      chat: [
        { from: "lead", text: "Hi, got slot for massage tomorrow evening?" },
        { from: "ai", text: "Hi Jess! Tomorrow we have 7:00 PM or 8:30 PM. 60 or 90 minutes?" },
        { from: "lead", text: "7pm, 60 min." },
        { from: "ai", text: "Booked for 7:00 PM. We'll send a reminder the day before." },
        { from: "event", text: "Reminder scheduled · rebooking prompt after visit" },
      ],
    },
    ctaContext: "business",
  },
];

export const businessBySlug = Object.fromEntries(businesses.map((b) => [b.slug, b])) as Record<
  BusinessSlug,
  BusinessCategory
>;

/** Options for the optional "business type" step of the audit form. */
export const businessTypeOptions = [
  { value: "property", label: "Property" },
  { value: "clinics", label: "Clinics" },
  { value: "education", label: "Education & Training" },
  { value: "home-services", label: "Home Services" },
  { value: "appointments", label: "Appointment Business" },
  { value: "other", label: "Other" },
] as const;

export type BusinessTypeOption = (typeof businessTypeOptions)[number]["value"];
