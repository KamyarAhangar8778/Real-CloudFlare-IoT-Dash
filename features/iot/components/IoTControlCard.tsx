"use client";

import React, { useState, useEffect } from "react";
import { CLIP_DIAGONAL_TR_BL } from "@/lib/presets";
import {
  CardHeader,
  LedSwitch,
  PwmSlider,
  RelaySwitch,
  ConnectionStatus,
} from "./control-card";

interface IoTControlCardProps {
  ledState: boolean;
  ledPwm: number;
  relayState: boolean;
  lastSeen: string | null;
  onUpdate: (payload: { ledState?: boolean; ledPwm?: number; relayState?: boolean }) => Promise<void>;
  loading: boolean;
}

export const IoTControlCard: React.FC<IoTControlCardProps> = ({
  ledState,
  ledPwm,
  relayState,
  lastSeen,
  onUpdate,
  loading,
}) => {
  const [localLed, setLocalLed] = useState(ledState);
  const [localRelay, setLocalRelay] = useState(relayState);
  const [localPwm, setLocalPwm] = useState(ledPwm);

  // Sync state changes from parent props
  useEffect(() => {
    setLocalLed(ledState);
  }, [ledState]);

  useEffect(() => {
    setLocalRelay(relayState);
  }, [relayState]);

  useEffect(() => {
    setLocalPwm(ledPwm);
  }, [ledPwm]);

  const handleToggleLed = async () => {
    const nextState = !localLed;
    setLocalLed(nextState); // optimistic update
    await onUpdate({ ledState: nextState });
  };

  const handleToggleRelay = async () => {
    const nextState = !localRelay;
    setLocalRelay(nextState); // optimistic update
    await onUpdate({ relayState: nextState });
  };

  const handlePwmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setLocalPwm(val);
  };

  const handlePwmRelease = async () => {
    await onUpdate({ ledPwm: localPwm });
  };

  return (
    <div 
      className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--accent3-medium)] p-6 flex flex-col justify-between h-full hover:border-[var(--accent3)] transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:-translate-y-[2px]"
      style={{ clipPath: CLIP_DIAGONAL_TR_BL }}
    >
      <div className="space-y-6">
        <CardHeader localLed={localLed} loading={loading} />

        {/* 1. LED Toggle Switch */}
        <LedSwitch
          localLed={localLed}
          loading={loading}
          onToggle={handleToggleLed}
        />

        {/* 2. PWM LED Brightness Dimmer (0-255) */}
        <PwmSlider
          localPwm={localPwm}
          loading={loading}
          onChange={handlePwmChange}
          onRelease={handlePwmRelease}
        />

        {/* 3. RELAY INDUSTRIAL SWITCH */}
        <RelaySwitch
          localRelay={localRelay}
          loading={loading}
          onToggle={handleToggleRelay}
        />
      </div>

      {/* Network / Connection status block */}
      <ConnectionStatus lastSeen={lastSeen} />
    </div>
  );
};
