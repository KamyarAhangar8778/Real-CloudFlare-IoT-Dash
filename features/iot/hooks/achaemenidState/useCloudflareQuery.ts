"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { isCloudflareEnabled, fetchPinsFromCloudflare } from "@/features/iot/services/cloudflareService";

export function useCloudflareQuery() {
  const { segments, pinsState, setPinsState, lowDataMode } = useIoTStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: iotData, refetch: refetchIot } = useQuery({
    queryKey: ["iotState", segments.map(s => s.pin).join(",")],
    queryFn: async () => {
      if (isCloudflareEnabled()) {
        try {
          const cfPins = await fetchPinsFromCloudflare(segments);
          if (cfPins) return { pins: cfPins };
        } catch (e) {
          console.error("Error fetching pins from Cloudflare:", e);
        }
      }
      return { pins: pinsState };
    },
    refetchInterval: isCloudflareEnabled() && !lowDataMode ? 3000 : false,
  });

  useEffect(() => {
    if (iotData && iotData.pins) {
      setPinsState(iotData.pins);
    }
  }, [iotData, setPinsState]);

  return {
    mounted,
    refetchIot,
  };
}
