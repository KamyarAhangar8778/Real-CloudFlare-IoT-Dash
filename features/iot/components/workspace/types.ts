import { DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";

export interface IoTWorkspaceProps {
  sensors: any;
  groupsOrder: string[];
  groupsCols: number;
  segments: any[];
  groupConfigs: Record<string, { maxCols: number }>;
  pinsState: Record<string, boolean>;
  isLoadingIoT: boolean;
  activeSegmentId: string | null;
  activeGroupId: string | null;
  animationsEnabled?: boolean;

  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleGroupColsChange: (groupName: string, cols: number) => void;
  handleAddPlaceholder: (groupId: string) => void;
  handleRemoveGroup: (groupId: string) => void;
  handleRemoveSegment: (id: string) => void;
  handleTogglePin: (pin: string) => void;
  handleSetPinState: (pin: string, state: boolean, preventMqtt?: boolean) => void;
  handleUpdateSegmentMode: (id: string, mode: "switch" | "push") => void;
  handleUpdateSegmentAutoOff: (id: string, autoOff: number) => void;
  handleUpdateSegmentRule?: (id: string, rule: { targetPinHigh: string; actionOnHigh: boolean; targetPinLow: string; actionOnLow: boolean }) => void;
  handleSetupPlaceholder: (id: string) => void;
}
