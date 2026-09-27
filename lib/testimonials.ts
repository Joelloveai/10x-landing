export type TestimonialData = {
  name: string;
  role: string;
  text: string;
  /** First letter of the name, used for the avatar. */
  initial: string;
  /** Placeholder cities. Confirm each with the customer before relying on them. */
  city: string;
};

/** Kept for existing consumers (hero cards) that read `quote`. Same string as `text`. */
export type Testimonial = TestimonialData & { quote: string };

/**
 * Customer feedback supplied by 10X. Render the text exactly as stored.
 */
const data: TestimonialData[] = [
  {
    name: "Marcus T. K. Loke",
    role: "Property Agent",
    text: "Used 10X for a while. Helps me keep track of follow-ups. Before I always forget. Now less messy. Good for property agents.",
    initial: "M",
    city: "Kuala Lumpur",
  },
  {
    name: "Audrey Wong",
    role: "Property Agent",
    text: "I didn't expect much when I first tried 10X. But it actually helped me stay more organised with follow-ups. I'm still using it.",
    initial: "A",
    city: "Petaling Jaya",
  },
  {
    name: "Elaine Choo",
    role: "Aesthetic Clinic Owner",
    text: "10X helped me manage bookings and follow-ups better. Before this, things could get messy when many clients message at the same time.",
    initial: "E",
    city: "Kuala Lumpur",
  },
  {
    name: "Adrian Chin",
    role: "Home Service Operator",
    text: "I do home service jobs so my schedule is always changing. 10X makes it easier to track jobs and appointments. Customers get updates faster too.",
    initial: "A",
    city: "Petaling Jaya",
  },
  {
    name: "Vanessa Yeap",
    role: "Education Centre Director",
    text: "Will recommend to my colleagues. The follow-up system keeps parents engaged.",
    initial: "V",
    city: "Kuala Lumpur",
  },
  {
    name: "Li Tian Qi",
    role: "Massage Therapist",
    text: "Very good. I free up my hands and the system handles the bookings.",
    initial: "L",
    city: "Petaling Jaya",
  },
  {
    name: "Wei Rong",
    role: "Property Agent",
    text: "I can focus on doing what I love more. The follow-ups happen automatically.",
    initial: "W",
    city: "Kuala Lumpur",
  },
];

export const testimonials: Testimonial[] = data.map((t) => ({ ...t, quote: t.text }));

/** The three shown under the hero product: Marcus, Audrey, Elaine. */
export const heroTestimonials = ["Marcus T. K. Loke", "Audrey Wong", "Elaine Choo"].map(
  (name) => testimonials.find((t) => t.name === name)!,
);

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part) && !part.endsWith("."))
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
