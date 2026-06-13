"use client";

import React, { useState } from "react";
import { Globe, CloudLightning, Server } from "lucide-react";
import { 
  getCloudflareWorkerUrl, 
  setCloudflareWorkerUrl, 
  isCloudflareEnabled 
} from "@/features/iot/services/cloudflareService";

interface CloudflareIntegrationProps {
  isDark?: boolean;
}

export default function CloudflareIntegration({ isDark = true }: CloudflareIntegrationProps) {
  const [cfUrl, setCfUrl] = useState(() => getCloudflareWorkerUrl());

  const handleCfUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCfUrl(val);
    setCloudflareWorkerUrl(val);
  };

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
