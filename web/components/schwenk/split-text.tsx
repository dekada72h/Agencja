"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useMemo, type ReactNode } from "react";

// Letter-by-letter reveal. Splits text into per-character spans and animates them
// in sequence as the parent enters the viewport. Words remain unbroken (display:
// inline-block on each word) so wrapping behaves naturally.

const EASE = [0.22, 1, 0.36, 1] as const;

const charVariants: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  visible: { opacity: 1, y: 0 },
};

export function SplitText({
  text,
  className,
  delay = 0,
  duration = 0.6,
  stagger = 0.025,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  const reduced = useReducedMotion();
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const Tag = motion[as] as typeof motion.span;

  if (reduced) {
    const Plain = (as ?? "span") as React.ElementType;
    return <Plain className={className}>{text}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, wi) => {
        if (/^\s+$/.test(word)) return <span key={wi}>{word}</span>;
        return (
          <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
            {Array.from(word).map((ch, ci) => (
              <motion.span
                key={ci}
                className="inline-block"
                variants={charVariants}
                transition={{ duration, ease: EASE }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}

export function SplitWords({
  children,
  className,
  delay = 0,
  duration = 0.7,
  stagger = 0.06,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}) {
  // For rich content with embedded JSX (e.g. <em>), split at the word level.
  // Caller passes a string OR an array of strings/JSX. We only animate strings.
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{children}</span>;

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {Array.isArray(children) ? children.map((c, i) => <Word key={i} duration={duration}>{c}</Word>) : <Word duration={duration}>{children}</Word>}
    </motion.span>
  );
}

function Word({ children, duration }: { children: ReactNode; duration: number }) {
  if (typeof children !== "string") {
    return (
      <motion.span
        className="inline-block"
        variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration, ease: EASE }}
      >
        {children}
      </motion.span>
    );
  }
  return (
    <>
      {children.split(/(\s+)/).map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={i}>{w}</span>
        ) : (
          <motion.span
            key={i}
            className="inline-block"
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration, ease: EASE }}
          >
            {w}
          </motion.span>
        )
      )}
    </>
  );
}
