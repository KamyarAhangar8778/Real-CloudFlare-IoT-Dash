export interface SegmentData {
  id: string;
  type: string;
  pin: string;
  title: string;
  group?: string;
  state?: boolean;
  mode?: "switch" | "push";
  auto_off?: number;
  rule?: { targetPin: string; triggerState: boolean; actionState: boolean };
}

export interface SortableSegmentCardProps {
  segment: SegmentData;
  isPinOn: boolean;
  onRemove: (id: string) => void;
  onTogglePin: (pin: string) => void;
  onSetPinState?: (pin: string, state: boolean, preventMqtt?: boolean) => void;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  onUpdateSegmentRule?: (id: string, rule: { targetPin: string; triggerState: boolean; actionState: boolean }) => void;
  isLoadingIoT: boolean;
  onSetupPlaceholder?: (id: string) => void;
  parentGroupsCols?: number;
  groupMaxCols?: number;
  animationsEnabled?: boolean;
}
