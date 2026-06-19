"use client";

import { useState } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import {
  publishAddSegmentCommand,
  publishDeleteSegmentCommand,
  publishUpdateRuleCommand,
} from "@/features/iot/services/mqttService";

interface UseSegmentManagementProps {
  setIsModulesMenuOpen: (open: boolean) => void;
  updatePinOnServer: (pin: string, state: boolean) => Promise<void>;
}

export function useSegmentManagement({
  setIsModulesMenuOpen,
  updatePinOnServer,
}: UseSegmentManagementProps) {
  const { segments, setSegments, setGroupsOrder, setGroupConfigs, pinsState } = useIoTStore();
  const [targetPlaceholderId, setTargetPlaceholderId] = useState<string | null>(null);

  const handleAddSegment = (
    type: string,
    pin: string,
    title?: string,
    group?: string,
    mode?: "switch" | "push",
    auto_off?: number,
  ) => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const finalGroup = group || "Test";
    const newSeg = {
      id: randomId,
      type,
      pin,
      title: title || `کنترل پایه دیجیتال (GPIO ${pin})`,
      group: finalGroup,
      mode: mode || "switch",
      auto_off: auto_off || 0,
    };

    setGroupsOrder((prev) => (prev.includes(finalGroup) ? prev : [...prev, finalGroup]));

    let updated = [...segments];
    if (targetPlaceholderId) {
      const index = updated.findIndex((s) => s.id === targetPlaceholderId);
      if (index !== -1) {
        newSeg.group = updated[index].group || "Test";
        updated[index] = newSeg;
      } else {
        updated.push(newSeg);
      }
      setTargetPlaceholderId(null);
    } else {
      updated.push(newSeg);
    }
    setSegments(updated);

    if (pinsState[pin] === undefined) {
      updatePinOnServer(pin, false);
    }

    // ارسال دستور ساخت سگمنت جدید به ESP
    publishAddSegmentCommand(newSeg.id, newSeg.type, parseInt(newSeg.pin), false);
  };

  const handleAddPlaceholder = (groupId: string) => {
    const randomId = Math.random().toString(36).substring(2, 9);
    setSegments([
      ...segments,
      {
        id: randomId,
        type: "placeholder",
        pin: "",
        title: "جایگاه خالی",
        group: groupId,
      },
    ]);
  };

  const handleSetupPlaceholder = (id: string) => {
    setTargetPlaceholderId(id);
    setIsModulesMenuOpen(true);
  };

  const handleGroupColsChange = (group: string, maxCols: number) => {
    setGroupConfigs((prev) => ({ ...prev, [group]: { ...prev[group], maxCols } }));
  };

  const handleRemoveSegment = (id: string) => {
    setSegments(segments.filter((s) => s.id !== id));
    publishDeleteSegmentCommand(id);
  };

  const handleUpdateSegmentMode = (id: string, mode: "switch" | "push") => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, mode } : s)));
  };

  const handleUpdateSegmentAutoOff = (id: string, auto_off: number) => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, auto_off } : s)));
  };

  const handleUpdateSegmentRule = (id: string, rule: { targetPinHigh: string; actionOnHigh: boolean; targetPinLow: string; actionOnLow: boolean }) => {
    setSegments(prev => prev.map((s) => (s.id === id ? { ...s, rule } : s)));
    publishUpdateRuleCommand(id, rule.targetPinHigh, rule.actionOnHigh, rule.targetPinLow, rule.actionOnLow);
  };

  const handleRemoveGroup = (groupId: string) => {
    setGroupsOrder((prev) => prev.filter((g) => g !== groupId));
    setSegments((prev) => prev.filter((s) => (s.group || "Test") !== groupId));
  };

  return {
    targetPlaceholderId,
    handleAddSegment,
    handleAddPlaceholder,
    handleSetupPlaceholder,
    handleGroupColsChange,
    handleRemoveSegment,
    handleUpdateSegmentMode,
    handleUpdateSegmentRule,
    handleUpdateSegmentAutoOff,
    handleRemoveGroup,
  };
}

