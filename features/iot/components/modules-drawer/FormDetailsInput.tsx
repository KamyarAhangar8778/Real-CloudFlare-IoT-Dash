import React, { useState } from "react";
import { ICON_MAP, AVAILABLE_ICONS } from "@/features/iot/utils/icons";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FormDetailsInputProps {
  customTitle: string;
  setCustomTitle: (val: string) => void;
  groupName: string;
  setGroupName: (val: string) => void;
  segmentIcon: string;
  setSegmentIcon: (val: string) => void;
  groupIcon: string;
  setGroupIcon: (val: string) => void;
  existingGroups: string[];
}

export default function FormDetailsInput({
  customTitle,
  setCustomTitle,
  groupName,
  setGroupName,
  segmentIcon,
  setSegmentIcon,
  groupIcon,
  setGroupIcon,
  existingGroups,
}: FormDetailsInputProps) {
  const [isNewGroup, setIsNewGroup] = useState(existingGroups.length === 0);
  const [showSegmentIcons, setShowSegmentIcons] = useState(false);
  const [showGroupIcons, setShowGroupIcons] = useState(false);

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
          className="w-full h-10 px-4 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans text-right placeholder:text-[var(--text-muted)]"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] theme-text-muted">(اختیاری)</span>
          <label className="text-[10px] theme-text-tertiary font-bold block">آیکون سگمنت:</label>
        </div>
        <button
          type="button"
          onClick={() => setShowSegmentIcons(!showSegmentIcons)}
          className="w-full h-10 px-4 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl flex items-center justify-between hover:border-[var(--accent3)] transition-all font-sans shadow-sm"
        >
          {showSegmentIcons ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
          <div className="flex items-center gap-2">
            <span>{segmentIcon ? "آیکون انتخاب شد" : "انتخاب آیکون"}</span>
            {segmentIcon && ICON_MAP[segmentIcon] && React.createElement(ICON_MAP[segmentIcon], { className: "w-4 h-4 text-[var(--accent3)]" })}
          </div>
        </button>
        
        {showSegmentIcons && (
          <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl grid grid-cols-6 gap-2 max-h-32 overflow-y-auto shadow-sm">
            <button
              type="button"
              onClick={() => { setSegmentIcon(""); setShowSegmentIcons(false); }}
              className={`p-2 rounded-lg flex items-center justify-center transition-all text-[9px] ${!segmentIcon ? "bg-[var(--accent3)] text-black" : "hover:bg-white/10 text-gray-500"}`}
            >
              بدون آیکون
            </button>
            {AVAILABLE_ICONS.map((iconName) => (
              <button
                key={iconName}
                type="button"
                onClick={() => { setSegmentIcon(iconName); setShowSegmentIcons(false); }}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${segmentIcon === iconName ? "bg-[var(--accent3)] text-black" : "hover:bg-white/10 text-[var(--text-secondary)]"}`}
                title={iconName}
              >
                {React.createElement(ICON_MAP[iconName], { className: "w-4 h-4" })}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]">
        <label className="text-[10px] theme-text-tertiary font-bold block">گروه سگمنت:</label>
        
        {existingGroups.length > 0 && (
          <div className="flex items-center justify-end gap-3 mb-2 px-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" checked={isNewGroup} onChange={() => setIsNewGroup(true)} className="accent-[var(--accent3)] w-3 h-3" />
              <span className="text-[10px] theme-text-secondary">گروه جدید</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" checked={!isNewGroup} onChange={() => setIsNewGroup(false)} className="accent-[var(--accent3)] w-3 h-3" />
              <span className="text-[10px] theme-text-secondary">انتخاب از موجود</span>
            </label>
          </div>
        )}

        {!isNewGroup && existingGroups.length > 0 ? (
          <select
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans shadow-sm"
            dir="rtl"
          >
            {existingGroups.map((group) => (
              <option key={group} value={group} className="bg-slate-900">{group}</option>
            ))}
          </select>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="مثال: Test"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full h-10 px-4 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent3)] outline-none transition-all font-sans text-right placeholder:text-[var(--text-muted)] shadow-sm"
            />
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] theme-text-muted">(اختیاری)</span>
                <label className="text-[10px] theme-text-tertiary font-bold block">آیکون گروه جدید:</label>
              </div>
              <button
                type="button"
                onClick={() => setShowGroupIcons(!showGroupIcons)}
                className="w-full h-10 px-4 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl flex items-center justify-between hover:border-[var(--accent3)] transition-all font-sans shadow-sm"
              >
                {showGroupIcons ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                <div className="flex items-center gap-2">
                  <span>{groupIcon ? "آیکون انتخاب شد" : "انتخاب آیکون"}</span>
                  {groupIcon && ICON_MAP[groupIcon] && React.createElement(ICON_MAP[groupIcon], { className: "w-4 h-4 text-[var(--accent3)]" })}
                </div>
              </button>
              
              {showGroupIcons && (
                <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl grid grid-cols-6 gap-2 max-h-32 overflow-y-auto shadow-sm">
                  <button
                    type="button"
                    onClick={() => { setGroupIcon(""); setShowGroupIcons(false); }}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all text-[9px] ${!groupIcon ? "bg-[var(--accent3)] text-black" : "hover:bg-white/10 text-gray-500"}`}
                  >
                    بدون آیکون
                  </button>
                  {AVAILABLE_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => { setGroupIcon(iconName); setShowGroupIcons(false); }}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${groupIcon === iconName ? "bg-[var(--accent3)] text-black" : "hover:bg-white/10 text-[var(--text-secondary)]"}`}
                      title={iconName}
                    >
                      {React.createElement(ICON_MAP[iconName], { className: "w-4 h-4" })}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
