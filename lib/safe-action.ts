import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    return {
      message: error instanceof Error ? error.message : "خطای ناشناخته در سرور هخامنشی رخ داده است",
    };
  },
});
