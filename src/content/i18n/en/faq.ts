/** Frequently asked questions (en-IE). Svaren följer köpvillkor, fraktsida och retursida för Irland. */
import type { FaqGroup } from "@/content/faq";
import { company } from "@/lib/site";

export const faqGroups: FaqGroup[] = [
  {
    id: "bestallning",
    title: "Ordering & payment",
    items: [
      {
        q: "Which payment methods can I use?",
        a: "You can pay with Klarna, Visa, Mastercard, American Express, Apple Pay and Google Pay. Payments are handled by Stripe – we never store your card details.",
      },
      {
        q: "Can I change or cancel my order?",
        a: `Get in touch at ${company.email} as soon as possible with your order number. If the order hasn't been packed yet, we'll change or cancel it. If it has already shipped, you can use your right of withdrawal once the parcel arrives.`,
      },
      {
        q: "Will I get a receipt?",
        a: "Yes, the order confirmation with your receipt is sent to your email as soon as the payment has gone through.",
      },
      {
        q: "Can I order as a business?",
        a: `Yes. Enter your company name and company registration number in the address field, or email ${company.email} if you'd like an invoice.`,
      },
    ],
  },
  {
    id: "frakt",
    title: "Shipping & delivery",
    items: [
      {
        q: "How much is shipping?",
        a: "Shipping to Ireland costs 8.00 €, and shipping is free on all orders over 79 €. Subscriptions and bundles always ship free. Current prices are on the Shipping & delivery page.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders placed before 12:00 (Swedish time) on working days are sent the same day from our warehouse in Sweden. Delivery to Ireland normally takes 3–6 working days.",
      },
      {
        q: "Do you deliver to Ireland?",
        a: "Yes. Orders to Ireland are sent with PostNord as a tracked letter from our warehouse in Sweden. As the parcel stays within the EU, there are no customs duties or import charges.",
      },
      {
        q: "How do I track my parcel?",
        a: "You'll get a tracking link by email when the parcel leaves the warehouse. You can also enter your order number and email under Track order.",
      },
    ],
  },
  {
    id: "retur",
    title: "Returns & complaints",
    items: [
      {
        q: "What is the right of withdrawal?",
        a: "30 days from when you receive your order – longer than the statutory 14 days. The product must be unopened, as for hygiene and food safety reasons we cannot resell opened food supplements.",
      },
      {
        q: "How do I make a return?",
        a: `Email ${company.email} with your order number and the items concerned. You'll receive a return label and instructions within one working day. If you withdraw from the purchase, you pay the return shipping and 8.00 € is deducted from the refund. We refund you within 14 days of receiving the return.`,
      },
      {
        q: "What do I do if a product is damaged?",
        a: "Report the damage within 7 days with photos of the parcel and the product. We'll send a replacement or refund you, and we cover the return shipping.",
      },
    ],
  },
  {
    id: "prenumeration",
    title: "Subscription",
    items: [
      {
        q: "How does the subscription work?",
        a: "Choose Subscribe on the product page and you get 15% off and free shipping on every delivery. You choose the interval (30, 60 or 90 days) and can pause or cancel whenever you like.",
      },
      {
        q: "When is the payment taken?",
        a: "The first delivery is paid at purchase. After that, payment is taken automatically when a new period begins, every 30, 60 or 90 days from the purchase. The parcel ships a few days after the payment and you get an email with the estimated delivery date.",
      },
      {
        q: "How do I pause or cancel my subscription?",
        a: "Email customer service and we will pause or cancel the subscription for you and confirm it in writing. A pause takes effect immediately and nothing is charged until you resume. If you cancel, no further payments are taken and the subscription ends when the paid period is over. No minimum term and no fee.",
      },
      {
        q: "Can I change product or interval?",
        a: "Yes. Email customer service and we'll change the interval, quantity, product or delivery address before your next delivery.",
      },
    ],
  },
  {
    id: "produkter",
    title: "Products & quality",
    items: [
      {
        q: "Where do your products come from?",
        a: "Metilde is a Swedish brand and the range is developed in Sweden. The raw materials and extracts come from the countries where the plants are native, for example Tongkat Ali from Southeast Asia and maca from the Andes.",
      },
      {
        q: "How do I know which batch I have received?",
        a: "The batch number and best-before date are on the jar. Quote the batch number if you contact us about a product, so we can trace it.",
      },
      {
        q: "Do the products contain unnecessary additives?",
        a: "No. Our capsules contain extract and a plant-based capsule shell – no binders, fillers, colourings or sweeteners.",
      },
      {
        q: "How should I store the products?",
        a: "Dry and at room temperature, with the lid screwed on tightly after each use and out of reach of young children.",
      },
    ],
  },
  {
    id: "konto",
    title: "Account & privacy",
    items: [
      {
        q: "Do I need to create an account to shop?",
        a: "No, you can check out as a guest. You only need an account to manage subscriptions and view your order history.",
      },
      {
        q: "How do you handle my personal data?",
        a: "We use your details to handle your order and your account. If you have accepted marketing cookies, we also share certain information with Meta and Google to measure our ads. We never sell your data. Read more in our privacy policy.",
      },
    ],
  },
];
