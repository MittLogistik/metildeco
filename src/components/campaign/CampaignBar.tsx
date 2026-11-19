"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { blackWeek } from "@/i18n/messages/blackweek";
import type { CampaignInfo } from "@/lib/campaign";
import { Container } from "@/components/ui";
import { InlineCountdown, useTimeLeft } from "./Countdown";

/** Toppraden under Black Week: svart, rabatten och nedräkningen. Ersätter den vanliga raden. */
export function CampaignBar({ campaign }: { campaign: CampaignInfo }) {
  const { locale, r } = useI18n();
  const t = blackWeek[locale];
  const left = useTimeLeft(campaign.end);
  if (left && "ended" in left) return null;
  return (
    <Link href={r.products} className="block bg-black text-white">
      <Container className="flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 py-2 text-center text-xs sm:text-sm">
        <span className="font-display font-semibold uppercase tracking-[0.18em]">{t.name}</span>
        <span className="hidden opacity-40 sm:inline">·</span>
        <span className="font-medium">{t.bar(campaign.percent)}</span>
        <span className="hidden opacity-40 sm:inline">·</span>
        <span className="text-white/70">
          {t.endsIn} <InlineCountdown end={campaign.end} />
        </span>
      </Container>
    </Link>
  );
}
