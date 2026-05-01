"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────
 * CodeEditorPreview — VS Code-style editor + browser preview pane.
 * Renders pre-syntax-highlighted lines and reveals them progressively
 * (line-by-line), with file-tab switching mid-sequence and the live
 * preview fading in once the code is "written".
 *
 * Sample shown is a generic responsive hero — meant to look real, NOT
 * agency-specific. Real HTML + CSS, copy-pasteable.
 * ───────────────────────────────────────────────────────────────── */

// Token components — purely visual styling
const T = ({ children }: { children: ReactNode }) => <span className="text-rose-400">{children}</span>; // tag/punctuation
const A = ({ children }: { children: ReactNode }) => <span className="text-sky-300">{children}</span>; // attribute name
const S = ({ children }: { children: ReactNode }) => <span className="text-amber-300">{children}</span>; // string
const C = ({ children }: { children: ReactNode }) => <span className="text-gray-500 italic">{children}</span>; // comment
const P = ({ children }: { children: ReactNode }) => <span className="text-cyan-300">{children}</span>; // CSS property
const V = ({ children }: { children: ReactNode }) => <span className="text-emerald-300">{children}</span>; // CSS value
const Sel = ({ children }: { children: ReactNode }) => <span className="text-yellow-300">{children}</span>; // CSS selector
const N = ({ children }: { children: ReactNode }) => <span className="text-orange-300">{children}</span>; // number/value
const K = ({ children }: { children: ReactNode }) => <span className="text-fuchsia-400">{children}</span>; // keyword

// HTML lines — index.html
const HTML_LINES: ReactNode[] = [
  <><C>{"<!-- index.html -->"}</C></>,
  <><T>{"<section"}</T> <A>class</A>=<S>{`"hero"`}</S><T>{">"}</T></>,
  <>{"  "}<T>{"<div"}</T> <A>class</A>=<S>{`"container"`}</S><T>{">"}</T></>,
  <>{"    "}<T>{"<span"}</T> <A>class</A>=<S>{`"badge"`}</S><T>{">"}</T>Nowość<T>{"</span>"}</T></>,
  <>{"    "}<T>{"<h1>"}</T></>,
  <>{"      Twoja firma w sieci"}</>,
  <>{"      "}<T>{"<span"}</T> <A>class</A>=<S>{`"gradient"`}</S><T>{">"}</T>w 10 dni<T>{"</span>"}</T></>,
  <>{"    "}<T>{"</h1>"}</T></>,
  <>{"    "}<T>{"<p"}</T> <A>class</A>=<S>{`"lead"`}</S><T>{">"}</T>Szybka, nowoczesna strona.<T>{"</p>"}</T></>,
  <>{"    "}<T>{"<button"}</T> <A>class</A>=<S>{`"cta"`}</S><T>{">"}</T>Zacznij teraz →<T>{"</button>"}</T></>,
  <>{"  "}<T>{"</div>"}</T></>,
  <><T>{"</section>"}</T></>,
];

// CSS lines — styles.css
const CSS_LINES: ReactNode[] = [
  <><C>{"/* styles.css */"}</C></>,
  <><Sel>{".hero"}</Sel> <T>{"{"}</T></>,
  <>{"  "}<P>background</P>: <K>linear-gradient</K><T>(</T><N>135deg</N>, <V>#6366f1</V>, <V>#0ea5e9</V><T>)</T>;</>,
  <>{"  "}<P>padding</P>: <N>5rem 2rem</N>;</>,
  <>{"  "}<P>border-radius</P>: <N>24px</N>;</>,
  <>{"  "}<P>color</P>: <V>white</V>;</>,
  <>{"  "}<P>text-align</P>: <V>center</V>;</>,
  <><T>{"}"}</T></>,
  <><Sel>{".badge"}</Sel> <T>{"{"}</T></>,
  <>{"  "}<P>display</P>: <V>inline-block</V>;</>,
  <>{"  "}<P>padding</P>: <N>4px 14px</N>;</>,
  <>{"  "}<P>background</P>: <K>rgba</K><T>(</T><N>255,255,255,0.18</N><T>)</T>;</>,
  <>{"  "}<P>border-radius</P>: <N>999px</N>;</>,
  <>{"  "}<P>font-size</P>: <N>12px</N>;</>,
  <><T>{"}"}</T></>,
  <><Sel>{".gradient"}</Sel> <T>{"{"}</T></>,
  <>{"  "}<P>background</P>: <K>linear-gradient</K><T>(</T><N>90deg</N>, <V>#fef08a</V>, <V>#fb923c</V><T>)</T>;</>,
  <>{"  "}<P>-webkit-background-clip</P>: <V>text</V>;</>,
  <>{"  "}<P>color</P>: <V>transparent</V>;</>,
  <><T>{"}"}</T></>,
  <><Sel>{".cta"}</Sel> <T>{"{"}</T></>,
  <>{"  "}<P>padding</P>: <N>14px 30px</N>;</>,
  <>{"  "}<P>border-radius</P>: <N>999px</N>;</>,
  <>{"  "}<P>background</P>: <V>white</V>;</>,
  <>{"  "}<P>color</P>: <V>#6366f1</V>;</>,
  <>{"  "}<P>font-weight</P>: <N>600</N>;</>,
  <>{"  "}<P>cursor</P>: <V>pointer</V>;</>,
  <><T>{"}"}</T></>,
];

// Reveal speed (ms per line)
const SPEED = 65;
const HTML_TO_CSS_PAUSE = 600;

export function CodeEditorPreview({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  const [activeFile, setActiveFile] = useState<"html" | "css">("html");
  const [htmlShown, setHtmlShown] = useState(0);
  const [cssShown, setCssShown] = useState(0);
  const [previewLevel, setPreviewLevel] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setHtmlShown(HTML_LINES.length);
      setCssShown(CSS_LINES.length);
      setActiveFile("css");
      setPreviewLevel(2);
      return;
    }
    let cancelled = false;
    let cssTimer: ReturnType<typeof setInterval> | null = null;

    // Phase 1: type HTML
    let i = 0;
    const htmlTimer = setInterval(() => {
      if (cancelled) return;
      i++;
      setHtmlShown(i);
      // After ~half of HTML, reveal preview "structure-only"
      if (i === Math.floor(HTML_LINES.length * 0.7)) setPreviewLevel(1);
      if (i >= HTML_LINES.length) {
        clearInterval(htmlTimer);
        // Phase 2: switch tab + type CSS
        setTimeout(() => {
          if (cancelled) return;
          setActiveFile("css");
          let j = 0;
          cssTimer = setInterval(() => {
            if (cancelled) return;
            j++;
            setCssShown(j);
            if (j >= CSS_LINES.length) {
              if (cssTimer) clearInterval(cssTimer);
              setTimeout(() => !cancelled && setPreviewLevel(2), 250);
            }
          }, SPEED);
        }, HTML_TO_CSS_PAUSE);
      }
    }, SPEED);

    return () => {
      cancelled = true;
      clearInterval(htmlTimer);
      if (cssTimer) clearInterval(cssTimer);
    };
  }, [inView, reduce]);

  return (
    <div ref={ref} className={cn("grid lg:grid-cols-2 gap-5 lg:gap-6", className)}>
      <Editor
        activeFile={activeFile}
        onSwitch={setActiveFile}
        htmlVisible={htmlShown}
        cssVisible={cssShown}
        htmlDone={htmlShown >= HTML_LINES.length}
        cssDone={cssShown >= CSS_LINES.length}
      />
      <BrowserPreview level={previewLevel} />
    </div>
  );
}

/* ── Editor pane ── */

function Editor({
  activeFile,
  onSwitch,
  htmlVisible,
  cssVisible,
  htmlDone,
  cssDone,
}: {
  activeFile: "html" | "css";
  onSwitch: (f: "html" | "css") => void;
  htmlVisible: number;
  cssVisible: number;
  htmlDone: boolean;
  cssDone: boolean;
}) {
  const lines = activeFile === "html" ? HTML_LINES : CSS_LINES;
  const visibleCount = activeFile === "html" ? htmlVisible : cssVisible;
  const isDone = activeFile === "html" ? htmlDone : cssDone;
  const totalLines = lines.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-[#1e1e1e] text-gray-200 font-mono text-[13px] shadow-2xl border border-white/10 overflow-hidden"
    >
      {/* macOS chrome + title */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#252526] border-b border-black/40">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-gray-400">VS Code — dekada72h</span>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#252526] border-b border-black/40 text-xs">
        <Tab name="index.html" active={activeFile === "html"} done={htmlDone} onClick={() => onSwitch("html")} icon="html" />
        <Tab name="styles.css" active={activeFile === "css"} done={cssDone} onClick={() => onSwitch("css")} icon="css" />
      </div>

      {/* Code area */}
      <div className="grid grid-cols-[36px_1fr] min-h-[460px] lg:min-h-[510px] max-h-[510px] overflow-auto">
        {/* line numbers */}
        <div className="pr-2 py-3 text-right select-none text-gray-600 bg-[#1e1e1e] border-r border-black/20">
          {Array.from({ length: totalLines }, (_, i) => (
            <div key={i} className="h-[22px] leading-[22px] text-[11px]">
              {i + 1}
            </div>
          ))}
        </div>
        {/* code */}
        <div className="py-3 px-3 leading-[22px]">
          {lines.slice(0, visibleCount).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className="h-[22px] whitespace-pre"
            >
              {line}
            </motion.div>
          ))}
          {!isDone && visibleCount < totalLines && (
            <span className="inline-block w-[7px] h-[16px] bg-primary/80 align-middle animate-pulse" />
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 text-[11px] bg-primary/90 text-white">
        <div className="flex items-center gap-3">
          <span>{activeFile === "html" ? "HTML" : "CSS"}</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln {visibleCount}, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </motion.div>
  );
}

function Tab({
  name,
  active,
  done,
  onClick,
  icon,
}: {
  name: string;
  active: boolean;
  done: boolean;
  onClick: () => void;
  icon: "html" | "css";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 border-r border-black/40 transition-colors",
        active ? "bg-[#1e1e1e] text-white" : "bg-[#2d2d2d] text-gray-400 hover:text-gray-200",
      )}
    >
      <span
        className={cn(
          "inline-block w-3.5 h-3.5 rounded-sm font-bold text-[8px] flex items-center justify-center",
          icon === "html" ? "bg-orange-500 text-white" : "bg-blue-500 text-white",
        )}
      >
        {icon === "html" ? "5" : "3"}
      </span>
      <span>{name}</span>
      {!done && active && <span className="w-1.5 h-1.5 rounded-full bg-white/70" />}
    </button>
  );
}

/* ── Browser Preview pane ── */

function BrowserPreview({ level }: { level: 0 | 1 | 2 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 px-3 py-1 bg-white rounded-md border border-gray-200 text-[11px] text-gray-500 font-mono truncate">
          🔒 localhost:3000
        </div>
      </div>

      {/* preview body */}
      <div className="flex-1 p-5 lg:p-6 bg-gray-50 flex items-center justify-center min-h-[460px]">
        <PreviewContent level={level} />
      </div>
    </motion.div>
  );
}

function PreviewContent({ level }: { level: 0 | 1 | 2 }) {
  // level 0: empty / placeholder
  // level 1: structure-only (HTML rendered, no CSS) — looks like raw HTML
  // level 2: fully styled
  if (level === 0) {
    return (
      <div className="text-center text-gray-400 text-sm">
        <div className="inline-block w-10 h-10 rounded-full border-2 border-dashed border-gray-300 animate-spin" />
        <div className="mt-3 font-mono">Waiting for index.html…</div>
      </div>
    );
  }

  if (level === 1) {
    // Unstyled
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md self-start text-left text-black"
        style={{ fontFamily: "Times New Roman, serif" }}
      >
        <span style={{ fontSize: "14px" }}>Nowość</span>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: "8px 0" }}>
          Twoja firma w sieci <span style={{ textDecoration: "underline" }}>w 10 dni</span>
        </h1>
        <p style={{ fontSize: "14px", margin: "8px 0" }}>Szybka, nowoczesna strona.</p>
        <button style={{ padding: "4px 8px", border: "1px solid", background: "#eee" }}>Zacznij teraz →</button>
      </motion.div>
    );
  }

  // level 2 — fully styled (matches CSS we just wrote)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md text-center text-white rounded-3xl px-8 py-12 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
      }}
    >
      <span
        className="inline-block px-3.5 py-1 rounded-full text-[11px] font-medium tracking-wide"
        style={{ background: "rgba(255,255,255,0.18)" }}
      >
        Nowość
      </span>
      <h1
        className="font-bold leading-[1.1] mt-4"
        style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}
      >
        Twoja firma w sieci
        <span
          className="block"
          style={{
            background: "linear-gradient(90deg, #fef08a, #fb923c)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          w 10 dni
        </span>
      </h1>
      <p className="mt-4 text-white/90 text-sm">Szybka, nowoczesna strona.</p>
      <button
        className="mt-6 px-7 py-3 rounded-full font-semibold text-sm shadow-lg"
        style={{ background: "white", color: "#6366f1" }}
      >
        Zacznij teraz →
      </button>
    </motion.div>
  );
}
