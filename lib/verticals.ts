export type VerticalSlug = "property" | "aesthetic" | "dental" | "home-services";

export type Vertical = {
  slug: VerticalSlug;
  name: string;
  /** Uppercase scenario label used in the problem section. */
  label: string;
  audience: string;
  /** Two short lines that set the scene. */
  scene: [string, string];
  problem: string;
  /** Optional metric. Only set when a verified source exists (see `metricSource`). */
  metric?: string;
  metricSource?: string;
  valueLabel: string;
  valueRange: string;
  workflow: {
    stage: string;
    detail: string;
  }[];
  aiActions: string[];
  productStates: string[];
  /** Optional boundary note shown next to AI actions. */
  aiNote?: string;
  /** Default average customer value (RM) for the loss calculator. */
  calculatorValue: number;
  /** Fictional demo records used in product simulations. */
  demo: {
    board: { stage: string; name: string; meta: string }[];
    nextAction: string;
    chat: { from: "lead" | "ai" | "event"; text: string }[];
  };
  ctaContext: string;
};

export const verticals: Vertical[] = [
  {
    slug: "property",
    name: "Property",
    label: "PROPERTY",
    audience: "Property agents, team leaders and agencies",
    scene: ["The enquiry arrives after hours.", "Nobody knows who should reply."],
    problem:
      "Many enquiries arrive after working hours. By morning, the buyer may already be talking to another agent.",
    valueLabel: "Deal value",
    valueRange: "RM5,000–RM20,000",
    workflow: [
      { stage: "Enquiry", detail: "Listing, portal and ad enquiries land in one place with an owner." },
      { stage: "Qualify", detail: "Budget, area and timeline are captured before the first call." },
      { stage: "Viewing", detail: "Buyers pick a viewing slot from the agent's calendar." },
      { stage: "Follow-up", detail: "Day 1, 3, 7 and 30 follow-ups are scheduled, not remembered." },
    ],
    aiActions: [
      "Capture leads from listings and ads",
      "Qualify budget, area and timeline",
      "Offer available viewing slots",
      "Follow up on Day 1, 3, 7 and 30",
      "Reactivate old leads",
      "Draft listing descriptions and social posts",
    ],
    productStates: ["New enquiry", "Owner assigned", "Qualified", "Viewing booked", "Following up"],
    calculatorValue: 10000,
    demo: {
      board: [
        { stage: "Enquiry", name: "Sarah Tan", meta: "Mont Kiara · 11:42 PM" },
        { stage: "Qualify", name: "Daniel Lim", meta: "RM650k · 3 months" },
        { stage: "Viewing", name: "Aisyah R.", meta: "Sat · 2:00 PM" },
        { stage: "Follow-up", name: "Kumar S.", meta: "Day 3 · due today" },
      ],
      nextAction: "Viewing with Sarah Tan · Saturday 2:00 PM",
      chat: [
        { from: "lead", text: "Hi, still got units under RM700k in Mont Kiara?" },
        { from: "ai", text: "Hi Sarah, yes, a few. To shortlist, may I know your budget range and when you plan to move?" },
        { from: "lead", text: "Around 650k. Within 3 months." },
        { from: "ai", text: "Thanks. Jason can show you two units this Saturday. 11:00 AM or 2:00 PM?" },
        { from: "event", text: "Viewing request sent to Jason for approval" },
      ],
    },
    ctaContext: "property team",
  },
  {
    slug: "aesthetic",
    name: "Aesthetic",
    label: "AESTHETIC",
    audience: "Aesthetic clinics, skin centres and beauty studios",
    scene: ["Bookings arrive through WhatsApp all day.", "Manual booking chaos."],
    problem:
      "When many clients message at the same time, bookings get double-handled, reminders get skipped and chairs sit empty.",
    valueLabel: "Treatment value",
    valueRange: "RM300–RM3,000",
    workflow: [
      { stage: "Enquiry", detail: "Every booking request is captured, whatever time it arrives." },
      { stage: "Qualify", detail: "Skin concern and budget are noted before the consultation." },
      { stage: "Book", detail: "Clients pick a slot from your booking page." },
      { stage: "Remind", detail: "Reminders go out before the appointment." },
      { stage: "Recall", detail: "Clients due for the next session are brought back." },
    ],
    aiActions: [
      "24/7 booking requests",
      "Skin concern qualification",
      "Budget qualification",
      "Reminder sequence",
      "Recall for the next session",
      "Review requests",
      "Spam filtering",
    ],
    productStates: ["Booking request", "Qualified", "Booked", "Reminded", "Recalled"],
    calculatorValue: 1200,
    demo: {
      board: [
        { stage: "Enquiry", name: "Nurul A.", meta: "Acne scars · 10:15 PM" },
        { stage: "Qualify", name: "Michelle K.", meta: "Pigmentation · RM1.5k" },
        { stage: "Book", name: "Grace L.", meta: "Thu · 3:30 PM" },
        { stage: "Recall", name: "Farah Z.", meta: "Session 3 due" },
      ],
      nextAction: "Consultation with Nurul A. · Thursday 11:00 AM",
      chat: [
        { from: "lead", text: "Hi, can I book facial for acne scars?" },
        { from: "ai", text: "Hi! Sure. Is it mainly scarring, or active breakouts too? And which day suits you?" },
        { from: "lead", text: "Mostly scars. Thursday morning ok." },
        { from: "ai", text: "Noted. Thursday 11:00 AM is open for a consultation with Dr. Lim. Shall I hold it?" },
        { from: "event", text: "Reminder scheduled 24 hours before the appointment" },
      ],
    },
    ctaContext: "clinic",
  },
  {
    slug: "dental",
    name: "Dental",
    label: "DENTAL",
    audience: "Dental clinics and group practices",
    scene: ["The dentist is treating a patient when the phone rings.", "Missed calls."],
    problem:
      "The front desk is busy, the dentist is chairside and the caller hangs up. Not every caller tries again.",
    valueLabel: "Treatment value",
    valueRange: "RM150–RM5,000",
    workflow: [
      { stage: "Call", detail: "Missed calls and messages become tracked enquiries." },
      { stage: "Book", detail: "Patients book cleaning or consultation slots." },
      { stage: "Treat", detail: "The team sees who is coming and why." },
      { stage: "Recall", detail: "Overdue patients are reminded to come back." },
    ],
    aiActions: [
      "Cleaning booking",
      "Consultation booking",
      "Follow-up booking",
      "Overdue recall",
      "Post-op information",
      "Pricing FAQs",
      "Escalation for severe pain",
    ],
    aiNote: "AI supports the team. It does not replace clinical judgment.",
    productStates: ["Missed call", "Booked", "Treated", "Recall due"],
    calculatorValue: 800,
    demo: {
      board: [
        { stage: "Call", name: "Mr. Lee", meta: "Missed call · 12:05 PM" },
        { stage: "Book", name: "Priya N.", meta: "Scaling · Fri 9:30 AM" },
        { stage: "Treat", name: "Jonathan W.", meta: "Consultation · today" },
        { stage: "Recall", name: "Siti H.", meta: "6-month recall overdue" },
      ],
      nextAction: "Call back Mr. Lee · flagged by front desk",
      chat: [
        { from: "lead", text: "My tooth very painful since last night. Now a bit swollen." },
        { from: "ai", text: "I'm sorry you're in pain. I'm flagging this to the clinic team now so someone can call you shortly." },
        { from: "event", text: "Escalated to clinic team · severe pain" },
        { from: "ai", text: "While you wait, may I confirm your name and the best number to reach you?" },
      ],
    },
    ctaContext: "clinic",
  },
  {
    slug: "home-services",
    name: "Home Services",
    label: "HOME SERVICES",
    audience: "Aircon, cleaning, plumbing, renovation and repair teams",
    scene: ["The job moves. The technician moves.", "The customer needs an update."],
    problem:
      "Schedules change every day. Quotations wait for follow-up and customers chase you for updates.",
    valueLabel: "Job value",
    valueRange: "RM150–RM5,000",
    workflow: [
      { stage: "Request", detail: "Job requests come in with address and problem details." },
      { stage: "Assign", detail: "The right technician is assigned to the job." },
      { stage: "Dispatch", detail: "The schedule shows who is where, and when." },
      { stage: "Update", detail: "Customers know when the technician is coming." },
      { stage: "Review", detail: "Finished jobs lead to a review request." },
    ],
    aiActions: [
      "Booking",
      "Technician assignment",
      "Scheduling updates",
      "Customer notifications",
      "Quotation follow-up",
      "Payment reminders",
      "Review requests",
    ],
    productStates: ["Job request", "Assigned", "Dispatched", "Updated", "Reviewed"],
    calculatorValue: 600,
    demo: {
      board: [
        { stage: "Request", name: "Aircon service", meta: "Puchong · 2 units" },
        { stage: "Assign", name: "Pipe leak", meta: "Cheras · Faiz" },
        { stage: "Dispatch", name: "Deep cleaning", meta: "Subang · 10:00 AM" },
        { stage: "Review", name: "Water heater", meta: "Completed · review sent" },
      ],
      nextAction: "Faiz · Aircon service, Puchong · Tuesday 10:00 AM",
      chat: [
        { from: "lead", text: "Aircon not cold. Can send someone tomorrow?" },
        { from: "ai", text: "Sure. How many units, and is Tuesday 10:00 AM or 3:00 PM better?" },
        { from: "lead", text: "2 units. 10am ok." },
        { from: "ai", text: "Booked. Faiz will attend. You will get an update when he is on the way." },
        { from: "event", text: "Technician assigned · Faiz · Tue 10:00 AM" },
      ],
    },
    ctaContext: "service team",
  },
];

export const verticalBySlug = Object.fromEntries(verticals.map((v) => [v.slug, v])) as Record<
  VerticalSlug,
  Vertical
>;

export const verticalOptions = [
  { value: "property", label: "Property" },
  { value: "aesthetic", label: "Aesthetic" },
  { value: "dental", label: "Dental" },
  { value: "home-services", label: "Home Service" },
  { value: "other", label: "Other" },
] as const;

export type VerticalOption = (typeof verticalOptions)[number]["value"];
