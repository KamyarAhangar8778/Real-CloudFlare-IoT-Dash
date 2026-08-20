import { useState, useLayoutEffect, useEffect, useRef, useCallback } from "react";

interface UseCardHeaderLayoutOptions {
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (val: boolean) => void;
}

/**
 * Custom hook for managing the layout and position of segment card header dropdown menus.
 * Horizontally centers the dropdown menu relative to the parent group container at the current segment row.
 */
export function useCardHeaderLayout(options?: UseCardHeaderLayoutOptions) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isSettingsOpen = options?.isSettingsOpen !== undefined ? options.isSettingsOpen : internalIsOpen;
  const setIsSettingsOpen = options?.setIsSettingsOpen || setInternalIsOpen;

  const [showAutoOffMenu, setShowAutoOffMenu] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const autoOffButtonRef = useRef<HTMLButtonElement>(null);
  const autoOffMenuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = useCallback(() => {
    if (!menuRef.current || !buttonRef.current) return;
    const menu = menuRef.current;
    const button = buttonRef.current;

    const groupContainer = button.closest(".group\\/group-card") as HTMLElement;

    if (groupContainer && menu.parentElement) {
      const groupRect = groupContainer.getBoundingClientRect();
      const menuParentRect = menu.parentElement.getBoundingClientRect();

      const parentCenter = menuParentRect.left + menuParentRect.width / 2;
      const groupCenter = groupRect.left + groupRect.width / 2;

      const offset = groupCenter - parentCenter;

      menu.style.left = `calc(50% + ${offset}px)`;
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent | PointerEvent) => {
      const target = event.target as Node;
      if (!target) return;

      if (isSettingsOpen) {
        const isClickInsideMenu = menuRef.current?.contains(target);
        const isClickOnButton = buttonRef.current?.contains(target);

        if (!isClickInsideMenu && !isClickOnButton) {
          setIsSettingsOpen(false);
        }
      }

      if (showAutoOffMenu) {
        const isClickInsideAutoOff = autoOffMenuRef.current?.contains(target);
        const isClickOnAutoOffBtn = autoOffButtonRef.current?.contains(target);

        if (!isClickInsideAutoOff && !isClickOnAutoOffBtn) {
          setShowAutoOffMenu(false);
        }
      }
    };

    if (isSettingsOpen || showAutoOffMenu) {
      document.addEventListener("pointerdown", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside, true);
    };
  }, [isSettingsOpen, showAutoOffMenu, setIsSettingsOpen]);

  useLayoutEffect(() => {
    if (!isSettingsOpen) return;

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [isSettingsOpen, updateMenuPosition]);

  return {
    isSettingsOpen,
    setIsSettingsOpen,
    showAutoOffMenu,
    setShowAutoOffMenu,
    buttonRef,
    menuRef,
    autoOffButtonRef,
    autoOffMenuRef,
  };
}

