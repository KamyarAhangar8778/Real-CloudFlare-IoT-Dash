import React from "react";
import TitleInput from "./TitleInput";

interface HeaderSettingsContentProps {
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  headerPosition?: "top" | "left";
  setHeaderPosition?: (val: "top" | "left") => void;
}

export default function HeaderSettingsContent({
  headerTitle,
  setHeaderTitle,
}: HeaderSettingsContentProps) {
  return (
    <div className="space-y-4 text-right font-sans">
      <TitleInput headerTitle={headerTitle} setHeaderTitle={setHeaderTitle} />
    </div>
  );
}
