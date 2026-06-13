export interface Segment {
  id: string;
  type: string;
  pin: string;
  title: string;
  group?: string;
  mode?: "switch" | "push";
}

export interface ModulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSegment: (
    type: string,
    pin: string,
    title?: string,
    group?: string,
    mode?: "switch" | "push"
  ) => void;
  segments: Segment[];
  onRemoveSegment: (id: string) => void;
  isDark: boolean;
  accent3: string;
  accent4: string;
  animationsEnabled?: boolean;
}
