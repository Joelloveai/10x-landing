export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  vertical: string;
};

/**
 * Verbatim feedback from early users. Do NOT edit, trim or correct these strings.
 * Render them exactly as stored.
 */
export const testimonials: Testimonial[] = [
  {
    name: "Marcus T. K. Loke",
    role: "Property Agent",
    quote:
      "Used 10x for a while. Helps me keep track of follow ups. Before I always forget. Now less messy. Good for property agents.",
    vertical: "property",
  },
  {
    name: "Goh En Xi",
    role: "Property Agent",
    quote:
      "It helps me keep my leads and messages in one place. I still have a lot to learn, but so far it's been helpful for my work as a property agent.",
    vertical: "property",
  },
  {
    name: "Audrey Wong",
    role: "Property Agent",
    quote:
      "I didn't expect much when I first tried 10x. I thought it would be another thing I stop using after one week. But it actually helped me stay more organised with follow-ups. I'm still using it, so that says something. If you're a property agent and always forget to follow up, can try.",
    vertical: "property",
  },
  {
    name: "Desmond Teoh",
    role: "Property Agent",
    quote:
      "10x is straightforward. Helps me track clients and follow-ups. I don't have time for complicated software. This one is okay. Gets the job done.",
    vertical: "property",
  },
  {
    name: "Brenda Ooi",
    role: "Property Agent",
    quote:
      "I like that 10x keeps me consistent. I used to have notes everywhere, WhatsApp, paper. Now it's more organised. I still miss things sometimes, but way less.",
    vertical: "property",
  },
  {
    name: "Elaine Choo",
    role: "Aesthetic",
    quote:
      "10x helped me manage bookings and follow-ups better. Before this, things could get messy when many clients message at the same time. Now I can keep track more easily. I'd recommend it to other aesthetic business owners who want less admin stress.",
    vertical: "aesthetic",
  },
  {
    name: "Adrian Chin",
    role: "Home Service",
    quote:
      "I do home service jobs so my schedule is always changing. 10x makes it easier to track jobs and appointments. Customers get updates faster too. I don't need something fancy. This works.",
    vertical: "home-services",
  },
];

/** The three shown directly under the hero: one per vertical represented. */
export const heroTestimonials = [testimonials[0], testimonials[5], testimonials[6]];

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part) && !part.endsWith("."))
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
