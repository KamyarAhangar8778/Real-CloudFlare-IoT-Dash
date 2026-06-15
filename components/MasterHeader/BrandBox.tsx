import React from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";

interface BrandBoxProps {
  headerTitle: string;
  variant: "vertical" | "horizontal";
  isDark?: boolean;
  setIsDark?: (val: boolean) => void;
  animationsEnabled?: boolean;
}

export default function BrandBox({
  headerTitle,
  variant,
  isDark,
  setIsDark,
  animationsEnabled,
}: BrandBoxProps) {
  if (variant === "vertical") {
    return (
      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-4 rounded-2xl md:rounded-bl-md md:rounded-tl-md md:rounded-tr-md shadow-sm flex items-center justify-between gap-4 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent3)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm hover:border-[var(--accent4)] transition-all">
            <Image
              src="/logo.png"
              alt="Logo"
              width={26}
              height={26}
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-right">
            <h1 className="font-sans font-extrabold text-[13.5px] tracking-tight text-[var(--text-primary)] leading-tight select-none">
              {headerTitle}
            </h1>
            <p className="text-[9px] text-[var(--text-muted)] font-mono leading-none mt-1">
              Interactive Modern Dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-1/3 xl:w-1/4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] px-5 py-3.5 rounded-2xl shadow-sm flex items-center justify-between md:justify-start gap-4 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:border-[var(--accent3)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm hover:border-[var(--accent4)] transition-all">
          <Image
            src="/logo.png"
            alt="Logo"
            width={26}
            height={26}
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-right">
          <h1 className="font-sans font-extrabold text-[13.5px] md:text-sm tracking-tight text-[var(--text-primary)] leading-tight select-none">
            {headerTitle}
          </h1>
          <p className="text-[9px] text-[var(--text-muted)] font-mono leading-none mt-1">
            Interactive Modern Dashboard
          </p>
        </div>
      </div>

      {/* Mobile-only Theme Toggle located in title island for quick reach */}
      {setIsDark && (
        <div className="md:hidden flex items-center gap-1 bg-[var(--bg-main)] p-1 border border-[var(--border-color)] rounded-lg">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent4)] rounded transition-all"
            title="تغییر تم پوسته"
          >
            {isDark ? (
              <Moon
                className={`w-4 h-4 text-indigo-400 ${animationsEnabled ? "animate-[bounce_3s_infinite]" : ""}`}
              />
            ) : (
              <Sun
                className={`w-4 h-4 text-orange-400 ${animationsEnabled ? "animate-[spin_20s_linear_infinite]" : ""}`}
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
