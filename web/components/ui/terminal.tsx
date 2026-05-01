"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────
 * Terminal — fake macOS-style code terminal window with auto-sequenced
 * child animations. Inspired by Magic UI's Terminal but written on top
 * of motion/react so it shares the project's animation runtime.
 * ────────────────────────────────────────────────────────────────── */

type TerminalProps = {
  children: ReactNode;
  className?: string;
  title?: string;
};

export function Terminal({ children, className, title = "~/dekada72h" }: TerminalProps) {
  // give each child a `delay` prop based on cumulative duration of its predecessors
  const arr = Children.toArray(children);
  let cum = 0.4; // initial pause after window appears
  const sequenced = arr.map((child) => {
    if (!isValidElement(child)) return child;
    const props = (child.props ?? {}) as { text?: string; duration?: number; delay?: number };
    const text = props.text ?? extractText(child);
    const duration = props.duration ?? Math.min(0.04 * (text?.length ?? 0), 1.4);
    const childWithDelay = cloneElement(child as ReactElement<{ delay: number }>, {
      delay: cum,
    });
    cum += duration + 0.18;
    return childWithDelay;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative rounded-2xl bg-[#0d1117] text-gray-200 font-mono text-sm shadow-2xl border border-white/10 overflow-hidden",
        className,
      )}
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#161b22]">
        <span aria-hidden className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span aria-hidden className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span aria-hidden className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-gray-400 select-none">{title}</span>
      </div>
      {/* body */}
      <div className="px-5 py-5 leading-relaxed">{sequenced}</div>
    </motion.div>
  );
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return extractText(props.children);
  }
  return "";
}

/* ──────────────────────────────────────────────────────────────────
 * TypingAnimation — types text character-by-character with caret.
 * ────────────────────────────────────────────────────────────────── */

type TypingProps = {
  children?: ReactNode;
  text?: string;
  className?: string;
  /** ms per character */
  speed?: number;
  /** seconds delay before typing starts (set by parent Terminal) */
  delay?: number;
};

export function TypingAnimation({
  children,
  text,
  className,
  speed = 38,
  delay = 0,
}: TypingProps) {
  const reduce = useReducedMotion();
  const full = text ?? extractText(children);
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setShown(full);
      setDone(true);
      return;
    }
    const start = window.setTimeout(() => {
      let i = 0;
      const id = window.setInterval(() => {
        i++;
        setShown(full.slice(0, i));
        if (i >= full.length) {
          window.clearInterval(id);
          setDone(true);
        }
      }, speed);
    }, delay * 1000);
    return () => window.clearTimeout(start);
  }, [full, speed, delay, reduce]);

  return (
    <div className={cn("whitespace-pre-wrap", className)}>
      {shown}
      {!done && <span className="animate-pulse">▌</span>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * AnimatedSpan — fade + slide in. Used for non-typed lines.
 * ────────────────────────────────────────────────────────────────── */

type AnimatedSpanProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedSpan({ children, className, delay = 0 }: AnimatedSpanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: "easeOut" }}
      className={cn("whitespace-pre-wrap", className)}
    >
      {children}
    </motion.div>
  );
}
