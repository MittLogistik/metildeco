import type { SubscriptionMessages } from "../../subscription";

export const messages: SubscriptionMessages = {
  title: (pct) => `Subscription – save ${pct}% on every delivery`,
  description: (pct) =>
    `Subscribe to your food supplements and save ${pct}% on every delivery. Free shipping, your choice of interval and cancel whenever you like.`,
  breadcrumb: "Subscription",
  eyebrow: (pct) => `Save ${pct}%`,
  h1: "Subscription – your supplements delivered automatically",
  lead: (pct) =>
    `No more empty jars or forgotten orders. Subscribe to what you use every day and save ${pct}% on every delivery – with free shipping and no minimum term.`,
  start: "Start a subscription",
  how: "How it works",
  checks: ["No minimum term", "Free shipping", "Cancel whenever you like"],
  stepsEyebrow: "Step by step",
  stepsIntro: "Four simple steps – and you stay in control all the way.",
  steps: [
    ["Choose a product", "Pick the extracts you use regularly and select Subscribe on the product page."],
    ["Choose an interval", "Delivery every 30, 60 or 90 days – matched to how quickly you finish a jar."],
    ["Delivered automatically", "At the start of each new period the payment is taken and you get an email with the estimated delivery date. Always free shipping, whatever the order value."],
    ["Pause or cancel", "Want to pause, resume or cancel your subscription, or change the interval or product? Email our customer service and we'll sort it for you – with no minimum term at all."],
  ],
  exampleEyebrow: "Worked example",
  exampleTitle: "What do you gain?",
  exampleIntro: (pct) =>
    `The ${pct}% discount applies to every delivery, not just the first. With free shipping, the difference is clear after just a few months.`,
  exampleChecks: (pct, zero) => [`${pct}% lower price on every jar`, `${zero} shipping`, "No risk of running out halfway through a course"],
  example: (name) => `Example · ${name}`,
  oneTime: "One-time purchase",
  perDelivery: (price) => `${price} / delivery`,
  subscriptionLabel: "Subscription",
  shipping: "Shipping",
  yearly: "You save per year (6 deliveries, every 60 days)",
  exampleNote: "Excluding shipping saved. Your price depends on the products and interval you choose.",
  benefitsEyebrow: "Benefits",
  benefitsTitle: "Benefits of subscribing",
  benefits: (pct) => [
    [`${pct}% off every time`, "The discount applies for as long as the subscription is active – not just on the first order."],
    ["Always free shipping", "No shipping fee on subscription orders, however small the order."],
    ["No minimum term", "Cancel whenever you like. No fees, no notice period."],
    ["Pause when you need to", "Going away or still have a jar left? Ask customer service to pause your subscription. Nothing is charged until you resume it."],
    ["No surprises", "We never change the price of an active subscription without telling you in advance, and you can always cancel before the change takes effect."],
    ["Secure payment", "Pay securely by card, Klarna, Apple Pay or Google Pay. Receipt by email with every delivery."],
  ],
  popularEyebrow: "Popular to subscribe to",
  popularTitle: "Everyday extracts many people use daily",
  faqTitle: "Frequently asked questions",
  faq: [
    { q: "How do I cancel my subscription?", a: "Email our customer service and we'll cancel your subscription for you and confirm it in writing. No further payments are taken, and the subscription ends when the period you have already paid for is over." },
    { q: "Can I change the delivery interval or my address?", a: "Moving house, or want a different interval, quantity or product? Email our customer service and we'll arrange it before your next delivery." },
    { q: "Can I have several products in the same subscription?", a: "Yes. If you add several products with the same interval in the same purchase, they are part of the same subscription and arrive in the same parcel." },
    { q: "When is the payment taken?", a: "The first delivery is paid at purchase. After that, payment is taken automatically when a new period begins, every 30, 60 or 90 days from the purchase. The parcel ships a few days after the payment and you get an email with the estimated delivery date." },
  ],
};
