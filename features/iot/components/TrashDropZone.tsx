"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";

export default function TrashDropZone({ activeId }: { activeId: string | null }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "trash-dropzone",
  });

  if (!activeId) return null;

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 p-4 w-72 text-center border-2 border-dashed transition-all duration-300 z-50 rounded-xl backdrop-blur-md ${
        isOver
          ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)] scale-105"
          : "bg-black/70 border-[var(--accent3-medium)] text-[var(--accent3)]"
      }`}
    >
      <Trash2 className={`w-8 h-8 mx-auto mb-2 ${isOver ? "animate-bounce" : ""}`} />
      <span className="text-sm font-bold font-sans">
        برای حذف اینجا رها کنید
      </span>
    </div>
  );
}
