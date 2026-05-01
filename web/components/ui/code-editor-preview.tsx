"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────
 * CodeEditorPreview — VS Code editor + browser preview, character-by
 * -character typing, with progressive CSS application in the preview
 * (each rule "kicks in" as it finishes typing). Ends with an auto
 * hover demo on the CTA.
 * ───────────────────────────────────────────────────────────────── */

type Token = { text: string; cls?: string };
type Line = Token[];

const cmt = "text-gray-500 italic";
const tag = "text-rose-400";
const attr = "text-sky-300";
const str = "text-amber-300";
const sel = "text-yellow-300";
const prop = "text-cyan-300";
const val = "text-emerald-300";
const num = "text-orange-300";
const kw = "text-fuchsia-400";
const punc = "text-gray-400";

/* HTML — index.html (15 lines) */
const HTML_LINES: Line[] = [
  [{ text: "<!-- index.html -->", cls: cmt }],
  [
    { text: "<section", cls: tag },
    { text: " " },
    { text: "class", cls: attr },
    { text: "=", cls: punc },
    { text: '"hero"', cls: str },
    { text: ">", cls: tag },
  ],
  [
    { text: "  <div", cls: tag },
    { text: " " },
    { text: "class", cls: attr },
    { text: "=", cls: punc },
    { text: '"container"', cls: str },
    { text: ">", cls: tag },
  ],
  [
    { text: "    <span", cls: tag },
    { text: " " },
    { text: "class", cls: attr },
    { text: "=", cls: punc },
    { text: '"badge"', cls: str },
    { text: ">", cls: tag },
    { text: "✨ Nowość" },
    { text: "</span>", cls: tag },
  ],
  [{ text: "    <h1>", cls: tag }],
  [{ text: "      Twoja firma w sieci" }],
  [
    { text: "      <span", cls: tag },
    { text: " " },
    { text: "class", cls: attr },
    { text: "=", cls: punc },
    { text: '"gradient"', cls: str },
    { text: ">", cls: tag },
    { text: "w 14 dni" },
    { text: "</span>", cls: tag },
  ],
  [{ text: "    </h1>", cls: tag }],
  [
    { text: "    <p", cls: tag },
    { text: " " },
    { text: "class", cls: attr },
    { text: "=", cls: punc },
    { text: '"lead"', cls: str },
    { text: ">", cls: tag },
    { text: "Szybka, nowoczesna strona." },
    { text: "</p>", cls: tag },
  ],
  [
    { text: "    <button", cls: tag },
    { text: " " },
    { text: "class", cls: attr },
    { text: "=", cls: punc },
    { text: '"cta"', cls: str },
    { text: ">", cls: tag },
  ],
  [{ text: "      Zacznij teraz" }],
  [
    { text: "      <span", cls: tag },
    { text: " " },
    { text: "class", cls: attr },
    { text: "=", cls: punc },
    { text: '"arrow"', cls: str },
    { text: ">", cls: tag },
    { text: "→" },
    { text: "</span>", cls: tag },
  ],
  [{ text: "    </button>", cls: tag }],
  [{ text: "  </div>", cls: tag }],
  [{ text: "</section>", cls: tag }],
];

/* CSS — styles.css (~33 lines) */
const CSS_LINES: Line[] = [
  [{ text: "/* styles.css */", cls: cmt }],
  [{ text: ".hero", cls: sel }, { text: " {" }],
  [
    { text: "  " },
    { text: "background", cls: prop },
    { text: ": " },
    { text: "linear-gradient", cls: kw },
    { text: "(" },
    { text: "135deg", cls: num },
    { text: ", " },
    { text: "#6366f1", cls: val },
    { text: ", " },
    { text: "#0ea5e9", cls: val },
    { text: ");" },
  ],
  [{ text: "  " }, { text: "padding", cls: prop }, { text: ": " }, { text: "5rem 2rem", cls: num }, { text: ";" }],
  [{ text: "  " }, { text: "border-radius", cls: prop }, { text: ": " }, { text: "24px", cls: num }, { text: ";" }],
  [{ text: "  " }, { text: "color", cls: prop }, { text: ": " }, { text: "white", cls: val }, { text: ";" }],
  [{ text: "  " }, { text: "text-align", cls: prop }, { text: ": " }, { text: "center", cls: val }, { text: ";" }],
  [{ text: "}" }],
  [{ text: ".badge", cls: sel }, { text: " {" }],
  [{ text: "  " }, { text: "display", cls: prop }, { text: ": " }, { text: "inline-block", cls: val }, { text: ";" }],
  [{ text: "  " }, { text: "padding", cls: prop }, { text: ": " }, { text: "4px 14px", cls: num }, { text: ";" }],
  [
    { text: "  " },
    { text: "background", cls: prop },
    { text: ": " },
    { text: "rgba", cls: kw },
    { text: "(" },
    { text: "255,255,255,0.18", cls: num },
    { text: ");" },
  ],
  [{ text: "  " }, { text: "border-radius", cls: prop }, { text: ": " }, { text: "999px", cls: num }, { text: ";" }],
  [{ text: "}" }],
  [{ text: ".gradient", cls: sel }, { text: " {" }],
  [
    { text: "  " },
    { text: "background", cls: prop },
    { text: ": " },
    { text: "linear-gradient", cls: kw },
    { text: "(" },
    { text: "90deg", cls: num },
    { text: ", " },
    { text: "#fef08a", cls: val },
    { text: ", " },
    { text: "#fb923c", cls: val },
    { text: ");" },
  ],
  [{ text: "  " }, { text: "-webkit-background-clip", cls: prop }, { text: ": " }, { text: "text", cls: val }, { text: ";" }],
  [{ text: "  " }, { text: "color", cls: prop }, { text: ": " }, { text: "transparent", cls: val }, { text: ";" }],
  [{ text: "}" }],
  [{ text: ".cta", cls: sel }, { text: " {" }],
  [{ text: "  " }, { text: "padding", cls: prop }, { text: ": " }, { text: "14px 32px", cls: num }, { text: ";" }],
  [{ text: "  " }, { text: "border-radius", cls: prop }, { text: ": " }, { text: "999px", cls: num }, { text: ";" }],
  [{ text: "  " }, { text: "background", cls: prop }, { text: ": " }, { text: "white", cls: val }, { text: ";" }],
  [{ text: "  " }, { text: "color", cls: prop }, { text: ": " }, { text: "#6366f1", cls: val }, { text: ";" }],
  [{ text: "  " }, { text: "font-weight", cls: prop }, { text: ": " }, { text: "600", cls: num }, { text: ";" }],
  [{ text: "  " }, { text: "transition", cls: prop }, { text: ": " }, { text: "all 0.3s ease", cls: val }, { text: ";" }],
  [{ text: "}" }],
  [{ text: ".cta", cls: sel }, { text: ":hover", cls: kw }, { text: " {" }],
  [
    { text: "  " },
    { text: "transform", cls: prop },
    { text: ": " },
    { text: "translateY", cls: kw },
    { text: "(" },
    { text: "-3px", cls: num },
    { text: ");" },
  ],
  [
    { text: "  " },
    { text: "box-shadow", cls: prop },
    { text: ": " },
    { text: "0 12px 28px rgba(0,0,0,0.18)", cls: num },
    { text: ";" },
  ],
  [{ text: "}" }],
];

/* ── helpers ── */

function lineLen(line: Line): number {
  return line.reduce((s, t) => s + t.text.length, 0);
}

function totalChars(lines: Line[]): number {
  return lines.reduce((s, l) => s + lineLen(l) + 1, 0); // +1 newline per line
}

/** Visible-line index given char count. -1 if all lines complete. */
function visibleLineCount(lines: Line[], n: number): number {
  let cum = 0;
  for (let i = 0; i < lines.length; i++) {
    cum += lineLen(lines[i]) + 1;
    if (n < cum) return i; // partially typing line `i`
  }
  return lines.length;
}

/** Render lines up to char `n`, with caret at the typing edge. */
function renderUpToChar(
  lines: Line[],
  n: number,
  showCaret: boolean,
): { nodes: ReactNode[]; renderedLines: number } {
  let remaining = n;
  const nodes: ReactNode[] = [];
  let lineIdx = 0;

  for (const line of lines) {
    if (remaining <= 0) break;
    const len = lineLen(line);

    if (remaining > len) {
      // full line
      nodes.push(
        <div key={lineIdx} className="h-[22px] whitespace-pre">
          {line.map((tok, ti) => (
            <span key={ti} className={tok.cls}>
              {tok.text}
            </span>
          ))}
        </div>,
      );
      remaining -= len + 1; // +1 for newline
    } else {
      // partial line
      const lineNodes: ReactNode[] = [];
      let r = remaining;
      for (let ti = 0; ti < line.length; ti++) {
        const tok = line[ti];
        if (r <= 0) break;
        const visText = tok.text.length <= r ? tok.text : tok.text.slice(0, r);
        lineNodes.push(
          <span key={ti} className={tok.cls}>
            {visText}
          </span>,
        );
        r -= tok.text.length;
      }
      nodes.push(
        <div key={lineIdx} className="h-[22px] whitespace-pre">
          {lineNodes}
          {showCaret && (
            <span className="inline-block w-[7px] h-[15px] bg-primary/85 align-middle ml-0.5 animate-pulse" />
          )}
        </div>,
      );
      remaining = 0;
    }
    lineIdx++;
  }
  return { nodes, renderedLines: lineIdx };
}

/* ── timing ── */

const SPEED_MS = 11; // per character — fast but readable
const FILE_SWITCH_PAUSE_TICKS = 35; // pause ticks between HTML and CSS
const HOVER_DEMO_PAUSE_TICKS = 60;

/* ── main component ── */

export function CodeEditorPreview({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  const [activeFile, setActiveFile] = useState<"html" | "css">("html");
  const [htmlChars, setHtmlChars] = useState(0);
  const [cssChars, setCssChars] = useState(0);
  const [hoverDemo, setHoverDemo] = useState(false);

  const HTML_TOTAL = totalChars(HTML_LINES);
  const CSS_TOTAL = totalChars(CSS_LINES);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setHtmlChars(HTML_TOTAL);
      setCssChars(CSS_TOTAL);
      setActiveFile("css");
      setHoverDemo(true);
      return;
    }

    let cancelled = false;
    let phase: "html" | "pause" | "css" | "hover-pause" | "done" = "html";
    let pauseLeft = 0;
    let hChars = 0;
    let cChars = 0;

    const tick = () => {
      if (cancelled) return;

      if (phase === "html") {
        hChars++;
        setHtmlChars(hChars);
        if (hChars >= HTML_TOTAL) {
          phase = "pause";
          pauseLeft = FILE_SWITCH_PAUSE_TICKS;
        }
      } else if (phase === "pause") {
        pauseLeft--;
        if (pauseLeft <= 0) {
          setActiveFile("css");
          phase = "css";
        }
      } else if (phase === "css") {
        cChars++;
        setCssChars(cChars);
        if (cChars >= CSS_TOTAL) {
          phase = "hover-pause";
          pauseLeft = HOVER_DEMO_PAUSE_TICKS;
        }
      } else if (phase === "hover-pause") {
        pauseLeft--;
        if (pauseLeft <= 0) {
          setHoverDemo(true);
          phase = "done";
        }
      }
    };

    const timer = setInterval(tick, SPEED_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [inView, reduce, HTML_TOTAL, CSS_TOTAL]);

  const htmlVisLines = visibleLineCount(HTML_LINES, htmlChars);
  const cssVisLines = visibleLineCount(CSS_LINES, cssChars);
  const htmlDone = htmlChars >= HTML_TOTAL;
  const cssDone = cssChars >= CSS_TOTAL;

  // Preview level — keyed to which CSS rule has just completed
  let level: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;
  if (htmlVisLines >= 11) level = 1; // raw HTML appears mid-typing
  if (htmlDone) level = 1;
  if (cssVisLines >= 8) level = 2; // .hero rule done
  if (cssVisLines >= 14) level = 3; // .badge done
  if (cssVisLines >= 20) level = 4; // .gradient done
  if (cssVisLines >= 28) level = 5; // .cta done
  if (cssDone) level = 6; // .cta:hover done

  return (
    <div
      ref={ref}
      className={cn("grid lg:grid-cols-2 gap-5 lg:gap-6", className)}
    >
      <Editor
        activeFile={activeFile}
        onSwitch={setActiveFile}
        htmlChars={htmlChars}
        cssChars={cssChars}
        htmlDone={htmlDone}
        cssDone={cssDone}
      />
      <BrowserPreview level={level} hoverDemo={hoverDemo} />
    </div>
  );
}

/* ── Editor pane ── */

function Editor({
  activeFile,
  onSwitch,
  htmlChars,
  cssChars,
  htmlDone,
  cssDone,
}: {
  activeFile: "html" | "css";
  onSwitch: (f: "html" | "css") => void;
  htmlChars: number;
  cssChars: number;
  htmlDone: boolean;
  cssDone: boolean;
}) {
  const lines = activeFile === "html" ? HTML_LINES : CSS_LINES;
  const chars = activeFile === "html" ? htmlChars : cssChars;
  const isDone = activeFile === "html" ? htmlDone : cssDone;
  const totalLines = lines.length;

  const { nodes } = renderUpToChar(lines, chars, !isDone);
  const currentLine = visibleLineCount(lines, chars);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-[#1e1e1e] text-gray-200 font-mono text-[13px] shadow-2xl border border-white/10 overflow-hidden"
    >
      {/* macOS chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#252526] border-b border-black/40">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-gray-400">VS Code — dekada72h</span>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#252526] border-b border-black/40 text-xs">
        <Tab
          name="index.html"
          active={activeFile === "html"}
          done={htmlDone}
          onClick={() => onSwitch("html")}
          icon="html"
        />
        <Tab
          name="styles.css"
          active={activeFile === "css"}
          done={cssDone}
          onClick={() => onSwitch("css")}
          icon="css"
        />
      </div>

      {/* Code */}
      <div className="grid grid-cols-[40px_1fr] min-h-[490px] lg:min-h-[540px] max-h-[540px] overflow-auto">
        <div className="pr-2 py-3 text-right select-none text-gray-600 bg-[#1e1e1e] border-r border-black/20">
          {Array.from({ length: totalLines }, (_, i) => (
            <div key={i} className="h-[22px] leading-[22px] text-[11px]">
              {i + 1}
            </div>
          ))}
        </div>
        <div className="py-3 px-3 leading-[22px]">{nodes}</div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 text-[11px] bg-primary/90 text-white">
        <div className="flex items-center gap-3">
          <span>{activeFile === "html" ? "HTML" : "CSS"}</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln {Math.min(currentLine + 1, totalLines)}, Col 1</span>
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

function BrowserPreview({
  level,
  hoverDemo,
}: {
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  hoverDemo: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 px-3 py-1 bg-white rounded-md border border-gray-200 text-[11px] text-gray-500 font-mono truncate">
          🔒 localhost:3000
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 bg-gray-50 flex items-center justify-center min-h-[490px]">
        <PreviewContent level={level} hoverDemo={hoverDemo} />
      </div>
    </motion.div>
  );
}

function PreviewContent({
  level,
  hoverDemo,
}: {
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  hoverDemo: boolean;
}) {
  if (level === 0) {
    return (
      <div className="text-center text-gray-400 text-sm">
        <div className="inline-block w-9 h-9 rounded-full border-2 border-dashed border-gray-300 animate-spin" />
        <div className="mt-3 font-mono text-xs">Waiting for index.html…</div>
      </div>
    );
  }

  // ── Style tiers ──
  // Each level layers on more styles. We render the SAME JSX regardless;
  // only the inline style objects change based on `level`.

  const heroStyle: CSSProperties =
    level >= 2
      ? {
          background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
          padding: "3.5rem 1.75rem",
          borderRadius: "24px",
          color: "white",
          textAlign: "center",
        }
      : {
          fontFamily: '"Times New Roman", serif',
          color: "black",
          padding: "8px",
        };

  const badgeStyle: CSSProperties =
    level >= 3
      ? {
          display: "inline-block",
          padding: "5px 14px",
          background: "rgba(255,255,255,0.18)",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.02em",
        }
      : { fontSize: "13px" };

  const h1Style: CSSProperties =
    level >= 2
      ? {
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 700,
          margin: "0.9rem 0",
          lineHeight: 1.1,
        }
      : { fontSize: "20px", fontWeight: "bold", margin: "8px 0" };

  const gradientStyle: CSSProperties =
    level >= 4
      ? {
          display: "block",
          background: "linear-gradient(90deg, #fef08a, #fb923c)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }
      : level >= 2
        ? { display: "block" }
        : { textDecoration: "underline" };

  const leadStyle: CSSProperties =
    level >= 2 ? { marginTop: "0.75rem", color: "rgba(255,255,255,0.92)", fontSize: "0.95rem" } : { fontSize: "13px" };

  const ctaStyle: CSSProperties =
    level >= 5
      ? {
          marginTop: "1.5rem",
          padding: "13px 32px",
          background: "white",
          color: "#6366f1",
          borderRadius: "999px",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.95rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
        }
      : { padding: "4px 10px", border: "1px solid #999", background: "#eee", marginTop: "8px" };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={heroStyle}
      className="w-full max-w-md transition-all duration-500"
    >
      {/* badge */}
      <motion.span
        initial={false}
        animate={{ scale: level >= 3 ? 1 : 0.95 }}
        transition={{ duration: 0.4 }}
        style={badgeStyle}
      >
        ✨ Nowość
      </motion.span>

      {/* heading */}
      <h1 style={h1Style}>
        Twoja firma w sieci
        <span style={gradientStyle}>w 14 dni</span>
      </h1>

      {/* lead */}
      <p style={leadStyle}>Szybka, nowoczesna strona.</p>

      {/* CTA — auto-hover demo at level 6 */}
      <motion.button
        style={ctaStyle}
        animate={
          hoverDemo
            ? {
                y: [0, -3, -3, 0, 0],
                boxShadow: [
                  "0 4px 12px rgba(0,0,0,0.10)",
                  "0 14px 30px rgba(0,0,0,0.22)",
                  "0 14px 30px rgba(0,0,0,0.22)",
                  "0 4px 12px rgba(0,0,0,0.10)",
                  "0 4px 12px rgba(0,0,0,0.10)",
                ],
              }
            : { y: 0 }
        }
        transition={{
          duration: 3,
          repeat: hoverDemo ? Infinity : 0,
          ease: "easeInOut",
          times: [0, 0.25, 0.55, 0.85, 1],
        }}
      >
        Zacznij teraz
        <motion.span
          animate={hoverDemo ? { x: [0, 6, 6, 0, 0] } : { x: 0 }}
          transition={{
            duration: 3,
            repeat: hoverDemo ? Infinity : 0,
            ease: "easeInOut",
            times: [0, 0.25, 0.55, 0.85, 1],
          }}
        >
          →
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
