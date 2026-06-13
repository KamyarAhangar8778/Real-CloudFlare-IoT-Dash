import React from "react";

interface FormDetailsInputProps {
  customTitle: string;
  setCustomTitle: (val: string) => void;
  groupName: string;
  setGroupName: (val: string) => void;
}

export default function FormDetailsInput({
  customTitle,
  setCustomTitle,
  groupName,
  setGroupName,
}: FormDetailsInputProps) {
  return (
    <>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] theme-text-muted">(اختیاری)</span>
          <label className="text-[10px] theme-text-tertiary font-bold">
            عنوان دلخواه برای سگمنت:
          </label>
        </div>
        <input
          type="text"
          placeholder="مثال: رله پمپ آب حیاط"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          className="w-full h-10 px-4 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans text-right placeholder:text-right"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] theme-text-tertiary font-bold block">
          نام گروه سگمنت:
        </label>
        <input
          type="text"
          placeholder="مانند: Test"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full h-10 px-4 text-xs bg-black/20 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans text-right placeholder:text-right"
        />
      </div>
    </>
  );
}
