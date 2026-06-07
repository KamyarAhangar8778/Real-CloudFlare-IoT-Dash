"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

// Schema for updating a dynamic GPIO control state matching ESP/Achaemenid constraints
const iotControlSchema = z.object({
  pin: z.string().min(1, { message: "شماره پایه الزامی است" }),
  pinState: z.boolean(),
});

export const updateControlPinAction = actionClient
  .schema(iotControlSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Direct call or server-to-server proxy request safely updating state on the server context
      const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/iot`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "server_action",
          pin: parsedInput.pin,
          pinState: parsedInput.pinState,
        }),
      });

      if (!response.ok) {
        throw new Error("ارتباط با کنترل‌کننده مرکزی برقرار نشد");
      }

      const result = await response.json();
      return {
        success: true,
        message: `پایه ${parsedInput.pin} با موفقیت به وضعیت ${parsedInput.pinState ? "فعال" : "غیرفعال"} تغییر یافت`,
        state: result.state,
      };
    } catch (err: any) {
      throw new Error(`خطا در همگام‌سازی سرور: ${err.message}`);
    }
  });
