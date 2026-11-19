import { channelLabel, isChannel, type Channel } from "@/lib/attribution";

/** Färg per kanal: betalda annonser i egna färger, organiskt grönt, övrigt neutralt. */
const tone: Record<Channel, string> = {
  google_ads: "bg-[#e8f0fe] text-[#1a56c4]",
  meta_ads: "bg-[#e7f0ff] text-[#0b5bd3]",
  microsoft_ads: "bg-[#e6f4fb] text-[#0a6aa1]",
  tiktok_ads: "bg-[#fde8f0] text-[#b4235c]",
  other_paid: "bg-[#eef0ff] text-[#4b4fc9]",
  affiliate: "bg-[#fff2df] text-[#9a5a00]",
  email: "bg-[#f3e8ff] text-[#7a3cc2]",
  organic_search: "bg-primary-soft text-primary",
  organic_social: "bg-primary-soft text-primary",
  referral: "bg-sand text-foreground",
  direct: "bg-sand text-muted",
  renewal: "bg-accent-soft text-accent",
  unknown: "bg-sand text-muted",
};

/** Ordens källa som en etikett, med detaljen (kampanj, domän, affiliatekanal) under om den finns. */
export function SourceBadge({ source, detail, kind, compact }: { source: string | null; detail?: string | null; kind?: string; compact?: boolean }) {
  const ch: Channel = kind === "renewal" ? "renewal" : isChannel(source) ? source : "unknown";
  return (
    <span className="inline-flex min-w-0 max-w-full flex-col items-start">
      <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone[ch]}`}>{channelLabel[ch]}</span>
      {detail && !compact ? (
        <span className="mt-0.5 block max-w-full truncate text-xs text-muted" title={detail}>
          {detail}
        </span>
      ) : null}
    </span>
  );
}
