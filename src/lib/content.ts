import { assets } from "./assets";

export const primaryCta = "Request early access";

export const navLinks = [
  { label: "Why Frontier", href: "#why-frontier" },
  { label: "Telemedicine", href: "#telemedicine" },
  { label: "FAQs", href: "#faq" },
] as const;

export const siteConfig = {
  name: "Frontier BioMed",
  tagline: "One platform for sourcing, telemedicine, and dispensing — built for clinics.",
  email: "info@frontierbiomedlabs.com",
  address: "2810 N Church St, Ste 88564, Wilmington, DE 19802",
  company: "Frontier BioMed LLC",
};

export const hero = {
  heading: "Dispense everything your clinic prescribes — from one platform.",
  descriptor:
    "How modern clinics across the US source 1,000+ pharmacy products, 100+ peptides, and 20+ lab supplies — all from one platform, instead of juggling a dozen vendors.",
  cta: primaryCta,
};

export const trustStrip = {
  eyebrow: "Investor & Partner Network",
  claim: {
    lead: "Trusted by ",
    highlight: "753+",
    mid: " clinics across the USA.",
    close: "",
  },
  logos: [
    { name: "McKesson", src: "/partners/mckesson.svg", width: 128, height: 41, mono: "invert" },
    { name: "One Medical", src: "/partners/one-medical.svg", width: 128, height: 28, mono: "invert" },
    { name: "Hims & Hers", src: "/partners/hims.svg", width: 88, height: 32, mono: "light" },
    { name: "Ro", src: "/partners/ro.svg", width: 48, height: 32, mono: "light" },
    { name: "Empower Pharmacy", src: "/partners/empower.svg", width: 132, height: 32, mono: "light" },
    { name: "Cencora", src: "/partners/cencora.svg", width: 120, height: 32, mono: "light" },
    { name: "Walgreens", src: "/partners/walgreens.svg", width: 140, height: 32, mono: "light" },
  ],
} as const;

export type TrustLogo = (typeof trustStrip.logos)[number];

const storyCardVideos = [
  "/storycardvideos/magnific_the-glass-cell-membrane-r_43rwGDh9Aa.mp4",
  "/storycardvideos/magnific_the-sealed-glass-capsule-_IaYeCHmtvE.mp4",
  "/storycardvideos/magnific_the-sealed-glass-capsules_DB3YyDIpcl.mp4",
] as const;

export const storySections = [
  {
    id: "operations",
    icon: "infrastructure" as const,
    title: "Run the clinic, not the back office.",
    video: storyCardVideos[0],
    points: [
      {
        title: "Everything in one login",
        body: "Manage every supplier, pharmacy, and lab from a single account instead of a dozen separate portals.",
      },
      {
        title: "No inventory to manage",
        body: "You never stock, store, or track product; orders go straight to the pharmacy that fills them.",
      },
      {
        title: "We ship to patients",
        body: "Each order is compounded, labeled, and delivered to your patient's door without you touching the logistics.",
      },
    ],
  },
  {
    id: "compliance",
    icon: "verified" as const,
    title: "Stay compliant and protected.",
    video: storyCardVideos[1],
    points: [
      {
        title: "Licensed pharmacies and labs",
        body: "Every product is sourced only from licensed pharmacies and accredited labs.",
      },
      {
        title: "Every order stays compliant",
        body: "Each order follows the correct legal pathway, so you always stay within your scope of practice.",
      },
      {
        title: "Less liability on you",
        body: "Because licensed pharmacies fill and ship every order, the sourcing and handling risk never lands on you.",
      },
    ],
  },
  {
    id: "revenue",
    icon: "molecule" as const,
    title: "Keep your patients and your revenue.",
    video: storyCardVideos[2],
    points: [
      {
        title: "Patients reorder from you",
        body: "Refills happen on your platform, so patients don't drift to a cheaper pharmacy and disappear.",
      },
      {
        title: "You set your prices",
        body: "You choose your own retail price on transparent wholesale, with your margin built into every order.",
      },
      {
        title: "Stable, predictable pricing",
        body: "Network-scale sourcing keeps your costs and product supply steady month after month.",
      },
    ],
  },
] as const;

export const strategicCta = {
  badge: "Ready to consolidate?",
  heading: "Stop juggling a dozen vendors.",
  supporting:
    "Bring every supplier, pharmacy, and lab onto one platform — with telemedicine built in.",
  cta: primaryCta,
};

export const telemedicineSection = {
  eyebrow: "Integrated telemedicine",
  heading: "Telemedicine, built into your platform.",
  points: [
    {
      title: "In-platform visits",
      text: "Patients book and complete their entire visit inside your platform.",
      video: "/telemedical/video-1.mp4",
    },
    {
      title: "Licensed prescribing",
      text: "A licensed physician consults and writes the prescription — no outside tool.",
      video: "/telemedical/video-2.mp4",
    },
    {
      title: "Straight to fulfillment",
      text: "Approved prescriptions flow straight into your catalog and ship to the patient.",
      video: "/telemedical/video-3.mp4",
    },
    {
      title: "You keep everything",
      text: "The payment, the margin, and the patient all stay with you.",
      video: "/telemedical/video-4.mp4",
    },
  ],
} as const;

export const complianceBadges = [
  "Licensed pharmacies",
  "Accredited labs",
  "Licensed physician network",
  "Validated cold-chain",
  "RUO-compliant routing",
] as const;

export const catalog = {
  id: "catalog",
  eyebrow: "Clinical catalogue",
  heading: {
    before: "Manufactured peptides, ",
    emphasis: "documented",
    after: " at every lot.",
  },
  products: [
    {
      name: "CJC-1295 / Ipamorelin",
      spec: "2X Blend · 5mg/vial",
      purity: "≥99.4%",
      mw: "3647.2 Da",
      image: assets.product1,
    },
    {
      name: "BPC-157",
      spec: "5mg/vial",
      purity: "≥99.6%",
      mw: "1419.5 Da",
      image: assets.product2,
    },
    {
      name: "TB-500",
      spec: "5mg/vial",
      purity: "≥99.2%",
      mw: "4963.4 Da",
      image: assets.product3,
    },
    {
      name: "Tirzepatide",
      spec: "10mg/vial",
      purity: "≥99.7%",
      mw: "4813.5 Da",
      image: assets.product4,
    },
  ],
  storeCta: "Request the catalogue",
  disclaimer: "For use by licensed practitioners only · NPI required at point of order",
};

export const faqSection = {
  headingLine1: "Frequently Asked",
  headingLine2: "Questions",
};

export const faqs = [
  {
    question: "What's the legal pathway — RUO vs. pharmacy?",
    answer:
      "Frontier routes each product down its correct pathway. Compounded prescriptions are filled by licensed pharmacies against a valid prescription; research-use-only materials are supplied strictly under their RUO designation and are not dispensed for human use. You always operate within your scope of practice.",
  },
  {
    question: "Who owns the cold chain?",
    answer:
      "We do. Temperature-sensitive products ship under validated cold-chain handling from the fulfilling pharmacy straight to your patient's door — you never store, repackage, or carry the logistics risk.",
  },
  {
    question: "How does telemedicine integration work?",
    answer:
      "Through our licensed telemedicine partner, your patients complete intake and consult with a physician. Approved prescriptions route directly into the catalog for fulfillment — there's no separate telehealth platform for you to run.",
  },
  {
    question: "How and when do we get paid?",
    answer:
      "Payments are processed end-to-end inside the platform — no third-party processor in the middle. You set your own retail price, your margin is calculated automatically, and payouts settle to your account on a clear, predictable schedule.",
  },
  {
    question: "How hard is it to migrate?",
    answer:
      "Light. You're set up in minutes and move products over at your pace — most clinics run Frontier alongside their existing vendors first, then consolidate once they see the catalog and margins.",
  },
  {
    question: "Where is pricing headed?",
    answer:
      "You set retail; we keep wholesale transparent. As the catalog and clinic network grow, sourcing leverage improves — which means stable or better wholesale pricing over time, never surprise markups.",
  },
];

export const finalCta = {
  badge: "Get started",
  heading: "Start dispensing from one platform",
  supporting:
    "Bring your pharmacy, peptides, labs, and telemedicine together on one platform — and get paid for every order.",
  cta: primaryCta,
};

export const confirmationPage = {
  headline: "You're on the list!",
  bodyLine1: "While you wait, watch the 2-minute video on how Frontier Biomed solves these",
  bodyLine2: "problems for clinics like yours.",
  video: "/1.mp4",
  referral: {
    eyebrow: "Refer a clinic",
    heading: "Know a clinic that needs this?",
    body: "Refer a fellow clinic and unlock priority access and founding-member perks.",
    shareMessage:
      "I'm on the waitlist for Frontier BioMed — one platform for clinic sourcing, telemedicine, and dispensing. Join with my link:",
  },
} as const;

export const footer = {
  cta: "Join the waitlist",
  platform: [
    "How it works",
    "The catalog",
    "Integrated telemedicine",
    "For clinics",
    "Founding Council",
  ],
  company: ["About", "Compliance & FAQ", "Contact", "Careers"],
  disclaimer:
    "Research-use-only products are supplied for laboratory research purposes only and are not intended for human or veterinary use, diagnosis, or treatment. Compounded medications are dispensed only by licensed pharmacies pursuant to a valid prescription. Frontier BioMed is operated by Frontier BioMed LLC, a Delaware limited liability company.",
};
