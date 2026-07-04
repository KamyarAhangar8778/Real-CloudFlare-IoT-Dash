import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { publishUpdateRuleCommand } from "@/features/iot/services/mqttService";

export function useSegmentUpdates() {
  const { setSegments } = useIoTStore();

  const handleUpdateSegmentMode = (id: string, mode: "switch" | "push") => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, mode } : s)));
  };

  const handleUpdateSegmentAutoOff = (id: string, auto_off: number) => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, auto_off } : s)));
  };

  const handleUpdateSegmentRule = (
    id: string, 
    rule: { 
      highActions?: Array<{ reqHold: number; targetPin: string; actionOn: boolean; actionType?: number; delay?: number; }>;
      lowActions?: Array<{ reqHold: number; targetPin: string; actionOn: boolean; actionType?: number; delay?: number; }>;
    }
  ) => {
    setSegments(prev => prev.map((s) => (s.id === id ? { ...s, rule } : s)));
    publishUpdateRuleCommand(
      id, 
      rule.highActions || [],
      rule.lowActions || []
    );
  };

  return {
    handleUpdateSegmentMode,
    handleUpdateSegmentAutoOff,
    handleUpdateSegmentRule,
  };
}
