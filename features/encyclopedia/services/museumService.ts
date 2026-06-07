import { cache } from "react";
import { unstable_cache } from "next/cache";

export interface MuseumArtifact {
  id: string;
  title: string;
  period: string;
  desc: string;
  location: string;
}

// ============================================================================
// LEVEL 2: DATA CACHE (using Next.js unstable_cache)
// This preserves the fetched artifacts across different server requests and users.
// Configured to re-evaluate every 3600 seconds (1 hour) or via 'museum-collection' tag.
// ============================================================================
export const fetchMuseumDataWithCache = unstable_cache(
  async (): Promise<MuseumArtifact[]> => {
    // Simulating call to museum repository or a database
    const response = await fetch("https://raw.githubusercontent.com/asghasph/mock-data/main/achaemenid-data.json", {
      cache: "force-cache", // Server data cache level
      next: {
        revalidate: 3600,
        tags: ["museum-collection"]
      }
    }).catch(() => null);

    if (response && response.ok) {
      const result = await response.json();
      return result;
    }

    // High quality primary fallback data when external APIs are restricted
    return [
      {
        id: "cyrus-cylinder",
        title: "منشور حقوق بشر کوروش بزرگ",
        period: "۵۳۹ پیش از میلاد",
        desc: "استوانه‌ای از گل پخته که به عنوان نخستین منشور حقوق بشر جهان شناخته می‌شود و بر اهمیت مدارا، آزادی مذهب و پایان برده‌داری تاکید دارد.",
        location: "موزه بریتانیا، لندن"
      },
      {
        id: "gate-of-nations",
        title: "دروازه همه ملل تخت جمشید",
        period: "زمان خشایارشا شاه (۴۸۶-۴۶۵ ق.م)",
        desc: "کاخ باشکوه و مجمع ورودی ملل مختلف تمدن هخامنشی با تندیس گاوان بالدار اساطیری نگهبان که نماد ابهت و خوش‌آمدگویی بومی ایران است.",
        location: "تخت جمشید، مرودشت"
      },
      {
        id: "darius-gold-tablet",
        title: "الواح سیمین و زرین پی‌سنگ آپادانا",
        period: "زمان داریوش بزرگ (۵۲۲-۴۸۶ ق.م)",
        desc: "صندوق‌های سنگی حامل لوح‌های طلا و نقره که محدوده امپراتوری هخامنشی از ورای سغد تا حبشه را با خط میخی و سه زبان باستانی ثبت کرده‌اند.",
        location: "موزه ملی ایران، تهران"
      }
    ];
  },
  ["museum-collection-artifacts"],
  {
    revalidate: 3600,
    tags: ["museum-collection"]
  }
);

// ============================================================================
// LEVEL 1: REQUEST MEMOIZATION (using React cache)
// Prevents duplicate function invocation within the execution scope of a single render.
// Calls inside subsequent client-server segments won't duplicate fetching efforts.
// ============================================================================
export const getMemoizedMuseumData = cache(async () => {
  return await fetchMuseumDataWithCache();
});
