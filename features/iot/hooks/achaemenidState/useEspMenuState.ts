"use client";

import { useState } from "react";

export function useEspMenuState() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModulesMenuOpen, setIsModulesMenuOpen] = useState(false);
  const [isEspDrawerOpen, setIsEspDrawerOpen] = useState(false);

  return {
    isMenuOpen,
    setIsMenuOpen,
    isModulesMenuOpen,
    setIsModulesMenuOpen,
    isEspDrawerOpen,
    setIsEspDrawerOpen,
  };
}
