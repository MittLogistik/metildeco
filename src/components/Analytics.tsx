"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/track";

/** Räknar en sidvisning per sidbyte i butiken. */
export function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    track("page_view");
  }, [pathname]);
  return null;
}
