"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
  animate,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function BeforeAfter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hasDemoed, setHasDemoed] = useState(false);
  const reduced = useReducedMotion();

  // Position as percentage 0..100 — drives both the AFTER clip-path and handle.
  const position = useMotionValue(50);
  const smooth = useSpring(position, { stiffness: 320, damping: 38, mass: 0.6 });
  const clipRight = useTransform(smooth, (v) => `inset(0 ${100 - v}% 0 0)`);
  const handleLeft = useTransform(smooth, (v) => `${v}%`);

  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  // Auto-demo on first viewport entry — sweep handle so users see it's interactive.
  useEffect(() => {
    if (!inView || hasDemoed || reduced) return;
    setHasDemoed(true);
    const seq = async () => {
      await animate(position, 32, { duration: 0.9, ease: EASE });
      await animate(position, 68, { duration: 1.1, ease: EASE });
      await animate(position, 50, { duration: 0.7, ease: EASE });
    };
    seq();
  }, [inView, hasDemoed, reduced, position]);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      position.set(Math.max(0, Math.min(100, pct)));
    },
    [position],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setFromClientX(e.clientX);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const cur = position.get();
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      position.set(Math.max(0, cur - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      position.set(Math.min(100, cur + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      position.set(0);
    } else if (e.key === "End") {
      e.preventDefault();
      position.set(100);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden"
    >
      {/* subtle decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-12 lg:mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Przed vs Po
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-ink leading-[1.1]">
            Zobacz różnicę. Stara strona vs{" "}
            <span className="text-gradient-shimmer">nasza realizacja</span>.
          </h2>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed">
            Przeciągnij suwak, żeby zobaczyć kontrast. Lewa strona — typowa starsza
            strona firmowa (slow, dated design, brak SEO). Prawa — nasza realizacja
            (fast, modern, optymalizowana).
          </p>
        </Reveal>

        <Reveal>
          {/* SLIDER */}
          <div
            ref={containerRef}
            role="slider"
            aria-label="Porównanie starej i nowej strony — przeciągnij suwak"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
            className={cn(
              "relative aspect-[16/10] sm:aspect-video w-full rounded-3xl overflow-hidden",
              "border border-gray-200 shadow-2xl select-none touch-none outline-none",
              "focus-visible:ring-4 focus-visible:ring-primary/30",
              dragging ? "cursor-grabbing" : "cursor-grab",
            )}
          >
            {/* BEFORE — full width base layer */}
            <div className="absolute inset-0">
              <BeforeSite />
            </div>

            {/* AFTER — clipped from the right by motion-driven clip-path */}
            <motion.div
              style={{ clipPath: clipRight }}
              className="absolute inset-0"
            >
              <AfterSite />
            </motion.div>

            {/* divider line + handle */}
            <motion.div
              aria-hidden
              style={{ left: handleLeft }}
              className="absolute top-0 bottom-0 -translate-x-1/2 pointer-events-none"
            >
              <div className="h-full w-0.5 bg-white/90 shadow-[0_0_0_1px_rgba(15,23,42,0.15)]" />
            </motion.div>

            {/* draggable knob — visual only; actual drag handled at container level */}
            <motion.div
              aria-hidden
              style={{ left: handleLeft }}
              className={cn(
                "absolute top-1/2 -translate-x-1/2 -translate-y-1/2",
                "w-12 h-12 rounded-full bg-white shadow-glow",
                "ring-1 ring-black/10",
                "flex items-center justify-center pointer-events-none",
              )}
            >
              <span className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <ChevronLeft className="w-3.5 h-3.5 text-ink" />
              <span className="mx-0.5 w-1 h-1 rounded-full bg-ink/40" />
              <ChevronRight className="w-3.5 h-3.5 text-ink" />
            </motion.div>

            {/* hint label — fades when user starts dragging */}
            <motion.div
              aria-hidden
              animate={{ opacity: dragging || hasDemoed ? 0 : 1 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-ink/85 text-white text-[11px] font-medium backdrop-blur"
            >
              Przeciągnij ↔
            </motion.div>
          </div>
        </Reveal>

        {/* COMPARISON ROW */}
        <Reveal className="mt-12 lg:mt-16 grid sm:grid-cols-3 gap-4 lg:gap-6">
          <CompareCard
            label="Performance"
            before="38/100"
            after="98/100"
            note="~2.6x lepsza"
            tone="primary"
          />
          <CompareCard
            label="SEO"
            before="52/100"
            after="100/100"
            note="pełny audyt + schema"
            tone="secondary"
          />
          <CompareCard
            label="Czas ładowania"
            before="6.2s"
            after="1.4s"
            note="−4.4s na LCP"
            tone="accent"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- BEFORE: an old, slow, ugly site ---------- */

function BeforeSite() {
  return (
    <div
      className="absolute inset-0 bg-[#e8e8e8] overflow-hidden"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* slow loading bar — indeterminate */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300 overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-blue-700"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* basic gray header bar */}
      <div className="absolute top-1 left-0 right-0 bg-gradient-to-b from-[#cfcfcf] to-[#a8a8a8] border-b-2 border-[#666] px-3 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between">
        <div className="text-[10px] sm:text-xs font-bold text-[#000080]">
          FIRMA XYZ Sp. z o.o.
        </div>
        <div className="hidden sm:flex gap-3 text-[11px]">
          <span className="text-blue-700 underline">strona główna</span>
          <span className="text-blue-700 underline">o nas</span>
          <span className="text-blue-700 underline">oferta</span>
          <span className="text-blue-700 underline">kontakt</span>
        </div>
      </div>

      {/* body content */}
      <div className="absolute inset-x-0 top-9 sm:top-12 bottom-0 px-3 sm:px-5 py-3 sm:py-4 text-[11px] sm:text-[13px] text-[#222] leading-snug overflow-hidden">
        <h1 className="text-[17px] sm:text-[22px] font-bold text-[#000080] mb-2">
          Witamy na stronie firmy XYZ Sp. z o.o.
        </h1>
        <p className="mb-2">
          Jesteśmy firmą działającą na rynku od 1998 roku. Oferujemy szeroki
          zakres usług dla naszych klientów. Zapraszamy do zapoznania się z
          naszą ofertą.
        </p>

        {/* fake broken image placeholder */}
        <div className="my-2 w-24 h-16 sm:w-32 sm:h-20 border-2 border-[#888] bg-white flex items-center justify-center text-[10px] text-[#888]">
          [obrazek.gif]
        </div>

        <p className="mb-2">
          W naszej ofercie znajdą Państwo m.in.:{" "}
          <span className="text-blue-700 underline">usługi konsultingowe</span>,{" "}
          <span className="text-blue-700 underline">doradztwo</span> oraz{" "}
          <span className="text-blue-700 underline">obsługę klienta</span>.
        </p>
        <p className="hidden sm:block mb-2 text-[12px]">
          Najnowsze aktualności znajdą Państwo w dziale{" "}
          <span className="text-blue-700 underline">aktualności</span>. Aby
          skontaktować się z nami, prosimy{" "}
          <span className="text-blue-700 underline">kliknij tutaj</span>.
        </p>
        <p className="text-[10px] sm:text-[11px] text-[#555] mt-2">
          Copyright © 2008 Firma XYZ. Wszelkie prawa zastrzeżone. Optymalizowane
          dla Internet Explorer 6.
        </p>
      </div>

      {/* metric badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md bg-red-600 text-white text-[9px] sm:text-[10px] font-mono font-semibold shadow-md whitespace-nowrap">
        LCP: 6.2s · CLS: 0.45 · 38/100
      </div>

      {/* corner pill identifying side */}
      <div
        className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 px-2.5 py-1 rounded-full bg-ink/85 text-white text-[10px] font-medium backdrop-blur"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        PRZED
      </div>
    </div>
  );
}

/* ---------- AFTER: modern, fast, beautiful ---------- */

function AfterSite() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 overflow-hidden">
      {/* aurora glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-cyan-300/30 blur-3xl" />

      {/* faux nav */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between text-white">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white/20 backdrop-blur flex items-center justify-center text-[9px] sm:text-[10px] font-bold">
            D
          </span>
          <span className="font-display font-semibold text-[11px] sm:text-sm tracking-tight">
            twojafirma.pl
          </span>
        </div>
        <div className="hidden sm:flex gap-4 text-[11px] text-white/85">
          <span>Oferta</span>
          <span>Realizacje</span>
          <span>Kontakt</span>
        </div>
      </div>

      {/* hero block */}
      <div className="absolute inset-x-3 sm:inset-x-8 top-12 sm:top-16 text-white">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/15 ring-1 ring-white/20 backdrop-blur text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          Nowość
        </div>
        <h1
          className="mt-2 sm:mt-3 font-display font-bold text-[18px] sm:text-[28px] md:text-[34px] leading-[1.05] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Twoja firma{" "}
          <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
            online
          </span>
        </h1>
        <p className="mt-1.5 sm:mt-2 max-w-md text-[11px] sm:text-[13px] text-white/80 leading-snug">
          Szybko, nowocześnie, z myślą o konwersji. Strony Next.js — 1.4s LCP,
          100/100 SEO.
        </p>
        <div className="mt-3 sm:mt-4 flex gap-2">
          <span className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white text-ink text-[10px] sm:text-xs font-semibold shadow">
            Zacznij teraz
          </span>
          <span className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full ring-1 ring-white/40 text-white text-[10px] sm:text-xs font-semibold">
            Portfolio
          </span>
        </div>
      </div>

      {/* glassmorphism stat cards */}
      <div className="absolute bottom-12 sm:bottom-14 left-3 sm:left-8 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/20 text-white">
        <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/70">
          Konwersja
        </div>
        <div className="font-display font-bold text-base sm:text-xl leading-none">
          +247%
        </div>
      </div>
      <div className="absolute top-16 sm:top-20 right-3 sm:right-8 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/20 text-white">
        <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/70">
          LCP
        </div>
        <div className="font-display font-bold text-base sm:text-xl leading-none">
          1.4s
        </div>
      </div>

      {/* metric badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md bg-emerald-500 text-white text-[9px] sm:text-[10px] font-mono font-semibold shadow-md whitespace-nowrap hidden md:block">
        LCP: 1.4s · CLS: 0.00 · 98/100
      </div>

      {/* corner pill identifying side */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 px-2.5 py-1 rounded-full bg-white text-ink text-[10px] font-semibold shadow">
        PO
      </div>
    </div>
  );
}

/* ---------- compare cards below the slider ---------- */

function CompareCard({
  label,
  before,
  after,
  note,
  tone,
}: {
  label: string;
  before: string;
  after: string;
  note: string;
  tone: "primary" | "secondary" | "accent";
}) {
  const toneRing =
    tone === "primary"
      ? "ring-primary/20"
      : tone === "secondary"
        ? "ring-secondary/20"
        : "ring-accent/20";
  const toneText =
    tone === "primary"
      ? "text-primary"
      : tone === "secondary"
        ? "text-secondary"
        : "text-accent";
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-5 lg:p-6 ring-1 shadow-soft hover:shadow-glow transition-shadow",
        toneRing,
      )}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        {label}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="text-sm font-mono text-gray-400 line-through">
          {before}
        </div>
        <ArrowRight className={cn("w-4 h-4", toneText)} />
        <div
          className={cn(
            "font-display font-bold text-2xl lg:text-3xl text-ink",
          )}
        >
          {after}
        </div>
      </div>
      <div className={cn("mt-2 text-xs font-medium", toneText)}>{note}</div>
    </div>
  );
}

/* ---------- tiny inline icons (no new deps) ---------- */

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
