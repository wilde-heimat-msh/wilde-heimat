"use client";

import { useEffect, useState } from "react";
import { waschbaeren as staticWaschbaeren } from "@/data/waschbaeren";
import { getWaschbaerProfilfoto, hasWaschbaerEchteFotos } from "@/data/photos";
import type { WaschbaerPublic } from "@/types/waschbaer";

function staticWaschbaerenPublic(): WaschbaerPublic[] {
  return staticWaschbaeren.map((waschbaer) => ({
    ...waschbaer,
    profilFoto: getWaschbaerProfilfoto(waschbaer.slug),
    hasEchteFotos: hasWaschbaerEchteFotos(waschbaer.slug),
  }));
}

export function useWaschbaeren() {
  const [waschbaeren, setWaschbaeren] = useState<WaschbaerPublic[]>(staticWaschbaerenPublic);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/waschbaeren");
        if (!res.ok) return;
        const data = (await res.json()) as { waschbaeren?: WaschbaerPublic[] };
        if (!cancelled && data.waschbaeren?.length) {
          setWaschbaeren(data.waschbaeren);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { waschbaeren, loading };
}
