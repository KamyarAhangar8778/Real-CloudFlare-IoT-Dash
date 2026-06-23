export interface MasterHeaderProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  setIsModulesMenuOpen: (val: boolean) => void;
  setIsMenuOpen: (val: boolean) => void;
  headerAnimationType: "fade" | "chase";
  headerTitle: string;
  groupsCols: number;
  setGroupsCols: (val: number) => void;
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  animationsEnabled?: boolean;
}
