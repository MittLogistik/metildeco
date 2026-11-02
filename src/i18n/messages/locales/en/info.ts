import type { InfoMessages } from "../../info";

export const messages: InfoMessages = {
  shippingTable: {
    destination: "Destination",
    method: "Shipping method",
    time: "Delivery time",
    cost: "Cost",
    days: (from, to) => `${from}–${to} working days`,
    freeOver: (price, freeOver) => `${price} – free shipping over ${freeOver}`,
  },
  company: {
    legalEntity: "Legal entity",
    orgNumber: "Company registration number",
    vatId: "VAT registration number",
    address: "Address",
    email: "Email",
    phone: "Phone",
    hours: "Mon–Fri 09:00–17:00 (CET)",
    sweden: "Sweden",
  },
  faq: {
    metaTitle: "Frequently asked questions",
    metaDescription: "Answers to the most common questions about ordering, payment, shipping, returns, subscriptions and our products.",
    title: "Frequently asked questions",
    eyebrow: "Customer service",
    intro: "Here you'll find answers to the most common questions about orders, delivery, subscriptions and our products.",
    categories: "Categories",
    moreTitle: "Didn't find your answer?",
    moreBefore: "Our customer service is available on weekdays 09:00–17:00 (CET) and normally replies within one working day. Email",
    moreOr: "or call",
    languages: "",
    contact: "Contact us",
    trackOrder: "Track your order",
  },
  contact: {
    metaTitle: "Contact us",
    metaDescription: "Have a question about your order, a product or your subscription? Metilde's customer service replies within 1–2 working days.",
    title: "Contact us",
    eyebrow: "Customer service",
    intro: "We normally reply within 1–2 working days. If it's about an ongoing order, including your order number is the quickest way to get help.",
    languages: "",
    formTitle: "Send a message",
    otherWays: "Other ways to reach us",
    email: "Email",
    phone: "Phone",
    swedishTime: "CET",
    companyInfo: "Company details",
    trackTitle: "Just want to know where your parcel is?",
    trackText: "Track your delivery directly with your order number and email.",
    trackLink: "Track your order",
    faqTitle: "Quick answers",
    faqText: "Many questions about shipping, returns and subscriptions are already answered in our FAQ.",
    faqLink: "Go to the FAQ",
  },
  story: {
    metaTitle: "Our story – how Metilde started",
    metaDescription:
      "Metilde started with a simple frustration: too few pure food supplements without the hassle. Read how the brand was founded and why a subscription was a given.",
    title: "Our story",
    eyebrow: "About Metilde",
    intro:
      "Metilde was born out of a frustration many people will recognise: why is it so hard to find pure food supplements without the hassle? That question made Matilda put everything else aside and build the brand from the ground up.",
    sections: [
      {
        title: "Something was missing from the shelf",
        body: [
          "Matilda had used food supplements for a long time, but the more she read, the more frustrated she became. Many products were full of fillers, sweeteners and ingredients that added nothing. At the same time, prices were often high for products that didn't even contain what they promised.",
          "There were plenty of brands talking about health and wellbeing, but few that explained why a product was actually worth its price. That was when the idea of Metilde started to grow: a brand that focuses on purity and transparency, where customers get what they pay for and nothing else.",
        ],
      },
      {
        title: "Subscriptions that should work better",
        body: [
          "Another irritation was that there was hardly any way to subscribe to food supplements. What existed was either complicated plans with notice periods, or set-ups where you had to remember to order yourself.",
          "So Metilde built a subscription that is genuinely fair: 15% lower price, free shipping and the option to pause, change or cancel at any time. No minimum term, no hidden fees.",
        ],
      },
      {
        title: "From Matilda to Metilde",
        body: [
          "When it was time to choose a name, the first option was obvious. Every domain with \"Matilda\" was already taken, so it had to be something close – a little simpler, a little cleaner. Metilde.com was available, and the name felt right straight away.",
        ],
      },
      {
        title: "Next step: growing the range",
        body: [
          "We won't add new products just because it looks good. Every extract should be there because it serves a purpose, is of real quality and meets the same standards we set from day one.",
        ],
      },
    ],
    valuesEyebrow: "Values",
    valuesTitle: "What we stand for",
    values: [
      ["No hassle", "We list exactly what each product contains. No fluff, no hidden additives."],
      ["You get what you pay for", "Raw materials, capsules, packaging. That's where our money goes – not on expensive advertising campaigns."],
      ["A real subscription", "15% off, free shipping and full control. Pause, change or cancel whenever you like."],
      ["Fast delivery", "Orders placed before 12:00 on weekdays ship the same day."],
    ],
    companyEyebrow: "The company",
    companyTitle: "About the company",
    companyIntro: (legalName) =>
      `Metilde is run by ${legalName}. Here you'll find our full company details – we want you to always know who you're buying from.`,
    legalName: "Legal name",
    customerService: "Customer service",
    ctaTitle: "We're only just getting started",
    ctaText:
      "Metilde is a young brand, but the ambition is clear: to grow the range and become a major player in the market for pure, botanical food supplements. We do that by being honest, keeping quality high and listening to our customers.",
    ctaProducts: "Discover the products",
    ctaSubscription: "Read about subscriptions",
  },
};
