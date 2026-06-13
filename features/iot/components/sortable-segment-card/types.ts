export interface SegmentData {
  id: string;
  type: string;
  pin: string;
  title: string;
  group?: string;
  mode?: "switch" | "push";
}

export interface SortableSegmentCardProps {
  segment: SegmentData;
  isPinOn: boolean;
  onRemove: (id: string) => void;
  onTogglePin: (pin: string) => void;
  onSetPinState?: (pin: string, state: boolean) => void;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  isLoadingIoT: boolean;
  onSetupPlaceholder?: (id: string) => void;
  parentGroupsCols?: number;
  groupMaxCols?: number;
  animationsEnabled?: boolean;
}
