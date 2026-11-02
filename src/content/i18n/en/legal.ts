/**
 * Juridiskt innehåll och informationssidor på engelska (en-IE), lokaliserat för Irland.
 * Samma nycklar och blockstruktur som src/content/legal.ts. `slug` är det interna id:t (svenskt).
 * Platshållare som {epost} och {företag} fylls i när sidan visas (lib/page-text).
 */
import type { LegalBlock, LegalDoc } from "@/content/legal";

const updated = "Last updated: 2 November 2026";

const contactBlock: LegalBlock[] = [
  { type: "h2", text: "Contact and company details" },
  { type: "companyInfo" },
];

const helpBlock: LegalBlock[] = [
  { type: "h2", text: "Need help?" },
  {
    type: "p",
    text: `Email {epost} or call {telefon} ({öppettider}). Always include your order number so we can help you faster.`,
  },
];

const disputeText =
  "If we cannot reach an agreement together, you can find information about your rights and options from the Competition and Consumer Protection Commission (CCPC), ccpc.ie, and you can bring your dispute before the competent court in Ireland. The mandatory rights you have as a consumer under Irish law apply.";

/* ------------------------------ Privacy ------------------------------ */

const privacy: LegalDoc = {
  slug: "integritetspolicy",
  title: "Privacy policy",
  updated,
  intro:
    "This policy explains what personal data Metilde collects when you visit metilde.com, place an order or manage a subscription, why we process it, how long we keep it and what rights you have under the GDPR.",
  metaTitle: "Privacy policy",
  metaDescription:
    "How Metilde collects, uses, shares and protects your personal data, how long we keep it and how to exercise your rights under the GDPR.",
  blocks: [
    ...contactBlock,
    {
      type: "p",
      text: `{företag} is the data controller for the processing described here. Contact us at {epost} if you have questions or want to exercise your rights.`,
    },
    { type: "h2", text: "Data we collect" },
    {
      type: "ul",
      items: [
        "Order data: name, delivery and billing address, email address, phone number, order contents, order history and returns.",
        "Account data: email address and subscription settings. You log in with a one-time code sent to your email, so we do not store a password.",
        "Payment data: payment method, transaction ID and payment status. Full card numbers are never stored by us; they are handled by our payment provider.",
        "Support data: messages, enquiries and attachments you send to customer service.",
        "Marketing data: email address and consent status if you subscribe to the newsletter.",
        "Basket data: email address and the contents of your basket once you have started checkout, so that we can save the basket and remind you by email (no more than four times over ten days). Every reminder includes a link to opt out of further reminders.",
        "Technical data: IP address, device and browser type, pages visited and interactions, collected through cookies and similar technologies.",
      ],
    },
    { type: "h2", text: "Purposes and legal basis" },
    {
      type: "table",
      head: ["Purpose", "Legal basis", "Retention period"],
      rows: [
        ["Processing and delivering your order, handling returns and refunds", "Performance of a contract", "While the order is in progress and for the complaint period"],
        ["Managing your account and subscriptions", "Performance of a contract", "Until you delete your account"],
        ["Accounting and tax obligations", "Legal obligation (applicable bookkeeping rules)", "7 years"],
        ["Customer service and complaints", "Legitimate interest", "36 months after the case is closed"],
        ["Newsletter and marketing", "Consent", "Until you withdraw your consent"],
        ["Analysing and improving the website", "Consent (non-essential cookies)", "Up to 24 months"],
        ["Fraud prevention and IT security", "Legitimate interest", "12 months"],
      ],
    },
    { type: "h2", text: "Who we share data with" },
    {
      type: "p",
      text: "We never sell your personal data. We only share it with processors who help us run the shop, and only to the extent necessary:",
    },
    {
      type: "ul",
      items: [
        "Payment providers, for payments and fraud checks.",
        "Logistics partners and carriers, for delivery and returns.",
        "Providers of hosting, database and email, to run the website and send order-related emails.",
        "Payment via Stripe (card, Klarna, Apple Pay, Google Pay), warehousing and shipping via MittLogistik and PostNord, email via Resend, hosting and database via Vercel and Supabase.",
        "Meta (Facebook, Instagram), Google Ads and Microsoft Advertising, to measure our advertising. With your consent to marketing cookies, they receive data about your visit and purchase, and your email address in hashed form to link the purchase to an ad. Without consent, Google's tag only sends anonymous signals without cookies.",
        "AddRevenue, if you came to us through an affiliate link: order number and order value, so that commission can be paid to whoever placed the link.",
        "Public authorities, where we are required by law to disclose information.",
      ],
    },
    {
      type: "p",
      text: "Data processing agreements are in place with all processors. Where a transfer outside the EU/EEA is necessary, it is protected by the European Commission's standard contractual clauses together with supplementary safeguards.",
    },
    { type: "h2", text: "Your rights" },
    {
      type: "ul",
      items: [
        "Access – request a copy of the data we hold about you.",
        "Rectification – have inaccurate data corrected.",
        "Erasure – have your data deleted when we no longer need it.",
        "Restriction and objection – restrict or object to certain processing, including direct marketing.",
        "Data portability – receive your data in a machine-readable format.",
        "Withdrawing consent – at any time, without affecting processing that has already taken place.",
      ],
    },
    {
      type: "p",
      text: `Email {epost} to exercise a right. We reply within 30 days. If you are unhappy with how we handle your data, you can lodge a complaint with the Data Protection Commission, dataprotection.ie.`,
    },
    { type: "h2", text: "Security" },
    {
      type: "p",
      text: "The website is served over TLS, login uses one-time codes, access to personal data is limited to staff who need it, and our systems are protected by logging and role-based access rights.",
    },
    { type: "h2", text: "Children" },
    { type: "p", text: "The shop is not aimed at children. You must be 18 or over to place an order or create an account." },
    { type: "h2", text: "Changes to this policy" },
    {
      type: "p",
      text: "We may update this policy when our services or legal requirements change. The date above always shows the current version, and we notify registered customers of significant changes by email.",
    },
  ],
};

/* ------------------------------- Terms and conditions ------------------------------- */

const terms: LegalDoc = {
  slug: "kopvillkor",
  title: "Terms and conditions",
  updated,
  intro:
    "These terms apply to all orders placed by consumers on metilde.com. They cover prices, payment, delivery, subscriptions, the right of withdrawal, returns, refunds and complaints.",
  metaTitle: "Terms and conditions",
  metaDescription:
    "Metilde's terms and conditions: prices and payment, delivery times and shipping costs, subscriptions, right of withdrawal, returns, refunds and complaints.",
  blocks: [
    ...contactBlock,
    { type: "h2", text: "Order and contract" },
    {
      type: "p",
      text: "A binding contract is formed when we confirm your order by email. You must be at least 18 to place an order. If a product is out of stock or a price is obviously incorrect, we may cancel the order and refund any amount charged. All communication takes place in Swedish or English.",
    },
    { type: "h2", text: "Prices, VAT and payment" },
    {
      type: "ul",
      items: [
        "All prices are shown in euro (EUR) and include VAT. The total including shipping is shown before you confirm your order.",
        "Accepted payment methods: Klarna, Visa, Mastercard, American Express, Apple Pay and Google Pay.",
        "For one-off purchases, payment is taken when you place the order.",
        "From this website we deliver to addresses in Ireland. Orders to Ireland are shipped within the EU, so customs duties or import charges are never added.",
      ],
    },
    { type: "h2", text: "Delivery" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "Orders placed before 12:00 (CET) on a working day are normally dispatched the same day from our warehouse. Orders to Ireland are sent with PostNord as a tracked letter; delivery normally takes 3–6 working days. You will receive a tracking link by email as soon as the parcel leaves us. For parcels that are not collected, we charge the actual cost of shipping there and back.",
    },
    { type: "h2", text: "Subscription" },
    {
      type: "ul",
      items: [
        "A subscription gives you 15 % off the regular price and is delivered at the interval you choose.",
        "You pay for the first delivery at the time of purchase. After that, payment is taken automatically when a new period begins, every 30, 60 or 90 days counted from the purchase. The parcel is dispatched a few days after payment and you receive an email with the estimated delivery date.",
        "You can pause or cancel at any time up to the day before the next renewal, either yourself under My account or by emailing customer service. If you want to change the interval, quantity or product, email customer service. Changes made later apply from the next delivery.",
        "The subscription continues until you cancel it. No minimum term and no cancellation fee.",
      ],
    },
    { type: "h2", text: "Right of withdrawal" },
    {
      type: "p",
      text: `As a consumer you have a statutory right of withdrawal of 14 days from the day you receive the product – we extend it to 30 days. Contact us at {epost} or use the EU model withdrawal form. The product must be returned unused and in its unopened original packaging. For reasons of hygiene and food safety, food supplements with a broken seal cannot be returned.`,
    },
    { type: "h2", text: "Returns and refunds" },
    {
      type: "ul",
      items: [
        "Let us know within 30 days of receipt and send the product back within 14 days of notifying us.",
        "If you withdraw from the purchase, you pay the return shipping (€8.00 is deducted from the refund). If the product is faulty or the wrong item was delivered, we cover the return shipping.",
        "We refund the purchase price, including the standard shipping you paid, within 14 days of receiving the return or proof that it has been sent.",
        "The refund is made to the original payment method.",
        "If the product has lost value because it was handled beyond what was necessary to assess it, we may make a corresponding deduction.",
      ],
    },
    { type: "h2", text: "Complaints and faulty products" },
    {
      type: "p",
      text: `You have the statutory right to complain under the consumer law that applies to you. Email {epost} with your order number and a photo of the fault. An approved complaint is resolved with a new product or a refund, and we pay the return shipping.`,
    },
    { type: "h2", text: "Product information" },
    {
      type: "p",
      text: "Our products are food supplements and are not intended to prevent, treat or cure any disease. Food supplements should not be used as a substitute for a varied diet and a healthy lifestyle. Always read the label, follow the recommended daily dose and keep the product out of reach of children. Consult a doctor if you are pregnant, breastfeeding or taking medication.",
    },
    { type: "h2", text: "Disputes" },
    { type: "p", text: disputeText },
  ],
};

/* -------------------------------- Cookies -------------------------------- */

const cookies: LegalDoc = {
  slug: "cookies",
  title: "Cookie policy",
  updated,
  intro:
    "Cookies are small text files stored on your device when you visit metilde.com. We use them to make the shop work, to remember your choices and to understand how the website is used.",
  metaTitle: "Cookie policy",
  metaDescription:
    "Which cookies Metilde uses, what they do, how long they are kept and how to change or withdraw your consent.",
  blocks: [
    { type: "h2", text: "Consent" },
    {
      type: "p",
      text: "Essential cookies are set automatically, because the shop does not work without them. Analytics and marketing cookies are only set once you have accepted them. You can change or withdraw your consent at any time via the cookie settings in the footer, or by clearing the cookies in your browser.",
    },
    { type: "h2", text: "Cookies we use" },
    { type: "h3", text: "Essential" },
    {
      type: "table",
      head: ["Cookie", "Purpose", "Retention period"],
      rows: [
        ["metilde_consent", "Stores your cookie choices", "12 months"],
        ["sb-access-token", "Keeps you logged in to My account", "1 hour"],
      ],
    },
    {
      type: "p",
      text: "The basket is stored in your browser's local storage (metilde_cart), not in a cookie. We do not use a separate analytics service; visitor statistics are counted on our own server without cookies.",
    },
    { type: "h3", text: "Marketing (requires consent)" },
    {
      type: "table",
      head: ["Cookie", "Purpose", "Retention period"],
      rows: [
        ["_fbp", "Measures the effectiveness of our ads", "3 months"],
        ["_gcl_au", "Attributes conversions to Google Ads", "3 months"],
        ["_uetsid, _uetvid, MUID", "Attributes conversions to Microsoft Advertising (Bing)", "1 day – 13 months"],
      ],
    },
    { type: "h2", text: "Third parties" },
    {
      type: "p",
      text: "Analytics and marketing cookies are set by Google, Microsoft and Meta as independent providers. They process data according to their own policies, and the cookies are only activated after your consent. Google's advertising tag uses Consent Mode: without your consent it sets no cookies and only sends anonymous signals about page views and purchases, without personal data such as your email address. Google uses these to estimate the results of ads.",
    },
    { type: "h2", text: "Managing cookies in your browser" },
    {
      type: "p",
      text: "You can block or delete cookies in your browser settings. Please note that blocking essential cookies means the basket, checkout and login will not work.",
    },
    { type: "p", text: `Questions about cookies? Email {epost}.` },
  ],
};

/* ---------------------------- Quality ---------------------------- */

const quality: LegalDoc = {
  slug: "kvalitetsgaranti",
  title: "Quality and labelling",
  updated,
  intro: "How our capsules are labelled, and what applies if you are not satisfied.",
  metaTitle: "Quality and labelling – contents, labels and returns",
  metaDescription:
    "Metilde's capsules are labelled with extract strength, dosage and batch number, and can be returned unopened within 30 days.",
  blocks: [
    { type: "h2", text: "This applies to all our capsules" },
    {
      type: "ul",
      items: [
        "Vegan capsule with no fillers.",
        "Extract strength, amount per capsule and Latin name are stated on the jar.",
        "The capsules come in a plastic jar. The raw materials come from the countries where the plants are native.",
        "Batch number and best-before date on every jar.",
      ],
    },
    { type: "h2", text: "Traceability" },
    {
      type: "p",
      text: "Every jar has a batch number and a best-before date. Quote the batch number if you contact us about a product, and we can trace which production run it comes from.",
    },
    { type: "h2", text: "If you are not satisfied" },
    {
      type: "p",
      text: "Unopened products can be returned within 30 days under our terms for returns and exchanges. If a product is faulty or damaged, your right to complain applies, even if the packaging has been opened. Get in touch if something doesn't seem right, and we'll go through it together.",
    },
    { type: "h2", text: "Regulations" },
    {
      type: "p",
      text: "Our products are food supplements and are labelled in accordance with EU rules on food supplements. Food supplements are not a substitute for a varied diet and a healthy lifestyle and are not intended to diagnose, treat or cure any disease. Consult a doctor if you are pregnant, breastfeeding or taking medication.",
    },
    ...helpBlock,
  ],
};

/* ---------------------------- Shipping & delivery ---------------------------- */

const shipping: LegalDoc = {
  slug: "frakt-och-leverans",
  title: "Shipping & delivery",
  updated,
  intro:
    "Orders placed before 12:00 (CET) on working days are packed and dispatched the same day from our warehouse. Free shipping on orders over €79.",
  metaTitle: "Shipping & delivery – shipping costs, delivery times and tracking",
  metaDescription:
    "Metilde's shipping costs and delivery times to Ireland, free shipping over €79, tracking, uncollected parcels and what applies if a delivery is damaged.",
  blocks: [
    { type: "h2", text: "Processing time" },
    {
      type: "p",
      text: "We pack orders on working days. Orders received before 12:00 (CET) are dispatched the same day, later orders the next working day. During promotions and around public holidays, packing may take an extra day.",
    },
    { type: "h2", text: "Shipping costs and delivery times" },
    { type: "shippingTable" },
    {
      type: "p",
      text: "All prices include VAT. From this website we deliver to addresses in Ireland. Orders to Ireland are sent with PostNord as a tracked letter from our warehouse; delivery normally takes 3–6 working days. Shipping costs €8.00, and orders over €79 ship free. Subscriptions and bundles always ship free. As the parcel stays within the EU, you pay no customs duties or import charges.",
    },
    { type: "h2", text: "Tracking your order" },
    {
      type: "p",
      text: "You receive an order confirmation as soon as your order has been placed, and a tracking link as soon as the parcel leaves our warehouse. You can also follow the delivery under Track order.",
    },
    { type: "h2", text: "Uncollected parcels" },
    {
      type: "p",
      text: "Parcels are held at the collection point for 14 days. Parcels that are not collected are returned to us, and we then charge the actual cost of shipping there and back. If you can't collect the parcel in time, please let us know instead – we're happy to help.",
    },
    { type: "h2", text: "Damaged or missing deliveries" },
    {
      type: "ul",
      items: [
        "Report visible transport damage within 7 days of receipt, with photos of the parcel and the products.",
        "If tracking shows the parcel as delivered but you have not received anything, check with your neighbours and the collection point first, then contact us within 14 days.",
        "We send a replacement delivery or refund the order as soon as the case has been confirmed.",
      ],
    },
    ...helpBlock,
  ],
};

/* ----------------------------- Returns & exchanges ---------------------------- */

const returns: LegalDoc = {
  slug: "returer-och-byten",
  title: "Returns & exchanges",
  updated,
  intro:
    "You always have a 30-day right of withdrawal – longer than the statutory 14 days. Unopened products in their original condition can be returned or exchanged.",
  metaTitle: "Returns & exchanges – 30-day right of withdrawal",
  metaDescription:
    "How to return or exchange a product at Metilde: 30-day right of withdrawal, return shipping, refund within 14 days and a three-year right to complain.",
  blocks: [
    { type: "h2", text: "Your right of withdrawal" },
    {
      type: "p",
      text: "As a consumer in the EU you have a statutory right of withdrawal of 14 days from the day you receive your order. We extend it to 30 days. The right of withdrawal applies to products that are unopened and in essentially unchanged condition – for reasons of hygiene and food safety, we cannot resell opened food supplements.",
    },
    { type: "h2", text: "How to return" },
    {
      type: "ul",
      items: [
        `Register your return by emailing {epost} with your order number and the products concerned. You can also use the EU model withdrawal form.`,
        `Within one working day you will receive a return label with the return address and instructions.`,
        "Pack the products in the original packaging or equivalent protective packaging.",
        "Hand in the parcel and keep the proof of postage until the refund is complete.",
      ],
    },
    { type: "h2", text: "Return shipping and refunds" },
    {
      type: "table",
      head: ["Situation", "Return shipping", "Refund"],
      rows: [
        ["Withdrawal (change of mind)", "Paid by you, €8.00 is deducted from the refund", "The order value including the original standard shipping"],
        ["Wrong product sent", "Free, with a prepaid label from us", "The full amount or a replacement product"],
        ["Damaged or faulty product", "Free, with a prepaid label from us", "The full amount or a replacement product"],
        ["Exchange for another product", "Paid by you, as for a return (€8.00), unless the product was faulty", "The difference is charged or refunded"],
      ],
    },
    {
      type: "p",
      text: "The refund is made with the same payment method used for the purchase, within 14 days of us receiving and approving the return, usually within 2–5 banking days. We charge no return fee on top of the return shipping in the table above.",
    },
    { type: "h2", text: "Complaints" },
    {
      type: "p",
      text: "You have the statutory right to complain about faulty products under the consumer law that applies to you. Report the fault within a reasonable time after discovering it – within two months is always considered reasonable. Include photos and the batch number shown on the label.",
    },
    { type: "h2", text: "Exceptions" },
    {
      type: "ul",
      items: [
        "Opened food supplements or products with a broken seal, for reasons of hygiene and food safety.",
        "Products whose best-before date has passed while in your possession.",
      ],
    },
    { type: "h2", text: "Dispute resolution" },
    { type: "p", text: disputeText },
    ...helpBlock,
  ],
};

/* -------------------------------- Sustainability ------------------------------ */

const sustainability: LegalDoc = {
  slug: "hallbarhet",
  title: "Sustainability",
  updated,
  intro:
    "Fewer but better products, packaging that can be recycled and a supply chain we can explain. This is where we are today – and what we are continuing to work on.",
  metaTitle: "Sustainability – packaging, shipping and raw materials",
  metaDescription:
    "How Metilde works on sustainability: recyclable packaging, consolidated shipping from a single warehouse and documented raw materials.",
  blocks: [
    { type: "h2", text: "How we think about it" },
    {
      type: "p",
      text: "A food supplement brand's biggest footprint lies in raw materials, packaging and transport. We work on those three, in that order, and would rather be honest about where we stand than make claims we cannot back up.",
    },
    { type: "h2", text: "Packaging" },
    {
      type: "ul",
      items: [
        "The outer box and filling material are made from recycled paper and go in paper recycling.",
        "The capsules come in plastic jars with screw lids that protect against moisture and light. The jar goes in plastic packaging recycling.",
        "No plastic film around the outer packaging and no printed paper inserts you didn't ask for.",
      ],
    },
    { type: "h2", text: "Shipping" },
    {
      type: "p",
      text: "We ship from a single warehouse, preferably as letters and to collection points, because consolidated routes mean fewer kilometres per parcel. Subscriptions can be combined into one delivery so that several products travel together.",
    },
    { type: "h2", text: "Raw materials and social responsibility" },
    {
      type: "ul",
      items: [
        "Suppliers must document origin and comply with applicable labour and environmental legislation.",
        "We buy raw materials from growers with documented harvesting routines.",
        "Botanical raw materials that only grow outside Europe are bought in the largest possible batches to reduce the number of shipments.",
      ],
    },
    { type: "h2", text: "What we haven't solved yet" },
    {
      type: "ul",
      items: [
        "We do not yet publish a full climate calculation per product.",
        "Some botanical raw materials can only be grown outside Europe, which means long-distance transport.",
      ],
    },
    {
      type: "p",
      text: `Do you have a question or a suggestion about our sustainability work? Write to {epost} – we read everything.`,
    },
  ],
};

export const legalDocs: Record<string, LegalDoc> = {
  integritetspolicy: privacy,
  kopvillkor: terms,
  cookies,
  kvalitetsgaranti: quality,
  "frakt-och-leverans": shipping,
  "returer-och-byten": returns,
  hallbarhet: sustainability,
};
