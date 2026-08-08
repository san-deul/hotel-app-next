import { useCallback, useEffect, useRef, useState } from "react";

interface UseSidebarResizeOptions {
  collapseThreshold?: number;
  iconWidth?: number;
  defaultExpandedWidth?: number;
  maxWidth?: number;
}

export function useSidebarResize({
  collapseThreshold = 90,
  iconWidth = 64,
  defaultExpandedWidth = 260,
  maxWidth = 420,
}: UseSidebarResizeOptions = {}) {
  const [expandedWidth, setExpandedWidth] = useState(defaultExpandedWidth); //펼쳤을 때 폭 기억하는값
  const [collapsed, setCollapsed] = useState(false); // 접혀있는지
  const [dragging, setDragging] = useState(false); //드래그중인지

  // 드래그 도중 최신 collapsed 값을 참조하기 위한 ref
  // (매 mousemove마다 effect를 재등록하지 않기 위함)
  const collapsedRef = useRef(collapsed);
  collapsedRef.current = collapsed;

  useEffect(() => {
    if (!dragging) return;

    function onMouseMove(e: MouseEvent) {
      const w = Math.min(e.clientX, maxWidth);

      if (w <= collapseThreshold) {
        setCollapsed(true);
        return;
      }
      if (collapsedRef.current) setCollapsed(false);
      setExpandedWidth(w);
    }
    
    function onMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, maxWidth, collapseThreshold]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const startDragging = useCallback(() => setDragging(true), []);

  return {
    width: collapsed ? iconWidth : expandedWidth,
    collapsed,
    startDragging,
    toggleCollapsed,
  };
}