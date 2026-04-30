"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

type CursorState = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  isHover: boolean;
  setHover: (h: boolean) => void;
  variant: "default" | "view" | "magnet";
  setVariant: (v: "default" | "view" | "magnet") => void;
};

const Ctx = createContext<CursorState | null>(null);

export function CursorProvider({ children }: { children: ReactNode }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [isHover, setHover] = useState(false);
  const [variant, setVariant] = useState<CursorState["variant"]>("default");

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <Ctx.Provider value={{ x, y, isHover, setHover, variant, setVariant }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCursor must be used inside CursorProvider");
  return ctx;
}
