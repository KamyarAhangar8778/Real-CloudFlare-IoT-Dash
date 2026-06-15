import React from "react";
import { motion } from "motion/react";
import { SortableSegmentCardProps } from "./types";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import useSegmentButtonProps from "./useSegmentButtonProps";

interface ActiveCardProps extends Omit<SortableSegmentCardProps, "onSetupPlaceholder" | "isLoadingIoT"> {
  isCompact: boolean;
  isUltraCompact: boolean;
  attributes: any;
  listeners: any;
}

export default function ActiveCard({
  segment,
  isPinOn,
  onRemove,
  onTogglePin,
  onSetPinState,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  onUpdateSegmentRule,
  parentGroupsCols,
  groupMaxCols,
  animationsEnabled = true,
  isCompact,
  isUltraCompact,
  attributes,
  listeners,
}: ActiveCardProps) {
  const mode = segment.mode || "switch";
  const buttonProps = useSegmentButtonProps({
    mode,
    pin: segment.pin,
    onTogglePin,
    onSetPinState,
  });

  const [countdown, setCountdown] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (isPinOn && segment.auto_off && segment.auto_off > 0) {
      setCountdown(segment.auto_off);
    } else {
      setCountdown(null);
    }
  }, [isPinOn, segment.auto_off]);

  React.useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      if (mode === "switch" || mode === "push") {
        onSetPinState?.(segment.pin, false, true);
      }
      setCountdown(null);
      return;
    }
    const timerId = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timerId);
  }, [countdown, segment.pin, onSetPinState]);

  return (
    <motion.div
      layout={animationsEnabled ? "position" : false}
      transition={animationsEnabled ? { type: "spring", stiffness: 380, damping: 32 } : undefined}
      initial={animationsEnabled ? { opacity: 0, scale: 0.93, y: 10 } : false}
      animate={animationsEnabled ? { opacity: 1, scale: 1, y: 0 } : false}
      exit={animationsEnabled ? { opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.2, ease: "easeIn" } } : undefined}
      whileHover={animationsEnabled ? { y: -1.5, scale: 1.002 } : undefined}
      className={`w-full flex flex-col bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] hover:border-[var(--accent3)]/50 transition-all duration-300 relative group h-full shadow-sm hover:shadow-lg rounded-2xl overflow-hidden ${
        isUltraCompact ? "min-h-[90px]" : "min-h-[140px]"
      }`}
    >
      <div className="absolute top-0 right-0 w-3 h-3 hover:border-accent3/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 hover:border-accent3/40 pointer-events-none" />

      <div className="flex flex-col h-full justify-between">
        <CardHeader
          segment={segment}
          isPinOn={isPinOn}
          isUltraCompact={isUltraCompact}
          mode={mode}
          onRemove={onRemove}
          onUpdateSegmentMode={onUpdateSegmentMode}
          attributes={attributes}
          listeners={listeners}
          countdown={countdown}
          onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
          onUpdateSegmentRule={onUpdateSegmentRule}
        />

        <CardBody
          segment={segment}
          isPinOn={isPinOn}
          isCompact={isCompact}
          isUltraCompact={isUltraCompact}
          mode={mode}
          buttonProps={buttonProps}
          animationsEnabled={animationsEnabled}
        />

        {!isUltraCompact && !isCompact && (
          <CardFooter segment={segment} isPinOn={isPinOn} />
        )}
      </div>
    </motion.div>
  );
}
