"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, CloudLightning, Server } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { 
  getCloudflareWorkerUrl, 
  setCloudflareWorkerUrl, 
  isCloudflareEnabled 
} from "@/features/iot/services/cloudflareService";
import { saveConfigToCloudflare } from "@/features/iot/services/cloudflare/api";
import type { EspConfig } from "@/features/iot/services/esp32Config";

interface CloudflareIntegrationProps {
  isDark?: boolean;
}

export default function CloudflareIntegration({ isDark: _isDark = true }: CloudflareIntegrationProps) {
  const [cfUrl, setCfUrl] = useState(() => getCloudflareWorkerUrl());
  const { segments, groupsOrder, groupConfigs, groupsCols, showToast } = useIoTStore();
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCfUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCfUrl(val);
    setCloudflareWorkerUrl(val);
  };

  // وقتی URL تغییر می‌کند، بعد از 2 ثانیه push کن تا در KV ذخیره شود
  useEffect(() => {
    // فقط وقتی URL معتبر باشه push کن
    if (!cfUrl || cfUrl.includes("YOUR_SUBDOMAIN") || cfUrl.length < 10) return;

    if (pushTimerRef.current) {
      clearTimeout(pushTimerRef.current);
    }

    pushTimerRef.current = setTimeout(async () => {
      if (!isCloudflareEnabled()) return;

      // ساخت یک config حداقل برای ذخیره URL
      const currentConfig: EspConfig = {
        version: "1.2.0-Achaemenid",
        device: {
          name: "سامانه مرزی پاسارگاد",
          chip: "ESP32-S3-WROOM-1",
          firmware: "v3.4.1-Achaemenid-OS",
          reboot_count: 0,
          last_boot: new Date().toISOString(),
        },
        preferences: {
          theme_mode: "dark",
          accent_color_3: "#D4AF37",
          accent_color_4: "#10B981",
          font_family: "vazir",
          animations_enabled: true,
          header_animation: "fade",
          header_title: "سامانه هوشمند پادشاهی هخامنش",
          cuneiform_opacity: 0.08,
          cuneiform_color: "accent3",
        },
        layout: {
          groups_order: groupsOrder,
          groups_cols: groupsCols,
          group_configs: groupConfigs,
        },
        segments: segments,
        worker_url: cfUrl,
      };

      const result = await saveConfigToCloudflare(currentConfig);
      if (result.success) {
        showToast("آدرس ورکر جدید با موفقیت ذخیره شد.", "success");
      } else {
        showToast("خطا در ذخیره آدرس ورکر جدید.", "error");
      }
    }, 2000);

    return () => {
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfUrl]);

  const isCfConnected = isCloudflareEnabled();

  return (
    <div className="pt-2 space-y-3 text-right">
      <div className="flex items-center justify-between">
        <span className="text-[10px] theme-text-tertiary">Cloudflare Workers KV & Durable Objects</span>
        <span className="font-bold text-[11px] text-accent3">اتصال هوشمند کلودفلر</span>
      </div>
      
      <p className="text-[10px] theme-text-tertiary leading-relaxed">
        برای ذخیره‌سازی ابری و دائم ساختار چیدمان (Cloudflare KV) و نظارت بر شیرها و سوییچ‌ها (Durable Objects)، آدرس ورکر خود را وارد کنید:
      </p>

      <div className="relative mt-1">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Globe className="h-4 w-4 text-accent3 opacity-70" />
        </div>
        <input
          type="text"
          dir="ltr"
          value={cfUrl}
          onChange={handleCfUrlChange}
          placeholder="https://my-iot-worker.subdomain.workers.dev"
          className="block w-full py-2.5 pr-10 pl-3 border border-accent3-medium/30 rounded-xl bg-black/40 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent3 font-mono transition-all"
        />
      </div>

      {/* Status Indicator Bar */}
      <div className={`p-3 rounded-xl border flex items-center justify-between text-right text-[10px] ${
        isCfConnected
          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400"
          : "bg-slate-950/40 border-slate-800 text-slate-400"
      }`}>
        <div className="flex items-center gap-1.5 justify-end w-full">
          <span className="font-bold">
            {isCfConnected 
              ? "سیستم روی حالت ذخیره‌سازی کلودفلر (ابر زنده) تنظیم شده است." 
              : "پخش آفلاین / حافظه محلی فعال است (ورکر تنظیم نشده است)."}
          </span>
          {isCfConnected ? (
            <CloudLightning className="w-3.5 h-3.5 text-emerald-400 animate-pulse animate-[pulse_2s_infinite]" />
          ) : (
            <Server className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  );
}
